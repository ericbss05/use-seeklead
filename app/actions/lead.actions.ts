import { prisma } from "@/lib/prisma";

/**
 * Shape minimal coming from Apify
 */
type ApifyLead = Record<string, unknown>;

/**
 * Normalized lead before saving
 */
type NormalizedLead = {
  type: string;
  urlProfile: string;
  name: string;
  subtitle: string | null;
  content: string | null;
  score: number | null;
  aiFeedback: string | null;
  timestamp: number | null;
};

/**
 * Save leads for a post
 */
export async function saveLeads(
  postId: string,
  leads: ApifyLead[]
) {
  if (!leads.length) {
    return { created: 0 };
  }

  const data: NormalizedLead[] = leads.map((lead) => {
    const l = lead as Record<string, unknown>;

    return {
      type: typeof l.type === "string" ? l.type : "liker",
      urlProfile:
  typeof l.urlProfile === "string"
    ? l.urlProfile
    : typeof l.url_profile === "string"
    ? l.url_profile
    : typeof l.url === "string"
    ? l.url
    : "",
      name:
        typeof l.name === "string"
          ? l.name
          : "Unknown",

      subtitle:
        typeof l.subtitle === "string"
          ? l.subtitle
          : null,

      content:
        typeof l.content === "string"
          ? l.content
          : null,

      score:
        typeof l.score === "number"
          ? l.score
          : null,

      aiFeedback:
        typeof l.aiFeedback === "string"
          ? l.aiFeedback
          : null,

      timestamp:
        typeof l.timestamp === "number"
          ? l.timestamp
          : null,
    };
  });

  await prisma.lead.createMany({
    data: data.map((l) => ({
      postId,
      type: l.type,
      urlProfile: l.urlProfile,
      name: l.name,
      subtitle: l.subtitle,
      content: l.content,
      score: l.score,
      aiFeedback: l.aiFeedback,
      timestamp: l.timestamp,
    })),
    skipDuplicates: true,
  });

  return {
    created: data.length,
  };
}

/**
 * Get leads by user
 */
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
      post: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Get leads by post
 */
export async function getLeadsByPost(postId: string) {
  return prisma.lead.findMany({
    where: {
      postId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Delete leads by post
 */
export async function deleteLeadsByPost(postId: string) {
  return prisma.lead.deleteMany({
    where: {
      postId,
    },
  });
}