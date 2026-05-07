"use client";

import Image from "next/image";
import { VideoPlayer } from "./video-player";
import { CHARACTER_LIMIT } from "./utils";
import { Post } from "./types"; // Import du type centralisé

interface PostContentProps {
  content: Post["content"];
  isExpanded: boolean;
  onExpandAction: () => void;
  imageUrl: Post["imageUrl"];
  videoUrl: Post["videoUrl"];
}

export function PostContent({
  content,
  isExpanded,
  onExpandAction,
  imageUrl,
  videoUrl,
}: PostContentProps) {
  // Sécurisation du contenu (force string pour éviter les erreurs sur null)
  const safeContent = content ?? "";
  const isLong = safeContent.length > CHARACTER_LIMIT;
  
  const displayContent = isExpanded
    ? safeContent
    : safeContent.slice(0, CHARACTER_LIMIT);

  // Nettoyage et validation des URLs (évite les chaînes vides "" ou avec espaces " ")
  const validImageUrl = imageUrl?.trim() || null;
  const validVideoUrl = videoUrl?.trim() || null;
  const hasMedia = validImageUrl || validVideoUrl;

  return (
    <>
      {/* Texte du post */}
      <div className="text-[13.5px] text-zinc-300 leading-relaxed whitespace-pre-line">
        {displayContent}
        {!isExpanded && isLong && (
          <>
            {"… "}
            <button
              onClick={onExpandAction}
              className="text-zinc-400 hover:text-zinc-100 font-medium transition-colors"
            >
              voir plus
            </button>
          </>
        )}
      </div>

      {/* Media — Affiché uniquement si étendu et si une URL valide existe */}
      {isExpanded && hasMedia && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-1 duration-300">
          {validVideoUrl ? (
            <VideoPlayer src={validVideoUrl} />
          ) : validImageUrl ? (
            <div className="relative w-full max-h-125 overflow-hidden rounded-xl border border-zinc-800">
              <Image
                src={validImageUrl}
                alt="Post content"
                width={800}
                height={500}
                className="w-full h-auto object-cover"
                priority={false}
              />
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}