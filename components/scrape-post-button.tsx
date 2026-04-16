"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Loader2, Zap } from "lucide-react"; // Utilisation de Lucide pour l'icône de chargement

export default function ScrapePostButton() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleScrape = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch("/api/scrape/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du scraping");
      }

      setSuccess(true);
      router.refresh(); 

      // On réinitialise l'état de succès après 3 secondes
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      // Correction du no-explicit-any : vérification du type de l'erreur
      const message = err instanceof Error ? err.message : "Une erreur est survenue";
      console.error("Erreur:", message);
      alert("Erreur : " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center gap-2 mb-2">
        <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
        <h2 className="text-xl font-bold italic tracking-tight uppercase">Obtenez vos premiers leads</h2>
        <p className="text-zinc-500 mb-6 text-sm leading-relaxed">
        Notre IA va parcourir vos comptes suivis pour extraire les dernières opportunités.
      </p>

      </div>
    
      <Button
        onClick={handleScrape}
        disabled={loading}
        className={`w-full rounded-lg font-bold text-base transition-all active:scale-95 ${
          success ? "bg-green-600 hover:bg-green-600" : ""
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Analyse en cours...
          </>
        ) : success ? (
          "Analyse terminée !"
        ) : (
          "Lancer l'extraction"
        )}
      </Button>
      
      {success && (
        <p className="text-center text-[10px] text-green-600 mt-2 font-medium animate-pulse">
          Le tableau de bord a été mis à jour.
        </p>
      )}
    </div>
  );
}