"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

type Props = {
  onGenerateAction: (values: string[]) => void;
};

export function IcpAiDialog({ onGenerateAction }: Props) {
  const [open, setOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<string[]>([]);

  const handleGenerate = async () => {
    const trimmedTitle = jobTitle.trim();
    if (!trimmedTitle) return;

    setLoading(true);
    try {
      const res = await fetch("/api/ai/icp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobTitle: trimmedTitle }),
      });

      if (!res.ok) throw new Error("Erreur serveur");

      const data = await res.json();
      const newVariants = data.variants || [];

      setVariants(newVariants);
      
      // On transmet les résultats au composant parent
      if (newVariants.length > 0) {
        onGenerateAction(newVariants);
      }
    } catch (error) {
      console.error("Erreur lors de la génération IA:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-10 px-3 gap-2 rounded-lg">
          <Sparkles className="w-4 h-4" />
          IA
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Génération ICP avec IA</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="Ex: Directeur Général"
            className="w-full h-10 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-200"
          />

          <Button
            onClick={handleGenerate}
            disabled={loading || !jobTitle.trim()}
            className="w-full"
          >
            {loading ? "Génération..." : "Générer les profils"}
          </Button>
        </div>

        {variants.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 p-3 bg-neutral-50 rounded-lg">
            {variants.map((v, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-white border border-neutral-200 rounded-full text-sm font-medium animate-in fade-in"
              >
                {v}
              </span>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}