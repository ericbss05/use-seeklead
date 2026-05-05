"use client";

import { Sparkles } from "lucide-react";

const ICP_SUGGESTIONS = [
  "CEO", "Founder", "CMO", "CTO", "Growth Manager", "Marketing Manager", "Product Manager",
];

type IcpSuggestionsProps = {
  selected: string[];
  onToggleAction: (tag: string) => void;
};

export function IcpSuggestions({ selected, onToggleAction }: IcpSuggestionsProps) {
  return (
    <div className="space-y-3">
      <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
        <Sparkles className="w-3 h-3" /> Suggestions intelligentes
      </label>
      <div className="flex flex-wrap gap-2">
        {ICP_SUGGESTIONS.map((tag) => {
          const isActive = selected.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onToggleAction(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                isActive
                  ? "bg-neutral-900 border-neutral-900 text-white shadow-md shadow-neutral-200"
                  : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}