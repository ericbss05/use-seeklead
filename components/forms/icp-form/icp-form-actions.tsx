"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

type IcpFormActionsProps = {
  onBackAction: () => void;
  onSubmitAction: () => void;
  disabled: boolean;
  loading: boolean;
};

export function IcpFormActions({ onBackAction, onSubmitAction, disabled, loading }: IcpFormActionsProps) {
  return (
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
        onClick={onSubmitAction}
        disabled={disabled}
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
  );
}