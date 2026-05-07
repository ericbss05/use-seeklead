"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Post } from "./types";
import { PostHeader } from "./post-header";
import { PostContent } from "./post-content";
import { PostFooter } from "./post-footer";

export function PostCard({ post }: { post: Post }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300",
        "bg-zinc-900 border-zinc-800",
        "hover:border-zinc-700"
      )}
    >
      {/* Accent line top */}
      <div
        className={cn(
          "h-0.5 w-full transition-all duration-500",
          isExpanded
            ? "bg-linear-to-r from-blue-500 via-indigo-400 to-blue-500"
            : "bg-transparent group-hover:bg-zinc-700"
        )}
      />

      {/* Body */}
      <div className="p-5 pb-4">
        <PostHeader
          authorName={post.authorName}
          authorAvatar={post.authorAvatar}
        />
        <PostContent
          content={post.content ?? ""}
          isExpanded={isExpanded}
          onExpandAction={() => setIsExpanded(true)}
          imageUrl={post.imageUrl ?? ""}
          videoUrl={post.videoUrl ?? ""}
        />
      </div>

      <Separator className="bg-zinc-800" />

      <PostFooter
        likes={post.likes ?? 0}
        comments={post.comments ?? 0}
        shares={post.shares ?? 0}
        isExpanded={isExpanded}
        onCollapse={() => setIsExpanded(false)}
      />
    </article>
  );
}