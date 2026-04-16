"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Met à jour l'intégralité de la liste (logique existante)
 */
export async function updateTrackedAccounts(urls: string[]) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Utilisateur non authentifié.");
  }

  const userId = session.user.id;

  try {
    await prisma.$transaction([
      prisma.accountTracked.deleteMany({
        where: { userId: userId },
      }),
      prisma.accountTracked.createMany({
        data: urls.map((url) => ({
          linkedinUrl: url,
          userId: userId,
        })),
      }),
    ]);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour des comptes:", error);
    return { success: false, error: "Erreur base de données" };
  }
}

/**
 * Supprime un compte spécifique par son ID
 */
export async function deleteTrackedAccount(accountId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Utilisateur non authentifié.");
  }

  try {
    // On ajoute le userId dans le WHERE pour s'assurer que l'utilisateur
    // ne peut pas supprimer le compte de quelqu'un d'autre via l'API.
    await prisma.accountTracked.delete({
      where: {
        id: accountId,
        userId: session.user.id,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    return { success: false, error: "Erreur lors de la suppression." };
  }
}