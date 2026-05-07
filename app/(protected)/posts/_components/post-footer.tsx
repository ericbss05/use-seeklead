"use client";

import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Share2, ChevronUp } from "lucide-react";
import { Post } from "./types";

interface PostFooterProps {
  likes: Post["likes"];       // Accepte désormais number | null | undefined
  comments: Post["comments"]; // Idem
  shares: Post["shares"];     // Idem
  isExpanded: boolean;
  onCollapse: () => void;
}

export function PostFooter({
  likes,
  comments,
  shares,
  isExpanded,
  onCollapse,
}: PostFooterProps) {
  return (
    <div className="px-3 gap-4 flex items-center">
      <div className="flex gap-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-lg h-9 text-[13px] font-normal">
        {likes}
        <ThumbsUp className="w-4 h-4" />
      </div>
      <div className="flex gap-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-lg h-9 text-[13px] font-normal">
        {comments}
        <MessageSquare className="w-4 h-4" />
      </div>
      <div className="flex gap-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-lg h-9 text-[13px] font-normal">
        {shares}
        <Share2 className="w-4 h-4" />
      </div>

      {isExpanded && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onCollapse}
          className="ml-auto text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/60 h-9 px-3 gap-1.5 text-[12px] font-normal rounded-lg shrink-0"
        >
          <ChevronUp className="w-3.5 h-3.5" />
          Réduire
        </Button>
      )}
    </div>
  );
}