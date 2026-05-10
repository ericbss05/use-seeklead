export type Lead = {
  id: string;
  name: string;
  subtitle: string | null;
  type: string;
  score: number | null;
  favorite: boolean;
  aiFeedback: string | null;
  urlProfile: string;
  keywords?: string[];
};

export type ColVisible = {
  score: boolean;
  type: boolean;
};

export type SortDir = "asc" | "desc";

export const PAGE_SIZE = 8;

export const clampScore = (s: number | null) => Math.min(Math.max(s ?? 0, 0), 3);
export const hasBonus   = (l: Lead) => (l.keywords?.length ?? 0) > 0;