import { prisma } from "@/lib/prisma";

/**
 * Récupère le nombre de comptes actuellement suivis par un utilisateur.
 * Utile pour l'affichage de statistiques simples dans l'interface.
 */
export async function getTrackedAccountsCount(userId: string): Promise<number> {
  return await prisma.accountTracked.count({
    where: { userId },
  });
}

/**
 * Récupère la liste complète des comptes suivis avec leurs IDs.
 */
export async function getTrackedAccountsList(userId: string) {
  return await prisma.accountTracked.findMany({
    where: { userId },
    select: {
      id: true,
      linkedinUrl: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}