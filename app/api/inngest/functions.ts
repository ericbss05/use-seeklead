import { executeProfilePostsScraping } from "@/app/services/scrape/accounts";
import { inngest } from "./client";
import { executeGlobalScraping } from "@/app/services/scrape/posts";

export const dailyScraperCron = inngest.createFunction(
  {
    id: "daily-linkedin-scrape",
    triggers: [{ cron: "30 18 */2 * *" }],
  },
  async ({ step }) => {
    const result = await step.run("run-global-scraping", async () => {
      return await executeGlobalScraping();
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
      return await executeProfilePostsScraping();
    });
    return result;
  }
);