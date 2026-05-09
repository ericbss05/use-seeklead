import { prisma } from "@/lib/prisma";

/**
 * Type minimal basé sur la réponse Apify
 */
export type ScrapedPost = {
  id: string;
  content: string;
  linkedinUrl: string;
  author?: {
    name?: string;
    linkedinUrl?: string;
  };
  postedAt?: {
    timestamp: number;
    date: string;
  };
  postImages?: string[];
  postVideo?: {
    videoUrl?: string;
    thumbnailUrl?: string;
  };
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
  };
};

/**
 * Save posts scraped into DB
 */
export async function savePosts(
  seedAccountId: string,
  posts: ScrapedPost[]
) {
  if (!posts?.length) return { created: 0 };

  const data = posts.map((post) => ({
    externalId: post.id,
    content: post.content,
    linkedinUrl: post.linkedinUrl,

    authorName: post.author?.name ?? null,
    authorUrl: post.author?.linkedinUrl ?? null,

    postedAt: post.postedAt?.date ?? null,
    postedTimestamp: post.postedAt?.timestamp ?? null,

    likes: post.engagement?.likes ?? 0,
    comments: post.engagement?.comments ?? 0,
    shares: post.engagement?.shares ?? 0,

    images: post.postImages ?? [],
    videoUrl: post.postVideo?.videoUrl ?? null,

    seedAccountId,
  }));

  await prisma.post.createMany({
    data,
    skipDuplicates: true,
  });

  return { created: data.length };
}

/**
 * Get posts for UI (feed)
 */
export async function getAllPostsByUser(userId: string) {
  return prisma.post.findMany({
    where: {
      seedAccount: {
        userId,
      },
    },
    orderBy: {
      postedAt: "desc",
    },
  });
}

export async function getLastPostsByUser(userId: string) {
  return prisma.post.findMany({
    where: {
      seedAccount: {
        userId,
      },
    },
    orderBy: {
      postedAt: "desc",
    },
    take:5,
    select: {
       id: true,
       linkedinUrl: true,
    },
  });
}

export async function getLastPostsPerUser() {
    return prisma.seedAccount.findMany({
    include: {
      posts: {
        orderBy: {
          postedAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          linkedinUrl: true,
    },
      },
    },
  });
}

export async function getPostContentById(postId: string) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
      content: true,
    },
  });

  return post;
}
