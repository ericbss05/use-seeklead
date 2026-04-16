"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Lead } from "@/components/leads-table"; // Importe l'interface du composant

export async function getLeads(): Promise<Lead[]> {
  const session = await auth();

  if (!session?.user?.id) throw new Error("Unauthorized");

  const leads = await prisma.lead.findMany({
    where: {
      post: {
        accountTracked: { userId: session.user.id }
      }
    },
    include: {
      post: {
        select: {
          accountTracked: { 
            select: { linkedinUrl: true } 
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return leads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    subtitle: lead.subtitle,
    // On force le type ici car Prisma voit une String, mais ton composant attend l'union
    type: lead.type as "commenters" | "likers",
    content: lead.content,
    linkedinDate: lead.linkedinDate,
    urlProfile: lead.urlProfile,
    favorite: lead.favorite,
    postLink: lead.postLink,
  }));
}