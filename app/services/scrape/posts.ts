import { prisma } from "@/lib/prisma";
import { saveLeads } from "@/app/actions/scrape-and-save";
import { Prisma } from "@prisma/client";

const ACTOR_ID = "scraping_solutions~linkedin-posts-engagers-likers-and-commenters-download";

// On définit une interface pour le contenu de la colonne JSON 'data'
interface PostDataContent {
  linkedinUrl?: string;
  [key: string]: unknown;
}

// On définit le type attendu pour les items venant d'Apify
interface ApifyLeadItem {
  post_Link: string;
  [key: string]: unknown;
}

export async function executeGlobalScraping() {
  // 1. Récupération des comptes
  const accounts = await prisma.accountTracked.findMany({
    select: { id: true }
  });

  if (accounts.length === 0) return { success: true, count: 0 };

  // 2. Récupération des 5 derniers posts par utilisateur
  const nestedPosts = await Promise.all(
    accounts.map((account) =>
      prisma.postTracked.findMany({
        where: {
          accountTrackedId: account.id,
          data: {
            path: ['linkedinUrl'],
            not: Prisma.AnyNull
          }
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      })
    )
  );

  const allPosts = nestedPosts.flat();
  if (allPosts.length === 0) return { success: true, count: 0 };

  // 3. Préparation du mapping URL -> [ID_POSTS]
  const postMap = new Map<string, string[]>();
  const urls: string[] = [];

  allPosts.forEach((p) => {
    // Cast sécurisé du JSON Prisma vers notre interface
    const content = p.data as unknown as PostDataContent;
    const url = content?.linkedinUrl;

    if (url) {
      const existing = postMap.get(url) || [];
      postMap.set(url, [...existing, p.id]);
      urls.push(url);
    }
  });

  const uniqueUrls = Array.from(new Set(urls));

  // 4. Appel APIFY
  const apifyUrl = `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${process.env.APIFY_API_TOKEN}`;
  
  const response = await fetch(apifyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      urls: uniqueUrls,
      type: "commenters",
      resultsLimit: 20,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Apify error (${response.status}): ${errorText}`);
  }

  const items = (await response.json()) as ApifyLeadItem[];

  // 5. Mapping des leads vers les IDs de posts
  const leadsWithIds = items.flatMap((item) => {
    const targetPostIds = postMap.get(item.post_Link) || [];
    return targetPostIds.map((id) => ({
      ...item,
      postTrackedId: id,
    }));
  });

  // 6. Sauvegarde et mise à jour
  if (leadsWithIds.length > 0) {
    await saveLeads("MULTIPLE", leadsWithIds);
  }

  await prisma.postTracked.updateMany({
    where: { id: { in: allPosts.map(p => p.id) } },
    data: { updatedAt: new Date() }
  });

  return { success: true, count: leadsWithIds.length };
}