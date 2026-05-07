// app/api/test-scrape/route.ts

import { scrapeUserPosts } from "@/services/scrape/posts";
import { getUser } from "@/lib/get-user";
import { NextResponse } from "next/server";

export async function POST() {
    const { id: userId } = await getUser();
  const result = await scrapeUserPosts(userId);
  return NextResponse.json(result);
}

