"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/get-user";

/**
 * GET - récupérer l'ICP du user connecté
 */
export async function getMyIcp() {
  const user = await getUser();

  if (!user?.id) return null;

  return prisma.icp.findUnique({
    where: {
      userId: user.id,
    },
  });
}

/**
 * UPSERT - créer ou update l'ICP du user
 * (1 ICP par user dans ton modèle actuel)
 */
export async function saveMyIcp(keywords: string[]) {
  const user = await getUser();

  if (!user?.id) throw new Error("Unauthorized");

  return prisma.icp.upsert({
    where: {
      userId: user.id,
    },
    create: {
      userId: user.id,
      keywords,
    },
    update: {
      keywords,
    },
  });
}

/**
 * DELETE - supprimer ICP du user
 */
export async function deleteMyIcp() {
  const user = await getUser();

  if (!user?.id) throw new Error("Unauthorized");

  return prisma.icp.delete({
    where: {
      userId: user.id,
    },
  });
}