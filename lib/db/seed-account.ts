import { prisma } from "@/lib/prisma";

/**
 * Get all seed accounts for a user (UI)
 */
export async function getSeedAccounts(userId: string) {
  if (!userId) return [];

  return prisma.seedAccount.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Check if user has at least one seed account (routing / guard)
 */
export async function hasSeedAccount(userId: string): Promise<boolean> {
  if (!userId) return false;

  const count = await prisma.seedAccount.count({
    where: { userId },
  });

  return count > 0;
}