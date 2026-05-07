import {
  getLastPostsByUser,
  getLastPostsPerUser,
} from "@/lib/db/posts";

import { saveLeads } from "@/app/actions/lead.actions";

const ACTOR_ID =
  "scraping_solutions~linkedin-posts-engagers-likers-and-commenters-download";

type DbPost = {
  id: string;
  linkedinUrl: string;
};

/**
 * USER POSTS
 */
export async function scrapeUserPosts(userId: string) {
  const posts = await getLastPostsByUser(userId);

  return scrapePosts(posts);
}

/**
 * GLOBAL POSTS
 */
export async function scrapeGlobalPosts() {
  const accounts = await getLastPostsPerUser();

  const posts: DbPost[] = accounts.flatMap(
    (a) => a.posts
  );

  return scrapePosts(posts);
}

/**
 * CALL APIFY
 */
async function scrapePost(linkedinUrl: string) {
  const response = await fetch(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${process.env.APIFY_API_TOKEN}&clean=1`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        urls: [linkedinUrl],
        resultsLimit: 100,
        type: "commenters",
      }),
    }
  );

  if (!response.ok) return [];

  const data = await response.json();

  return Array.isArray(data) ? data : [];
}

/**
 * MAIN SCRAPER LOOP
 */
async function scrapePosts(posts: DbPost[]) {
  let total = 0;

  const results = [];

  for (const post of posts) {
    try {
      const leads = await scrapePost(post.linkedinUrl);

      total += leads.length;

      // ✅ FIX IMPORTANT: use post.id
      await saveLeads(post.id, leads);

      results.push({
        postId: post.id,
        linkedinUrl: post.linkedinUrl,
        leads,
      });

      console.log(
        `[scrape] ${post.linkedinUrl} → ${leads.length}`
      );
    } catch (err) {
      console.error("[scrape error]", err);
    }
  }

  return {
    success: true,
    total,
    results,
  };
}