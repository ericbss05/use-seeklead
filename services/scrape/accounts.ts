import { prisma } from "@/lib/prisma";
import { savePosts } from "@/app/actions/posts.actions";

const ACTOR_ID = "A3cAPGpwBEG8RJwse";

/**
 * DB - all accounts
 */
export async function getAllSeedAccounts() {
  return prisma.seedAccount.findMany({
    where: {
      linkedinUrl: { not: "" },
    },
  });
}

/**
 * DB - user accounts
 */
export async function getUserSeedAccounts(userId: string) {
  return prisma.seedAccount.findMany({
    where: {
      userId,
    },
  });
}

/**
 * APIFY SCRAPER
 */
async function scrapeAccounts(
  accounts: { id: string; linkedinUrl: string | null }[]
) {
  if (accounts.length === 0) {
    return { success: true, total: 0 };
  }

  let totalPostsScraped = 0;

  await Promise.allSettled(
    accounts.map(async (account) => {
      try {
        if (!account.linkedinUrl) return;

        const apifyUrl = `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${process.env.APIFY_API_TOKEN}&clean=1&timeout=120`;

        const response = await fetch(apifyUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetUrls: [account.linkedinUrl],
            maxPosts: 5,
            includeQuotePosts: true,
            includeReposts: true,
            scrapeReactions: false,
          }),
        });

        if (!response.ok) {
          console.error(`[scrape] failed: ${account.linkedinUrl}`);
          return;
        }

        const posts = await response.json();

        console.log(
          `[scrape] ${account.linkedinUrl} — ${posts.length} posts`
        );

        totalPostsScraped += posts.length;

        // 🔥 SAVE POSTS (NEW CLEAN ARCHITECTURE)
        await savePosts(account.id, posts);
      } catch (err) {
        console.error(`[scrape] error`, err);
      }
    })
  );

  return { success: true, total: totalPostsScraped };
}

/**
 * PUBLIC API
 */
export async function scrapeAllSeedAccounts() {
  const accounts = await getAllSeedAccounts();
  return scrapeAccounts(accounts);
}

export async function scrapeUserSeedAccounts(userId: string) {
  const accounts = await getUserSeedAccounts(userId);
  return scrapeAccounts(accounts);
}