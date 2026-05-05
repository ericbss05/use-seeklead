import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getModel } from "@/ai-configs/models";
import { icpExpansionPrompt } from "@/ai-configs/prompts";

export async function POST(req: Request) {
  try {
    // 1. Parsing du corps sans variable d'erreur inutile
    const body = await req.json().catch(() => null);
    const jobTitle = body?.jobTitle;

    if (!jobTitle) {
      return NextResponse.json(
        { error: "jobTitle missing" },
        { status: 400 }
      );
    }

    console.log("INPUT:", jobTitle);

    // 2. Appel IA
    const result = await generateText({
      model: getModel(),
      prompt: icpExpansionPrompt(jobTitle),
    });

    console.log("RAW OUTPUT:", result.text);

    if (!result.text) {
      return NextResponse.json(
        { error: "Empty AI response" },
        { status: 500 }
      );
    }

    // 3. Extraction du JSON
    const match = result.text.match(/\[[\s\S]*\]/);

    if (!match) {
      return NextResponse.json(
        {
          error: "No JSON array found in response",
          raw: result.text,
        },
        { status: 500 }
      );
    }

    // 4. Parsing sécurisé (Optional Catch Binding)
    let variants: unknown;

    try {
      variants = JSON.parse(match[0]);
    } catch {
      // ✅ Correction ESLint : On omet la variable d'erreur car on ne l'utilise pas
      return NextResponse.json(
        {
          error: "JSON parse failed",
          raw: result.text,
        },
        { status: 500 }
      );
    }

    // 5. Validation finale
    if (!Array.isArray(variants)) {
      return NextResponse.json(
        {
          error: "AI output is not an array",
          raw: result.text,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      variants,
    });

  } catch (error: unknown) {
    // ✅ Correction ESLint : 'unknown' avec vérification de type
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    console.error("FATAL ERROR:", errorMessage);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}