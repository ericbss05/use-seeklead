import { scrapeUserSeedAccounts } from "@/services/scrape/accounts";
import { getUser } from "@/lib/get-user";
import { NextResponse } from "next/server";

export async function POST() {
  const { id: userId } = await getUser();
  const result = await scrapeUserSeedAccounts(userId);
  return NextResponse.json(result);
}