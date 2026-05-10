import { inngest } from "./client";
import { scrapeAllSeedAccounts } from "@/services/scrape/accounts";
import { scrapeGlobalPosts } from "@/services/scrape/posts";
import { processLeadsQueue } from "@/services/ai-worker/score";

export const dailyScraperCron = inngest.createFunction(
  {
    id: "daily-linkedin-scrape",
    triggers: [{ cron: "30 18 */2 * *" }],
  },
  async ({ step }) => {
    const result = await step.run("run-global-scraping", async () => {
      return await scrapeGlobalPosts();
    });

    return result;
  }
);

export const cronRefreshAccountPosts = inngest.createFunction(
  {
    id: "refresh-account-posts",
    triggers: [{ cron: "0 */12 * * *" }],
  },// S'exécute toutes les 12 heures
  async ({ step }) => {
    const result = await step.run("scan-all-profiles", async () => {
      return await scrapeAllSeedAccounts();
    });
    return result;
  }
);

export const scoreLeadsCron = inngest.createFunction(
  {
    id: "score-leads-cron",
    triggers: [{ cron: "*/10 * * * *" }],
  },
  async ({ step }) => {
    const result = await step.run("score-pending-leads", async () => {
      return processLeadsQueue();
    });
    return result;
  }
);
