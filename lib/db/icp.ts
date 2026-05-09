import { prisma } from "@/lib/prisma";

/**
 * Get ICP for a user
 */
export async function getIcp(userId: string) {
  if (!userId) return null;

  return prisma.icp.findUnique({
    where: { userId },
  });
}

export async function getKeywordsIcp() {
  const icps = await prisma.icp.findMany({
    select: {
      keywords: true,
    },
  });

  return icps.flatMap((icp) => icp.keywords ?? []);
}
/**
 * Check if user has an ICP
 */
export async function hasIcp(userId: string): Promise<boolean> {
  if (!userId) return false;

  const count = await prisma.icp.count({
    where: { userId },
  });

  return count > 0;
}

/**
 * Create or update ICP (upsert)
 */
export async function upsertIcp(userId: string, keywords: string[]) {
  return prisma.icp.upsert({
    where: {
      userId, // ⚠️ nécessite @unique dans Prisma
    },
    create: {
      userId,
      keywords,
    },
    update: {
      keywords,
    },
  });
}