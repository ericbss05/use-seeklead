import { serve } from "inngest/next";
import { inngest } from "./client";
import {
  cronRefreshAccountPosts,
  dailyScraperCron,
  scoreLeadsCron,
  scoreLeadsOnIngestion,
} from "./functions";

// Ajoute cette ligne pour éviter la mise en cache statique par Next.js
export const dynamic = "force-dynamic";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    dailyScraperCron,
    cronRefreshAccountPosts,
    scoreLeadsCron,
    scoreLeadsOnIngestion,
  ],
});
