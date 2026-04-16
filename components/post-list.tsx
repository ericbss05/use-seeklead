"use client";

import { useState } from "react";
import { 
  User,
  Globe, 
  LayoutGrid 
} from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// 1. Définition des types stricts pour éliminer les "any"
interface LinkedInData {
  content?: string;
  linkedinUrl: string;
  author: {
    name: string;
    avatar?: { url?: string };
  };
  postedAt: { postedAgoShort?: string };
  engagement: { likes?: number; comments?: number };
  postImages?: Array<{ url: string }>;
}

interface PrismaPost {
  id: string;
  data: unknown; // On utilise unknown plutôt que any pour la sécurité
  createdAt: Date;
}

interface PostListProps {
  initialPosts: PrismaPost[];
}

export function PostList({ initialPosts }: PostListProps) {
  // On type l'état de la modale pour éviter le "possibly undefined"
  const [selectedPost, setSelectedPost] = useState<PrismaPost | null>(null);

  if (!initialPosts?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed rounded-3xl border-zinc-100 dark:border-zinc-800 bg-zinc-50/30">
        <LayoutGrid className="h-10 w-10 text-zinc-300 mb-4" />
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Aucun post à afficher</h3>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {initialPosts.map((post) => {
          const data = post.data as LinkedInData; // Cast contrôlé
          return (
            <div 
              key={post.id} 
              onClick={() => setSelectedPost(post)}
              className="group cursor-pointer flex flex-col justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl hover:border-blue-500 transition-all active:scale-[0.98]"
            >
              <div className="flex gap-3">
                <div className="relative w-12 h-12 shrink-0 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                  {data.postImages?.[0]?.url ? (
                    <Image src={data.postImages[0].url} alt="Post" fill className="object-cover" unoptimized />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-400"><User size={20} /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 truncate">{data.author?.name || "Profil LinkedIn"}</p>
                  <p className="text-[11px] text-zinc-400 mb-1">{data.postedAt?.postedAgoShort || "Récent"}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed italic">
                    {data.content || "Publication sans texte..."}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        {/* max-w-137.5 correspond à 550px (Recommandation Tailwind) */}
        <DialogContent className="max-w-137.5 p-0 overflow-hidden border-none bg-white dark:bg-zinc-900 shadow-2xl">
          {selectedPost && (
            <div className="flex flex-col max-h-[90vh]">
              {/* Utilisation d'une constante pour éviter les répétitions de cast */}
              {(() => {
                const data = selectedPost.data as LinkedInData;
                return (
                  <>
                    <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                      <div className="flex gap-3">
                        <div className="relative w-12 h-12 shrink-0">
                          <Image 
                            src={data.author?.avatar?.url || ""} 
                            alt="Avatar" 
                            fill 
                            className="rounded-full object-cover border" 
                            unoptimized 
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold leading-tight">{data.author?.name}</span>
                          <span className="text-[12px] text-zinc-500 flex items-center gap-1">
                            {data.postedAt?.postedAgoShort} • <Globe size={12} />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      <div className="p-4">
                        <p className="text-[14px] whitespace-pre-wrap leading-relaxed">
                          {data.content}
                        </p>

                        {data.postImages?.[0]?.url && (
                          <div className="mt-4 relative w-full rounded-md overflow-hidden border border-zinc-100">
                            <Image 
                              src={data.postImages[0].url} 
                              alt="Post" 
                              width={800}
                              height={600}
                              className="w-full h-auto object-contain max-h-150" // max-h-150 = 600px
                              unoptimized 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
