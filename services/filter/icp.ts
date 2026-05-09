import { getKeywordsIcp } from "@/lib/db/icp";

type ApifyLead = {
  subtitle?: string | null;
};

export async function qualifyLead(
  lead: ApifyLead
) {
  const keywords = await getKeywordsIcp();

  const subtitle =
    lead.subtitle?.toLowerCase() || "";

  const matchedKeywords = keywords.filter(
    (keyword): keyword is string =>
      typeof keyword === "string" &&
      subtitle.includes(keyword.toLowerCase())
  );

  return {
    qualified: matchedKeywords.length > 0,
    matchedKeywords,
  };
}