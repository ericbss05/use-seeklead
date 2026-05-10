import { Heart, MessageSquare, ThumbsUp, Sparkles, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Flames } from "./flames";
import { clampScore, hasBonus, type Lead, type ColVisible, type SortDir } from "./types";

interface LeadsTableProps {
  leads: Lead[];
  favorites: string[];
  colVisible: ColVisible;
  page: number;
  totalPages: number;
  sortDir: SortDir;
  onToggleSort: () => void;
  onToggleFav: (id: string) => void;
  onOpenPanel: (id: string) => void;
  onPageChange: (page: number) => void;
}

export function LeadsTable({
  leads, favorites, colVisible,
  page, totalPages, onToggleSort,
  onToggleFav, onOpenPanel, onPageChange,
}: LeadsTableProps) {
  return (
    <>
      <div style={{ border: "1px solid hsl(var(--border))", borderRadius: 8, overflow: "hidden" }}>
        <Table style={{ tableLayout: "fixed", width: "100%" }}>
          <TableHeader>
            <TableRow>
              <TableHead style={{ fontWeight: 500, fontSize: 13, paddingLeft: 24, width: "50%" }}>Contact & Mots-clés</TableHead>
              {colVisible.type && (
                <TableHead style={{ width: 120, fontWeight: 500, fontSize: 13 }}>Type</TableHead>
              )}
              {colVisible.score && (
                <TableHead style={{ width: 110 }}>
                  <Button
                    variant="ghost"
                    style={{ padding: "0 4px", height: "auto", gap: 4, fontSize: 13, fontWeight: 500 }}
                    onClick={onToggleSort}
                  >
                    Score <ArrowUpDown size={13} />
                  </Button>
                </TableHead>
              )}
              <TableHead style={{ width: 60 }} />
            </TableRow>
          </TableHeader>

          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} style={{ textAlign: "center", color: "var(--muted-foreground)", padding: "40px 0", fontSize: 13 }}>
                  Aucun résultat ne correspond à tes filtres.
                </TableCell>
              </TableRow>
            ) : leads.map((lead) => {
              const score = clampScore(lead.score);
              const bonus = hasBonus(lead);
              const isFav = favorites.includes(lead.id);

              return (
                <TableRow
                  key={lead.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onOpenPanel(lead.id)}
                >
                  {/* Contact & Keywords */}
                  <TableCell style={{ paddingLeft: 24, overflow: "hidden" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ overflow: "hidden" }}>
                        <p style={{ fontWeight: 500, fontSize: 13.5, margin: 0, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={lead.name}>
                          {lead.name}
                        </p>
                        {lead.subtitle && (
                          <p style={{ fontSize: 11.5, color: "var(--muted-foreground)", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={lead.subtitle}>
                            {lead.subtitle}
                          </p>
                        )}
                      </div>
                      {bonus && (
                        <div style={{ display: "flex", flexWrap: "nowrap", overflow: "hidden", gap: 4, marginTop: 2 }}>
                          {lead.keywords!.map((kw) => (
                            <Badge key={kw} variant="secondary" style={{ fontSize: 10, padding: "0px 6px", height: 20, color: "#3B82F6", backgroundColor: "rgba(59, 130, 246, 0.1)", border: "none", whiteSpace: "nowrap" }}>
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Type */}
                  {colVisible.type && (
                    <TableCell>
                      <Badge variant="secondary" style={{ gap: 5, fontWeight: 500, fontSize: 11 }}>
                        {lead.type.toLowerCase() === "commenter" ? <MessageSquare size={10} /> : <ThumbsUp size={10} />}
                        {lead.type}
                      </Badge>
                    </TableCell>
                  )}

                  {/* Score */}
                  {colVisible.score && (
                    <TableCell>
                      <Flames score={score} bonus={bonus} />
                    </TableCell>
                  )}

                  {/* Row actions */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" style={{ width: 30, height: 30 }} aria-label="Actions" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal size={15} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onClick={() => onOpenPanel(lead.id)} style={{ gap: 8 }}>
                          <Sparkles size={13} /> Feedback IA
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleFav(lead.id)} style={{ gap: 8 }}>
                          <Heart size={13} style={{ fill: isFav ? "#F43F5E" : "transparent", color: isFav ? "#F43F5E" : "currentColor" }} />
                          {isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: "var(--muted-foreground)" }}>
        <span>Affichage de {leads.length} lead(s) sur {leads.length} correspondant aux filtres.</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Button variant="outline" size="sm" style={{ height: 32 }} disabled={page === 0} onClick={() => onPageChange(page - 1)}>
            Précédent
          </Button>
          <Button variant="outline" size="sm" style={{ height: 32 }} disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1)}>
            Suivant
          </Button>
        </span>
      </div>
    </>
  );
}