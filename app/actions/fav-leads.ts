"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function toggleLeadFavorite(leadId: string) {
  const session = await auth();

  if (!session?.user?.id) throw new Error("Unauthorized");

  // On récupère le lead pour vérifier l'appartenance ET l'état actuel
  const lead = await prisma.lead.findFirst({
    where: {
      id: leadId,
      post: {
        accountTracked: { userId: session.user.id }
      }
    },
    select: { favorite: true }
  });

  if (!lead) throw new Error("Lead not found or access denied");

  // Mise à jour et retour du nouvel objet
  return await prisma.lead.update({
    where: { id: leadId },
    data: {
      favorite: !lead.favorite,
    },
  });
}