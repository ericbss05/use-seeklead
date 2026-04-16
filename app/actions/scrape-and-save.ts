"use server";

import { prisma } from "@/lib/prisma";

interface RawPost {
  url?: string;
  postUrl?: string;
  content?: string;
  [key: string]: string | number | boolean | object | null | undefined | unknown; // Permet de stocker d'autres champs variables dans le Json Prisma
}

interface RawLead {
  postTrackedId?: string;
  type?: string;
  profileUrl?: string;
  urlProfile?: string;
  url_profile?: string;
  fullName?: string;
  name?: string;
  subtitle?: string;
  occupation?: string;
  commentText?: string;
  content?: string;
  Content?: string;
  datetime?: string;
  Datetime?: string;
  timestamp?: string | number;
  Timestamp?: string | number;
  postUrl?: string;
  post_Link?: string;
}

/**
 * Enregistre les posts scrapés.
 * On utilise skipDuplicates pour ne pas supprimer les posts existants (et donc garder les leads liés).
 */
export async function saveScrapedPosts(accountId: string, posts: RawPost[]) {
  return await prisma.postTracked.createMany({
    data: posts.map((post) => ({
      accountTrackedId: accountId,
      // On suppose que l'URL du post est dans post.url ou post.postUrl
      postUrl: post.url || post.postUrl || null, 
      data: post as object,
    })),
    skipDuplicates: true, 
  });
}

/**
 * Enregistre les leads pour un post.
 * Cette fonction récupère maintenant le userId du compte source pour permettre l'automatisation.
 */
export async function saveLeads(
  mode: "SINGLE" | "MULTIPLE", 
  leadsData: RawLead[], 
  specificPostId?: string
) {
  // 1. Identifier un postId de référence pour trouver le propriétaire (userId)
  const samplePostId = specificPostId || leadsData.find(l => l.postTrackedId)?.postTrackedId;

  if (!samplePostId) {
    console.error("❌ Impossible de trouver un postId pour identifier l'utilisateur.");
    return { success: false, count: 0 };
  }

  // 2. Récupérer le userId à partir de la hiérarchie Post -> AccountTracked
  // C'est cette étape qui permet l'automatisation sans session utilisateur !
  const postOwner = await prisma.postTracked.findUnique({
    where: { id: samplePostId },
    select: {
      accountTracked: {
        select: { userId: true }
      }
    }
  });

  if (!postOwner) {
    console.error("❌ Le post parent n'existe pas en base.");
    return { success: false, count: 0 };
  }

  const userId = postOwner.accountTracked.userId;

  // 3. Préparation des données avec le userId injecté
  const dataToInsert = leadsData.map((lead) => {
    const finalPostId = mode === "MULTIPLE" ? lead.postTrackedId : specificPostId;
    const url = lead.profileUrl || lead.urlProfile || lead.url_profile || "";

    if (!finalPostId || !url) return null;

    return {
      userId: userId, // Injecté automatiquement
      postTrackedId: finalPostId,
      type: lead.type || "commenters",
      urlProfile: url,
      name: lead.fullName || lead.name || "Inconnu",
      subtitle: lead.subtitle || lead.occupation || null,
      content: lead.commentText || lead.content || lead.Content || null,
      linkedinDate: lead.datetime || lead.Datetime || null,
      timestamp: (lead.timestamp || lead.Timestamp) ? BigInt(lead.timestamp || lead.Timestamp!) : null,
      postLink: lead.postUrl || lead.post_Link || null,
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null);

  if (dataToInsert.length === 0) return { success: false, count: 0 };

  // 4. Insertion avec gestion des doublons (via l'index @@unique[userId, urlProfile])
  return await prisma.lead.createMany({
    data: dataToInsert,
    skipDuplicates: true, 
  });
}