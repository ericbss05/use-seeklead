"use client";

import { useState, useMemo, useEffect } from "react";
import { ThumbsUp, MessageSquare, ArrowRight, User, Star, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ScrapePostButton from "./scrape-post-button";
import { toggleLeadFavorite } from "@/app/actions/fav-leads";
import { cn } from "@/lib/utils";
import { LeadDetailSheet } from "./lead-detail-sheet";

export interface Lead {
  id: string;
  name: string;
  subtitle?: string | null;
  type: "commenters" | "likers";
  content?: string | null;
  linkedinDate?: string | null;
  postLink?: string | null;
  urlProfile: string;
  favorite: boolean;
}

interface LeadTableProps {
  leads: Lead[];
}

export function LeadTable({ leads: initialLeads }: LeadTableProps) {
  const [optimisticLeads, setOptimisticLeads] = useState<Lead[]>(initialLeads);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  // État pour la Sheet
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    setOptimisticLeads(initialLeads);
  }, [initialLeads]);

  /**
   * Gestion du favori avec mise à jour optimiste.
   * On accepte un événement optionnel pour gérer les appels depuis le tableau ou la Sheet.
   */
  const handleToggleFavorite = async (
    e: React.MouseEvent | { stopPropagation: () => void } | undefined, 
    leadId: string
  ) => {
    // Empêche la propagation si l'événement existe (évite d'ouvrir la Sheet en cliquant sur l'étoile)
    e?.stopPropagation(); 

    setOptimisticLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, favorite: !l.favorite } : l))
    );

    try {
      await toggleLeadFavorite(leadId);
    } catch {
      // En cas d'erreur, on remet l'état précédent
      // On utilise _error pour indiquer à ESLint que la variable est sciemment ignorée
      setOptimisticLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, favorite: !l.favorite } : l))
      );
    }
  };

  const { filteredLeads, currentLeads, totalPages } = useMemo(() => {
    const filtered = optimisticLeads.filter((lead) => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.content?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (lead.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesFavorite = showOnlyFavorites ? lead.favorite : true;
      return matchesSearch && matchesFavorite;
    });
    const total = Math.ceil(filtered.length / itemsPerPage);
    const sliced = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return { filteredLeads: filtered, currentLeads: sliced, totalPages: total };
  }, [optimisticLeads, searchQuery, showOnlyFavorites, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, showOnlyFavorites]);

  const hasNoDataAtAll = optimisticLeads.length === 0;

  return (
    <div className="w-full space-y-4">
      {!hasNoDataAtAll && (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-1 rounded-xl">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Rechercher un lead..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-zinc-100 focus-visible:ring-zinc-200 h-10"
            />
          </div>
          <Button
            variant={showOnlyFavorites ? "default" : "outline"}
            size="sm"
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={cn(
              "h-10 gap-2 text-[10px] font-black uppercase tracking-widest transition-all w-full sm:w-auto px-6",
              showOnlyFavorites ? "bg-yellow-400 hover:bg-yellow-500 text-yellow-950 border-none shadow-sm" : "border-zinc-100 text-zinc-500 bg-white"
            )}
          >
            <Star className={cn("h-3.5 w-3.5", showOnlyFavorites ? "fill-current" : "")} />
            Favoris
          </Button>
        </div>
      )}

      <div className="overflow-hidden border border-zinc-100 rounded-2xl bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="hover:bg-transparent border-zinc-100">
              <TableHead className="w-12 py-4 pl-4 text-center"><span className="sr-only">Favoris</span></TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400 py-4">Utilisateur</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400 py-4">Engagement</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400 py-4 text-right">Date</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400 py-4 text-right pr-6">Détails</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentLeads.length > 0 ? (
              currentLeads.map((lead) => (
                <TableRow 
                  key={lead.id} 
                  className="group border-zinc-50 hover:bg-zinc-50/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <TableCell className="py-4 pl-4 text-center">
                    <button 
                      onClick={(e) => handleToggleFavorite(e, lead.id)} 
                      className="active:scale-90 transition-transform p-1"
                    >
                      <Star className={cn("h-4 w-4 transition-all duration-200", lead.favorite ? "fill-yellow-400 text-yellow-400" : "text-zinc-200 fill-transparent group-hover:text-zinc-300")} />
                    </button>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200 group-hover:bg-white transition-colors">
                        <User className="h-4 w-4 text-zinc-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-zinc-900 text-sm truncate max-w-37.5">
                          {lead.name}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-medium truncate max-w-37.5 uppercase tracking-tight">
                          {lead.subtitle ?? "LinkedIn User"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    {lead.type === "commenters" ? (
                      <div className="flex items-start gap-2 max-w-70">
                        <div className="mt-1 p-1 bg-blue-50 rounded shrink-0">
                          <MessageSquare className="h-3 w-3 text-blue-600" />
                        </div>
                        <span className="text-xs leading-relaxed text-zinc-600 line-clamp-2 italic">
                          &quot;{lead.content}&quot;
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-emerald-50 rounded text-emerald-600 shrink-0"><ThumbsUp className="h-3 w-3" /></div>
                        <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Reaction</span>
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-right py-4">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">{lead.linkedinDate ?? "Recent"}</span>
                  </TableCell>

                  <TableCell className="text-right py-4 pr-6">
                    <div className="flex justify-end">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center border border-zinc-100 bg-zinc-50 group-hover:bg-zinc-900 group-hover:text-white transition-all shadow-sm">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    {hasNoDataAtAll ? <ScrapePostButton /> : (
                      <Button variant="link" className="text-[10px] text-zinc-400 uppercase font-black tracking-widest" onClick={() => {setSearchQuery(""); setShowOnlyFavorites(false);}}>Réinitialiser les filtres</Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!hasNoDataAtAll && (
        <div className="flex items-center justify-between px-2">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total: <span className="text-zinc-900">{filteredLeads.length}</span></div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{currentPage} / {totalPages || 1}</span>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-zinc-100" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ArrowRight className="h-3 w-3 rotate-180" /></Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-zinc-100" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}><ArrowRight className="h-3 w-3" /></Button>
            </div>
          </div>
        </div>
      )}

      {/* Composant Sheet avec types corrigés */}
      <LeadDetailSheet 
        lead={selectedLead}
        isOpen={!!selectedLead}
        onCloseAction={() => setSelectedLead(null)}
        onToggleFavoriteAction={(id) => handleToggleFavorite(undefined, id)}
      />
    </div>
  );
}