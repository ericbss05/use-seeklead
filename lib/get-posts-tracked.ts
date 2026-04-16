import { prisma } from "@/lib/prisma";

/**
 * Récupère le nombre total de posts scrapés pour tous les comptes d'un utilisateur.
 */
export async function getTotalScrapedPostsCount(userId: string): Promise<number> {
  return await prisma.postTracked.count({
    where: {
      accountTracked: {
        userId: userId,
      },
    },
  });
}

/**
 * Récupère la liste des derniers posts scrapés pour un utilisateur spécifique.
 * Inclut l'URL du compte d'origine pour plus de clarté dans l'UI.
 */
export async function getScrapedPostsList(userId: string, limit = 50) {
  return await prisma.postTracked.findMany({
    where: {
      accountTracked: {
        userId: userId,
      },
    },
    select: {
      id: true,
      data: true, // Contient le JSON brut du post (texte, images, etc.)
      createdAt: true,
      accountTracked: {
        select: {
          linkedinUrl: true,
        },
      },
      _count: {
        select: { leads: true }, // Donne le nombre de commentaires/likes rattachés
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
}

/**
 * Récupère les posts d'un SEUL compte LinkedIn spécifique.
 */
export async function getPostsByAccount(accountId: string) {
  return await prisma.postTracked.findMany({
    where: {
      accountTrackedId: accountId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}