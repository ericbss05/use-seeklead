"use client";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

type IcpTagListProps = {
  tags: string[];
  onRemoveAction: (tag: string) => void;
};

export function IcpTagList({ tags, onRemoveAction }: IcpTagListProps) {
  return (
    <div className="min-h-15 p-4 bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200 flex flex-wrap gap-2 items-center">
      {tags.length === 0 ? (
        <span className="text-xs text-neutral-400 italic mx-auto">
          Aucun profil sélectionné
        </span>
      ) : (
        tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="pl-3 pr-1 py-1 gap-1 bg-white border border-neutral-200 text-neutral-900 group animate-in zoom-in-95"
          >
            {tag}
            <button
              onClick={() => onRemoveAction(tag)}
              className="hover:bg-neutral-100 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3 text-neutral-400 group-hover:text-red-500" />
            </button>
          </Badge>
        ))
      )}
    </div>
  );
}