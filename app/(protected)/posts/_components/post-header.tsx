"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link2 } from "lucide-react";
import { getInitials } from "./utils";
import { Post } from "./types"; // Import de ton interface centralisée

// On extrait juste les propriétés nécessaires du type Post
// Cela permet de rester synchronisé avec types.ts automatiquement
interface PostHeaderProps {
  authorName: Post["authorName"];
  authorAvatar: Post["authorAvatar"];
}

export function PostHeader({ authorName, authorAvatar }: PostHeaderProps) {
  // Construction de l'URL de repli (fallback)
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    authorName ?? "?"
  )}&background=1e293b&color=94a3b8&size=80`;

  return (
    <div className="flex items-start gap-3 mb-4">
      <Avatar className="w-10 h-10 border border-zinc-700 shrink-0">
        <AvatarImage
          // Si authorAvatar est null ou undefined, on utilise le fallback
          src={authorAvatar ?? fallbackAvatar}
          alt={authorName ?? "Avatar"}
        />
        <AvatarFallback className="bg-zinc-800 text-zinc-300 text-xs font-medium">
          {getInitials(authorName)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col">
          <p className="text-[14px] font-semibold text-zinc-100 leading-snug truncate hover:text-blue-400 cursor-pointer transition-colors">
            {authorName ?? "LinkedIn Member"}
          </p>
          <div className="text-[11px] text-zinc-600 mt-0.5 flex items-center gap-1 font-medium">
            <Link2 className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}