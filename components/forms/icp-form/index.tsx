"use client";

import { useEffect, useState } from "react";
import { getMyIcp, saveMyIcp } from "@/app/actions/icp.actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Target } from "lucide-react";
import { IcpSuggestions } from "./icp-suggestions";
import { IcpCustomInput } from "./icp-custom-input";
import { IcpTagList } from "./icp-tag-list";
import { IcpFormActions } from "./icp-form-actions";

type IcpFormProps = {
  onNextAction: () => void;
  onBackAction: () => void;
};

export function IcpForm({ onNextAction, onBackAction }: IcpFormProps) {
  const [icp, setIcp] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

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

  const toggleTag = (tag: string) => {
    setIcp((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomIcp = () => {
    const value = input.trim();
    if (!value || icp.includes(value)) return;
    setIcp((prev) => [...prev, value]);
    setInput("");
  };

  const mergeAiResults = (values: string[]) => {
    setIcp((prev) => {
      const newItems = values.filter((v) => v.trim() !== "" && !prev.includes(v));
      return [...prev, ...newItems];
    });
  };

  const handleSubmit = async () => {
    if (!icp.length) return;
    setLoading(true);
    try {
      await saveMyIcp(icp);
      onNextAction();
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-100 mb-2">
          <Target className="w-6 h-6 text-neutral-900" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
          Définissez votre cible
        </h2>
        <p className="text-neutral-500 text-sm leading-relaxed">
          Quels profils l&apos;algorithme doit-il privilégier ?
        </p>
      </div>

      <div className="space-y-6">
        <IcpSuggestions selected={icp} onToggleAction={toggleTag} />
        <IcpCustomInput
          value={input}
          onChangeAction={setInput}
          onAddAction={addCustomIcp}
          onAiGenerateAction={mergeAiResults}
        />
        <IcpTagList tags={icp} onRemoveAction={toggleTag} />
      </div>

      <IcpFormActions
        onBackAction={onBackAction}
        onSubmitAction={handleSubmit}
        disabled={!icp.length || loading}
        loading={loading}
      />
    </div>
  );
}