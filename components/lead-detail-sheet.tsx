"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Lead } from "./leads-table"; // Vérifie que c'est bien leads-table (avec un s)
import { 
  Calendar, 
  ArrowUpRight, 
  Star 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleLeadFavorite } from "@/app/actions/fav-leads";
import Image from "next/image";

interface LeadDetailSheetProps {
  lead: Lead | null;
  isOpen: boolean;
  onCloseAction: () => void;
  onToggleFavoriteAction: (id: string) => void; // Pour notifier la table parente du changement
}

export function LeadDetailSheet({ lead, isOpen, onCloseAction, onToggleFavoriteAction }: LeadDetailSheetProps) {
  const [isFav, setIsFav] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Synchro initiale à l'ouverture du lead
  useEffect(() => {
    if (lead) setIsFav(lead.favorite);
  }, [lead]);

  if (!lead) return null;

  const handleToggleFav = async () => {
    if (isPending) return;

    // 1. UI Optimiste
    setIsFav(!isFav);
    onToggleFavoriteAction(lead.id); 
    
    setIsPending(true);
    try {
      // 2. Appel de l'action serveur
      await toggleLeadFavorite(lead.id);
    } catch (error) {
      // 3. Rollback en cas d'erreur
      setIsFav(!isFav);
      onToggleFavoriteAction(lead.id);
      console.error("Erreur lors du toggle favori:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onCloseAction}>
      <SheetContent className="sm:max-w-110 border-l border-zinc-100 bg-white p-0 flex flex-col h-full shadow-none">
        
        {/* Header Section */}
        <div className="p-8 pt-12 space-y-6">
          <SheetHeader className="space-y-1">
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 rounded-full bg-zinc-950 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-medium">
                  {lead.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={handleToggleFav}
                  disabled={isPending}
                  className={cn(
                    "p-2.5 rounded-full border transition-all active:scale-95 disabled:opacity-50",
                    isFav 
                      ? "bg-yellow-50 border-yellow-200 text-yellow-500 shadow-sm" 
                      : "bg-white border-zinc-100 text-zinc-300 hover:text-zinc-400"
                  )}
                >
                  <Star className={cn("h-4 w-4", isFav && "fill-current")} />
                </button>

                <a 
                  href={lead.urlProfile} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2.5 rounded-full hover:bg-zinc-50 border border-zinc-100 text-zinc-400 transition-colors"
                >
                  <Image alt="linkedin" src="https://www.svgrepo.com/show/157006/linkedin.svg" width={10} height={10} className="h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="pt-4">
              <SheetTitle className="text-2xl font-medium text-zinc-900 tracking-tight">
                {lead.name}
              </SheetTitle>
              <p className="text-sm text-zinc-500 font-normal">
                {lead.subtitle ?? "LinkedIn Professional"}
              </p>
            </div>
          </SheetHeader>

          <div className="h-px bg-zinc-100 w-full" />
        </div>

        {/* Content Section */}
        <div className="flex-1 px-8 space-y-10 overflow-y-auto">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={cn(
                "h-1.5 w-1.5 rounded-full",
                lead.type === "commenters" ? "bg-blue-500" : "bg-emerald-500"
              )} />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                {lead.type === "commenters" ? "Commentaire" : "Réaction"}
              </span>
            </div>
            
            <div className="text-base leading-relaxed text-zinc-800 font-light italic">
              {lead.content ? (
                <p className="border-l-2 border-zinc-100 pl-4 py-1">
                  &quot;{lead.content}&quot;
                </p>
              ) : (
                <p className="text-zinc-400 text-sm italic font-normal">
                  Engagement sans message textuel.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Date d&apos;activité</span>
            <div className="flex items-center gap-2 text-sm text-zinc-600 font-medium">
              <Calendar className="h-3.5 w-3.5 opacity-40" />
              {lead.linkedinDate ?? "Récent"}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-8 mt-auto border-t border-zinc-50 bg-zinc-50/30">
          <Button 
            asChild 
            className="w-full bg-zinc-900 hover:bg-black text-white font-medium h-12 rounded-lg transition-all"
          >
            <a href={lead.urlProfile} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
              Consulter le profil
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}