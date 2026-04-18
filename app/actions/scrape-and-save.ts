"use server";

import { prisma } from "@/lib/prisma";


interface LinkedInPostRaw {
  linkedinUrl?: string; // L'URL que l'on cherche dans ton JSON
  [key: string]: unknown;
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
export async function saveScrapedPosts(accountId: string, posts: LinkedInPostRaw[]) {
  // 1. Transformation : On extrait "linkedinUrl" pour le mettre dans "postUrl"
  const dataToInsert = posts
    .filter((post) => post.linkedinUrl) // On ignore ce qui n'a pas d'URL
    .map((post) => {
      // Nettoyage de l'URL (on enlève les paramètres après le ?)
      // C'est CRUCIAL car LinkedIn change les paramètres à chaque clic
      const cleanUrl = post.linkedinUrl!.split('?')[0];

      return {
        accountTrackedId: accountId,
        postUrl: cleanUrl, // On stocke l'URL ici pour la comparaison DB
        data: post as object, // On garde tout le JSON intact à côté
      };
    });

  if (dataToInsert.length === 0) {
    return { success: true, count: 0 };
  }

  // 2. Insertion avec skipDuplicates
  // Ça ne marchera QUE SI ton schéma a : @@unique([accountTrackedId, postUrl])
  const result = await prisma.postTracked.createMany({
    data: dataToInsert,
    skipDuplicates: true, 
  });

  return {
    success: true,
    count: result.count
  };
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