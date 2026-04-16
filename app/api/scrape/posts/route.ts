import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { executeGlobalScraping } from "@/app/services/scrape/posts";

export async function POST() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await executeGlobalScraping();
    return NextResponse.json(result);
  } catch (error: unknown) {
    // On extrait le message de manière sécurisée
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    
    console.error("[MANUAL_SCRAPE_ERROR]:", errorMessage);
    
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage }, 
      { status: 500 }
    );
  }
}