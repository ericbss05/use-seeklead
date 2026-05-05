"use client";

import { useEffect, useState } from "react";
import { getMyIcp, saveMyIcp } from "@/app/actions/icp.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, X, ChevronLeft, Target, Sparkles } from "lucide-react";

type IcpFormProps = {
  onNextAction: () => void;
  onBackAction: () => void;
};

const ICP_SUGGESTIONS = [
  "CEO",
  "Founder",
  "CMO",
  "CTO",
  "Growth Manager",
  "Marketing Manager",
  "Product Manager",
];

export function IcpForm({ onNextAction, onBackAction }: IcpFormProps) {
  const [icp, setIcp] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  /**
   * LOAD ICP (1 seul record -> keywords)
   */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyIcp();

        if (data?.keywords && Array.isArray(data.keywords)) {
          setIcp(data.keywords as string[]);
        }
      } finally {
        setInitLoading(false);
      }
    };

    load();
  }, []);

  /**
   * toggle suggestion
   */
  const toggleTag = (tag: string) => {
    setIcp((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  /**
   * add custom tag
   */
  const addCustomIcp = () => {
    const value = input.trim();

    if (!value || icp.includes(value)) return;

    setIcp((prev) => [...prev, value]);
    setInput("");
  };

  /**
   * SAVE (upsert 1 ICP)
   */
  const handleSubmit = async () => {
    if (!icp.length) return;

    setLoading(true);

    await saveMyIcp(icp);

    setLoading(false);
    onNextAction();
  };

  /**
   * LOADING UI (inchangé visuellement)
   */
  if (initLoading) {
    return (
      <div className="space-y-6 w-full max-w-xl mx-auto">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 w-full max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* HEADER */}
      <div className="space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-100 mb-2">
          <Target className="w-6 h-6 text-neutral-900" />
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
          Définissez votre cible
        </h2>

        <p className="text-neutral-500 text-sm leading-relaxed">
          Quels profils l&apos;algorithme doit-il privilégier ? Sélectionnez des segments
          ou ajoutez vos propres critères de ciblage.
        </p>
      </div>

      {/* SUGGESTIONS */}
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> Suggestions intelligentes
          </label>

          <div className="flex flex-wrap gap-2">
            {ICP_SUGGESTIONS.map((tag) => {
              const isActive = icp.includes(tag);

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
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

        {/* INPUT */}
       <div className="relative group">
  <Input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && addCustomIcp()}
    placeholder="Ajouter un titre de poste spécifique..."
    className="h-12 bg-neutral-50 border-neutral-200 rounded-xl pr-32 transition-all"
  />

  <div className="absolute right-1 top-1 flex gap-1">
    
    {/* bouton add */}
    <Button
      size="icon"
      variant="ghost"
      onClick={addCustomIcp}
      className="h-10 w-10 rounded-lg"
    >
      <Plus className="w-4 h-4" />
    </Button>

    {/* bouton IA */}
    <Button
      size="sm"
      className="h-10 px-3 gap-2 rounded-lg"
    >
      <Sparkles />
      IA
    </Button>

  </div>
</div>

        {/* SELECTED */}
        <div className="min-h-15 p-4 bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200 flex flex-wrap gap-2 items-center">
          {icp.length === 0 ? (
            <span className="text-xs text-neutral-400 italic mx-auto">
              Aucun profil sélectionné
            </span>
          ) : (
            icp.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="pl-3 pr-1 py-1 gap-1 bg-white border border-neutral-200 text-neutral-900 group animate-in zoom-in-95"
              >
                {tag}

                <button
                  onClick={() => toggleTag(tag)}
                  className="hover:bg-neutral-100 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3 text-neutral-400 group-hover:text-red-500" />
                </button>
              </Badge>
            ))
          )}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-4 pt-4">
        <Button
          variant="ghost"
          onClick={onBackAction}
          className="px-6 text-neutral-500 hover:text-neutral-900"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={!icp.length || loading}
          className="flex-1 h-12 bg-neutral-900 hover:bg-black text-white rounded-xl shadow-lg transition-all active:scale-[0.98]"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Calcul des segments...</span>
            </div>
          ) : (
            "Finaliser la configuration"
          )}
        </Button>
      </div>
    </div>
  );
}