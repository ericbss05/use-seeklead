import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuCheckboxItem,
  DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { type ColVisible } from "./types";

interface LeadsToolbarProps {
  filter: string;
  onFilterChange: (v: string) => void;
  typeFilter: string;
  onTypeFilterChange: (v: string) => void;
  minScore: number;
  onMinScoreChange: (v: number) => void;
  colVisible: ColVisible;
  onToggleCol: (col: keyof ColVisible) => void;
}

export function LeadsToolbar({
  filter, onFilterChange,
  typeFilter, onTypeFilterChange,
  minScore, onMinScoreChange,
  colVisible, onToggleCol,
}: LeadsToolbarProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <Input
        placeholder="Rechercher (nom, poste)..."
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        style={{ maxWidth: 250, height: 36 }}
      />

      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger style={{ width: 160, height: 36 }}>
          <SelectValue placeholder="Tous les types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les types</SelectItem>
          <SelectItem value="likers">Likers</SelectItem>
          <SelectItem value="commenters">Commentateurs</SelectItem>
        </SelectContent>
      </Select>

      <Select value={String(minScore)} onValueChange={(v) => onMinScoreChange(Number(v))}>
        <SelectTrigger style={{ width: 160, height: 36 }}>
          <SelectValue placeholder="Tous les scores" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">Tous les scores</SelectItem>
          <SelectItem value="1">Score ≥ 1</SelectItem>
          <SelectItem value="2">Score ≥ 2</SelectItem>
          <SelectItem value="3">Score 3 (🔥)</SelectItem>
        </SelectContent>
      </Select>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" style={{ marginLeft: "auto", gap: 6, height: 36, fontSize: 13 }}>
            Colonnes <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {(Object.keys(colVisible) as Array<keyof ColVisible>).map((col) => (
            <DropdownMenuCheckboxItem
              key={col}
              checked={colVisible[col]}
              onCheckedChange={() => onToggleCol(col)}
              style={{ textTransform: "capitalize" }}
            >
              {col}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}