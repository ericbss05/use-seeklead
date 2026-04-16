import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { executeProfilePostsScraping } from "@/app/services/scrape/accounts";

export const runtime = 'nodejs';

export async function POST() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const result = await executeProfilePostsScraping();

    return NextResponse.json({
      success: true,
      message: "Scan des profils terminé",
      totalScraped: result.total
    });

  } catch (error: unknown) { // 1. On utilise 'unknown' au lieu de 'any'
    // 2. On vérifie si c'est une instance d'Error pour accéder à .message
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    
    console.error("❌ [MANUAL_PROFILE_SCRAPE_ERROR]:", errorMessage);
    
    return NextResponse.json({ 
      error: "Erreur lors du scan manuel", 
      details: errorMessage 
    }, { status: 500 });
  }
}