import { prisma } from "@/lib/prisma";

/**
 * Types Apify (MVP strict mais safe)
 */
export type ApifyPost = {
  id: string;
  linkedinUrl: string;
  content?: string;

  author?: {
    name?: string;
    avatar?: {
      url?: string;
    };
  };

  postImages?: string[];

  postVideo?: {
    videoUrl?: string;
  };

  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
  };

  postedAt?: {
    date?: string;
  };
};

/**
 * Save scraped posts into DB (idempotent)
 */
export async function savePosts(
  seedAccountId: string,
  posts: ApifyPost[]
) {
  if (!posts || posts.length === 0) {
    return { created: 0 };
  }

  let created = 0;

  for (const post of posts) {
    try {
      await prisma.post.upsert({
        where: {
          seedAccountId_externalId: {
            seedAccountId,
            externalId: post.id,
          },
        },
        update: {
          // MVP: no update logic for now
        },
        create: {
          seedAccountId,

          externalId: post.id,
          linkedinUrl: post.linkedinUrl,

          content: post.content ?? null,

          authorName: post.author?.name ?? null,
          authorAvatar: post.author?.avatar?.url ?? null,

          imageUrl: post.postImages?.[0] ?? null,
          videoUrl: post.postVideo?.videoUrl ?? null,

          likes: post.engagement?.likes ?? 0,
          comments: post.engagement?.comments ?? 0,
          shares: post.engagement?.shares ?? 0,

          postedAt: post.postedAt?.date
            ? new Date(post.postedAt.date)
            : null,
        },
      });

      created++;
    } catch (error) {
      console.error("[posts.actions] savePosts error:", error);
      continue;
    }
  }

  return {
    created,
    total: posts.length,
  };
}