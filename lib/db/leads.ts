import { prisma } from "@/lib/prisma";

export async function getLeadsByUser(userId: string) {
  return prisma.lead.findMany({
    where: {
      post: {
        seedAccount: {
          userId,
        },
      },
    },

    include: {
      post: {
        include: {
          seedAccount: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAllLeads() {
  return prisma.lead.findMany({
    include: {
      post: {
        include: {
          seedAccount: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Get pending leads (for AI worker / queue)
 */
export async function getPendingLeads() {
  return prisma.lead.findMany({
    where: {
      status: "PENDING",
    },

    include: {
      post: {
        include: {
          seedAccount: true,
        },
      },
    },

    orderBy: {
      createdAt: "asc",
    },

  });
}