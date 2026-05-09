"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame, Heart, MessageSquare, ThumbsUp, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Lead = {
  id: string;
  name: string;
  subtitle: string | null;
  type: string;
  score: number | null;
  favorite: boolean;
  aiFeedback: string | null;
  urlProfile: string;
};

function getLeadLevel(score: number | null) {
  if (!score) return 0;
  return Math.min(Math.max(score, 0), 3);
}

export default function LeadsClient({ leads }: { leads: Lead[] }) {
  const [favorites, setFavorites] = useState<string[]>(
    leads.filter((l) => l.favorite).map((l) => l.id)
  );
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [scrapeSuccess, setScrapeSuccess] = useState(false);

  function toggleFavorite(id: string) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  async function handleScrape() {
    setIsScraping(true);
    setScrapeError(null);
    try {
      const res = await fetch("/api/scrape/posts", { method: "POST" });
      if (!res.ok) throw new Error("La requête a échoué.");
      setScrapeSuccess(true);
    } catch (e) {
      setScrapeError(e instanceof Error ? e.message : "Erreur inconnue.");
    } finally {
      setIsScraping(false);
    }
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-sm text-muted-foreground">Aucun lead pour le moment.</p>
        <Button variant="outline" onClick={handleScrape} disabled={isScraping || scrapeSuccess}>
          {isScraping && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {scrapeSuccess ? "Analyse lancée" : "Analyser mes posts"}
        </Button>
        {scrapeError && <p className="text-xs text-destructive">{scrapeError}</p>}
      </div>
    );
  }

  return (
    <div className="divide-y">
      {leads.map((lead) => {
        const flameLevel = getLeadLevel(lead.score);
        const isFavorite = favorites.includes(lead.id);

        return (
          <div key={lead.id} className="flex items-center justify-between gap-4 py-3.5">
            {/* Flames */}
            <div className="flex shrink-0 gap-0.5">
              {[1, 2, 3].map((n) => (
                <Flame
                  key={n}
                  className={`h-4 w-4 transition-colors ${
                    n <= flameLevel
                      ? "fill-orange-400 text-orange-400"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{lead.name}</p>
              {lead.subtitle && (
                <p className="truncate text-xs text-muted-foreground">{lead.subtitle}</p>
              )}
            </div>

            {/* Type */}
            <div className="hidden shrink-0 items-center gap-1.5 text-muted-foreground sm:flex">
              {lead.type === "commenter" ? (
                <MessageSquare className="h-3.5 w-3.5" />
              ) : (
                <ThumbsUp className="h-3.5 w-3.5" />
              )}
              <span className="text-xs capitalize">{lead.type}</span>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => toggleFavorite(lead.id)}
                aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    isFavorite
                      ? "fill-rose-500 text-rose-500"
                      : "text-muted-foreground"
                  }`}
                />
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                    Feedback IA
                  </Button>
                </SheetTrigger>

                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>{lead.name}</SheetTitle>
                    {lead.subtitle && (
                      <SheetDescription>{lead.subtitle}</SheetDescription>
                    )}
                  </SheetHeader>

                  <Separator className="my-4" />

                  <div className="space-y-6">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((n) => (
                        <Flame
                          key={n}
                          className={`h-5 w-5 ${
                            n <= flameLevel
                              ? "fill-orange-400 text-orange-400"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {lead.aiFeedback ?? "Aucune analyse disponible."}
                    </p>

                    <Link href={lead.urlProfile} target="_blank">
                      <Button variant="outline" className="w-full">
                        Voir le profil LinkedIn
                      </Button>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        );
      })}
    </div>
  );
}