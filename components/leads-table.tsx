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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ScrapePostButton from "./scrape-post-button";
import { toggleLeadFavorite } from "@/app/actions/fav-leads";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    setOptimisticLeads(initialLeads);
  }, [initialLeads]);

  const handleToggleFavorite = async (leadId: string) => {
    setOptimisticLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, favorite: !l.favorite } : l))
    );
    try {
      await toggleLeadFavorite(leadId);
    } catch (error) {
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
    <TooltipProvider delayDuration={200}>
      <div className="w-full space-y-4">
        {!hasNoDataAtAll && (
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-1 rounded-xl">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-zinc-100 focus-visible:ring-zinc-200"
              />
            </div>
            <Button
              variant={showOnlyFavorites ? "default" : "outline"}
              size="sm"
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={cn(
                "h-9 gap-2 text-xs font-bold uppercase tracking-wider transition-all w-full sm:w-auto",
                showOnlyFavorites ? "bg-yellow-400 hover:bg-yellow-500 text-yellow-950 border-none shadow-sm" : "border-zinc-100 text-zinc-500 bg-white"
              )}
            >
              <Star className={cn("h-3.5 w-3.5", showOnlyFavorites ? "fill-current" : "")} />
              Favoris
            </Button>
          </div>
        )}

        <div className="overflow-hidden border border-zinc-100 rounded-xl bg-white shadow-sm">
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow className="hover:bg-transparent border-zinc-100">
                <TableHead className="w-[48px] py-4 pl-4 text-center"><span className="sr-only">Favoris</span></TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400 py-4">Utilisateur</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400 py-4">Engagement</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400 py-4 text-right">Date</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-400 py-4 text-right pr-6">Profil</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLeads.length > 0 ? (
                currentLeads.map((lead) => (
                  <TableRow key={lead.id} className="group border-zinc-50 hover:bg-zinc-50/30 transition-colors">
                    <TableCell className="py-4 pl-4 text-center">
                      <button onClick={() => handleToggleFavorite(lead.id)} className="active:scale-90 transition-transform">
                        <Star className={cn("h-4 w-4 transition-all duration-200", lead.favorite ? "fill-yellow-400 text-yellow-400" : "text-zinc-200 fill-transparent group-hover:text-zinc-300")} />
                      </button>
                    </TableCell>
                    
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200">
                          <User className="h-4 w-4 text-zinc-400" />
                        </div>
                        <div className="min-w-0">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="font-bold text-zinc-900 text-sm truncate max-w-[180px] cursor-help">
                                {lead.name}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-zinc-900 text-white border-none text-[11px] font-medium px-3 py-1.5 shadow-xl">
                              {lead.name}
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-[10px] text-zinc-400 font-medium truncate max-w-[180px] uppercase tracking-tight cursor-help">
                                {lead.subtitle ?? "LinkedIn User"}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-xs bg-white text-zinc-600 border border-zinc-100 text-[10px] p-2 shadow-lg">
                              {lead.subtitle ?? "LinkedIn User"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-4">
                      {lead.type === "commenters" ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-start gap-2 max-w-[300px] cursor-help">
                              <div className="mt-1 p-1 bg-blue-50 rounded shrink-0">
                                <MessageSquare className="h-3 w-3 text-blue-600" />
                              </div>
                              <span className="text-xs leading-relaxed text-zinc-600 line-clamp-2 italic">
                                &quot;{lead.content}&quot;
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-sm bg-white border border-zinc-200 text-zinc-800 text-xs p-3 shadow-2xl leading-relaxed rounded-lg">
                            {lead.content}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-emerald-50 rounded text-emerald-600 shrink-0"><ThumbsUp className="h-3 w-3" /></div>
                          <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Reaction</span>
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="text-right py-4">
                      <span className="text-[10px] font-black text-zinc-400 uppercase">{lead.linkedinDate ?? "Recent"}</span>
                    </TableCell>

                    <TableCell className="text-right py-4 pr-6">
                      <Button variant="ghost" size="sm" asChild className="h-8 w-8 rounded-full hover:bg-zinc-900 hover:text-white shadow-none">
                        <a href={lead.urlProfile} target="_blank" rel="noreferrer"><ArrowRight className="h-4 w-4" /></a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      {hasNoDataAtAll ? <ScrapePostButton /> : (
                        <Button variant="link" className="text-[10px] text-zinc-400 uppercase font-black" onClick={() => {setSearchQuery(""); setShowOnlyFavorites(false);}}>Réinitialiser les filtres</Button>
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
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Affichage: <span className="text-zinc-900">{filteredLeads.length}</span></div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{currentPage} / {totalPages || 1}</span>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ArrowRight className="h-3 w-3 rotate-180" /></Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}><ArrowRight className="h-3 w-3" /></Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}