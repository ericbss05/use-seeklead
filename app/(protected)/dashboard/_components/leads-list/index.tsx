"use client";

import { useState, useMemo } from "react";
import { Flame, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadsToolbar } from "./leads-toolbar";
import { LeadsTable } from "./leads-table";
import { LeadDetailSheet } from "./lead-detail-sheet";
import { type Lead, type ColVisible, type SortDir, PAGE_SIZE, clampScore } from "./types";

export default function LeadsClient({ leads }: { leads: Lead[] }) {
  /* ── State ── */
  const [favorites,     setFavorites]     = useState<string[]>(leads.filter((l) => l.favorite).map((l) => l.id));
  const [panelId,       setPanelId]       = useState<string | null>(null);
  const [filter,        setFilter]        = useState("");
  const [typeFilter,    setTypeFilter]    = useState("all");
  const [minScore,      setMinScore]      = useState(0);
  const [page,          setPage]          = useState(0);
  const [sortDir,       setSortDir]       = useState<SortDir>("desc");
  const [colVisible,    setColVisible]    = useState<ColVisible>({ score: true, type: true });
  const [isScraping,    setIsScraping]    = useState(false);
  const [scrapeError,   setScrapeError]   = useState<string | null>(null);
  const [scrapeSuccess, setScrapeSuccess] = useState(false);

  /* ── Derived ── */
  const panelLead = leads.find((l) => l.id === panelId) ?? null;

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    return leads
      .filter((l) => {
        const matchText  = l.name.toLowerCase().includes(q) || l.subtitle?.toLowerCase().includes(q);
        const matchType  = typeFilter === "all" ? true : l.type.toLowerCase() === typeFilter;
        const matchScore = clampScore(l.score) >= minScore;
        return matchText && matchType && matchScore;
      })
      .sort((a, b) =>
        sortDir === "desc"
          ? clampScore(b.score) - clampScore(a.score)
          : clampScore(a.score) - clampScore(b.score)
      );
  }, [leads, filter, typeFilter, minScore, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageLeads  = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  /* ── Handlers ── */
  const handleToggleFav = (id: string) =>
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);

  const handleToggleSort = () => { setSortDir((d) => d === "desc" ? "asc" : "desc"); setPage(0); };

  const handleToggleCol = (col: keyof ColVisible) =>
    setColVisible((v) => ({ ...v, [col]: !v[col] }));

  const handleFilterChange = (v: string) => { setFilter(v); setPage(0); };
  const handleTypeChange   = (v: string) => { setTypeFilter(v); setPage(0); };
  const handleScoreChange  = (v: number) => { setMinScore(v); setPage(0); };

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

  /* ── Empty state ── */
  if (leads.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "72px 24px", textAlign: "center" }}>
        <Flame size={32} style={{ color: "#E07040" }} />
        <p style={{ fontSize: 14, color: "var(--muted-foreground)", margin: 0 }}>
          Aucun lead pour le moment.
        </p>
        <Button variant="outline" onClick={handleScrape} disabled={isScraping || scrapeSuccess}>
          {isScraping && <Loader2 size={14} style={{ marginRight: 6 }} className="animate-spin" />}
          {scrapeSuccess ? "Analyse lancée ✓" : "Analyser mes posts"}
        </Button>
        {scrapeError && (
          <p style={{ fontSize: 12, color: "hsl(var(--destructive))", margin: 0 }}>{scrapeError}</p>
        )}
      </div>
    );
  }

  /* ── Main UI ── */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <LeadsToolbar
        filter={filter}             onFilterChange={handleFilterChange}
        typeFilter={typeFilter}     onTypeFilterChange={handleTypeChange}
        minScore={minScore}         onMinScoreChange={handleScoreChange}
        colVisible={colVisible}     onToggleCol={handleToggleCol}
      />

      <LeadsTable
        leads={pageLeads}
        favorites={favorites}
        colVisible={colVisible}
        page={page}
        totalPages={totalPages}
        sortDir={sortDir}
        onToggleSort={handleToggleSort}
        onToggleFav={handleToggleFav}
        onOpenPanel={setPanelId}
        onPageChange={setPage}
      />

      <LeadDetailSheet
        lead={panelLead}
        onClose={() => setPanelId(null)}
      />
    </div>
  );
}