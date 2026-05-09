import { generateObject } from "ai";
import { z } from "zod";
import { getModel } from "@/ai-configs/models";
import { iaScoringLead } from "@/ai-configs/prompts";
import { getPendingLeads } from "@/lib/db/leads";
import { getPostContentById } from "@/lib/db/posts";
import { updateLeadScore } from "@/app/actions/lead.actions";

// --- Interfaces ---

interface Lead {
  id: string;
  name: string;
  subtitle?: string | null;
  content?: string | null;
  postId?: string | null;
}

interface PreparedLead {
  id: string;
  name: string;
  subtitle: string;
  content: string;
  postContent: string;
}

interface AnalysisResult {
  leadId: string;
  score: number;
  feedback: string;
}

interface ProcessQueueResponse {
  processed: number;
  results: AnalysisResult[];
  status: "SUCCESS" | "PARTIAL" | "EMPTY";
}

// --- Configuration ---

const model = getModel();
const BATCH_SIZE = 5; 
const DELAY_BETWEEN_BATCHES_MS = 5000; 

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- Fonctions ---

/**
 * Analyse un groupe de leads en une seule requête IA
 */
async function analyzeLeadsBatch(leads: PreparedLead[]): Promise<AnalysisResult[]> {
  // iaScoringLead doit être capable de traiter PreparedLead[] pour construire le prompt
  const prompt = iaScoringLead(leads); 

  const { object } = await generateObject({
    model,
    schema: z.object({
      results: z.array(
        z.object({
          leadId: z.string().describe("L'ID original du lead fourni en entrée"),
          score: z.number().int().min(0).max(100),
          feedback: z.string().describe("Explication concise du score"),
        })
      ).describe("Liste des analyses pour chaque lead du batch"),
    }),
    prompt: prompt,
  });

  return object.results;
}

/**
 * Traite la file d'attente des leads non scorés
 */
export async function processLeadsQueue(): Promise<ProcessQueueResponse> {
  const allLeads: Lead[] = await getPendingLeads();
  
  if (allLeads.length === 0) {
    return { processed: 0, results: [], status: "EMPTY" };
  }

  const finalResults: AnalysisResult[] = [];
  const postCache = new Map<string, string | null>();

  console.log(`📦 Début du traitement par batch (Taille: ${BATCH_SIZE}, Total: ${allLeads.length})`);

  for (let i = 0; i < allLeads.length; i += BATCH_SIZE) {
    const currentBatch = allLeads.slice(i, i + BATCH_SIZE);
    
    try {
      // 1. Préparation des données (Mapping & Mise en cache des posts)
      const preparedLeads: PreparedLead[] = await Promise.all(
        currentBatch.map(async (lead) => {
          const cacheKey = lead.postId ?? "no-post";
          let postContent = postCache.get(cacheKey);

          if (postContent === undefined) {
            const post = lead.postId ? await getPostContentById(lead.postId) : null;
            postContent = post?.content ?? null;
            postCache.set(cacheKey, postContent);
          }

          return {
            id: lead.id,
            name: lead.name,
            subtitle: lead.subtitle ?? "",
            content: lead.content ?? "",
            postContent: postContent ?? ""
          };
        })
      );

      // 2. Appel IA unique pour le batch
      console.log(`🤖 Envoi du batch ${Math.floor(i / BATCH_SIZE) + 1} à l'IA...`);
      const batchResults = await analyzeLeadsBatch(preparedLeads);

      // 3. Mise à jour de la base de données
      for (const res of batchResults) {
        try {
          await updateLeadScore(res.leadId, res.score, res.feedback);
          finalResults.push(res);
        } catch (dbError) {
          console.error(`⚠️ Échec de mise à jour pour le lead ${res.leadId}:`, dbError);
        }
      }

      console.log(`✅ Batch traité (${finalResults.length}/${allLeads.length})`);

      // 4. Temporisation (Rate Limiting)
      if (i + BATCH_SIZE < allLeads.length) {
        await sleep(DELAY_BETWEEN_BATCHES_MS);
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      console.error("❌ Erreur critique lors du traitement du batch:", errorMessage);
      
      // Arrêt si quota atteint
      if (errorMessage.includes("429") || errorMessage.includes("quota")) {
        console.warn("🛑 Quota atteint. Arrêt du processus.");
        break;
      }
    }
  }

  return { 
    processed: finalResults.length, 
    results: finalResults,
    status: finalResults.length === allLeads.length ? "SUCCESS" : "PARTIAL"
  };
}