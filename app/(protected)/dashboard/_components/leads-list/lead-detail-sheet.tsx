import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet, SheetContent, SheetHeader,
  SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { ScoreCard } from "./score-card";
import { Flames } from "./flames";
import { clampScore, hasBonus, type Lead } from "./types";

interface LeadDetailSheetProps {
  lead: Lead | null;
  onClose: () => void;
}

export function LeadDetailSheet({ lead, onClose }: LeadDetailSheetProps) {
  return (
    <Sheet open={!!lead} onOpenChange={(open) => !open && onClose()}>
      <SheetContent style={{ display: "flex", flexDirection: "column", padding: 0, gap: 0 }}>
        {lead && (() => {
          const score = clampScore(lead.score);
          const bonus = hasBonus(lead);
          return (
            <>
              <SheetHeader style={{ padding: "24px 24px 16px" }}>
                <SheetTitle style={{ fontSize: 16, fontWeight: 600 }}>{lead.name}</SheetTitle>
                {lead.subtitle && (
                  <SheetDescription>{lead.subtitle}</SheetDescription>
                )}
              </SheetHeader>

              <Separator />

              <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
                <ScoreCard score={score} bonus={bonus} />
                <Flames score={score} bonus={bonus} size={18} />

                {/* AI feedback */}
                <div style={{ background: "hsl(var(--muted))", borderRadius: 12, padding: "14px 16px" }}>
                  <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-foreground)", margin: "0 0 8px" }}>
                    <Sparkles size={10} /> Analyse IA
                  </p>
                  <p style={{ fontSize: 13, lineHeight: 1.75, margin: 0 }}>
                    {lead.aiFeedback ?? "Aucune analyse disponible."}
                  </p>
                </div>

                {/* Keywords */}
                {bonus && (
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", margin: "0 0 8px" }}>Mots-clés repérés</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {lead.keywords!.map((kw) => (
                        <Badge key={kw} variant="outline" style={{ color: "#3B82F6", borderColor: "#3B82F6" }}>
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div style={{ padding: "16px 24px" }}>
                <Link href={lead.urlProfile} target="_blank" style={{ display: "block" }}>
                  <Button style={{ width: "100%", gap: 8 }}>
                    Voir le profil LinkedIn <ExternalLink size={14} />
                  </Button>
                </Link>
              </div>
            </>
          );
        })()}
      </SheetContent>
    </Sheet>
  );
}