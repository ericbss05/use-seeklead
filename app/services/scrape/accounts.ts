import { prisma } from "@/lib/prisma";
import { saveScrapedPosts } from "@/app/actions/scrape-and-save";

const ACTOR_ID = "A3cAPGpwBEG8RJwse";

export async function executeProfilePostsScraping() {
  const accounts = await prisma.accountTracked.findMany({
    where: {
      NOT: {
        linkedinUrl: undefined,
      },
    },
  });

  if (accounts.length === 0) return { success: true, count: 0 };

  let totalPostsScraped = 0;

  for (const account of accounts) {
    const apifyUrl = `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${process.env.APIFY_API_TOKEN}&clean=1&timeout=120`;

    const response = await fetch(apifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetUrls: [account.linkedinUrl!],
        maxPosts: 5,
        includeQuotePosts: true,
        includeReposts: true,
        scrapeReactions: false,
      }),
    });

    if (!response.ok) continue;

    const posts = await response.json();
    await saveScrapedPosts(account.id, posts as Record<string, unknown>[]);
    totalPostsScraped += posts.length;
  }

  return { success: true, total: totalPostsScraped };
}