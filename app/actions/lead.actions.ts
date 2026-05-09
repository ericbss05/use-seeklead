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

  keywords: string[];
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

  const data: NormalizedLead[] = leads.map(
    (lead) => {
      const l = lead as Record<
        string,
        unknown
      >;

      return {
        type:
          typeof l.type === "string"
            ? l.type
            : "liker",

        urlProfile:
          typeof l.urlProfile ===
          "string"
            ? l.urlProfile
            : typeof l.url_profile ===
              "string"
            ? l.url_profile
            : typeof l.url === "string"
            ? l.url
            : "",

        name:
          typeof l.name === "string"
            ? l.name
            : "Unknown",

        subtitle:
          typeof l.subtitle ===
          "string"
            ? l.subtitle
            : null,

        content:
          typeof l.Content ===
          "string"
            ? l.Content
            : null,

        score:
          typeof l.score === "number"
            ? l.score
            : null,

        aiFeedback:
          typeof l.aiFeedback ===
          "string"
            ? l.aiFeedback
            : null,

        timestamp:
          typeof l.timestamp ===
          "number"
            ? l.timestamp
            : null,

        keywords: Array.isArray(
          l.matchedKeywords
        )
          ? l.matchedKeywords.filter(
              (
                k
              ): k is string =>
                typeof k === "string"
            )
          : [],
      };
    }
  );

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

      keywords: l.keywords,
    })),

    skipDuplicates: true,
  });

  return {
    created: data.length,
  };
}

export async function deleteLeadsByPost(
  postId: string
) {
  return prisma.lead.deleteMany({
    where: {
      postId,
    },
  });
}

export async function updateLeadScore(
  leadId: string,
  score: number,
  feedback: string
) {
  return prisma.lead.update({
    where: {
      id: leadId,
    },

    data: {
      score,
      aiFeedback: feedback,

      status: "DONE",
    },
  });
}