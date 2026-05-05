"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/get-user";

/**
 * GET - récupérer les comptes du user connecté
 */
export async function getMySeedAccounts() {
  const user = await getUser();

  if (!user?.id) return [];

  return prisma.seedAccount.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * CREATE - ajouter plusieurs comptes
 */
export async function addSeedAccounts(urls: string[]) {
  const user = await getUser();

  if (!user?.id) throw new Error("Unauthorized");

  const data = urls.map((url) => ({
    userId: user.id,
    linkedinUrl: url,
  }));

  return prisma.seedAccount.createMany({
    data,
    skipDuplicates: true,
  });
}

/**
 * DELETE - supprimer un compte
 */
export async function removeSeedAccount(id: string) {
  const user = await getUser();

  if (!user?.id) throw new Error("Unauthorized");

  return prisma.seedAccount.delete({
    where: {
      id,
    },
  });
}