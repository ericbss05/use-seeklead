"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IcpAiDialog } from "@/components/icp-ai-dialog";
import { Plus } from "lucide-react";

type IcpCustomInputProps = {
  value: string;
  onChangeAction: (value: string) => void;
  onAddAction: () => void;
  onAiGenerateAction: (values: string[]) => void;
};

export function IcpCustomInput({ 
  value, 
  onChangeAction, 
  onAddAction, 
  onAiGenerateAction 
}: IcpCustomInputProps) {
  return (
    <div className="relative group">
      <Input
        value={value}
        onChange={(e) => onChangeAction(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onAddAction()}
        placeholder="Ajouter un titre de poste spécifique..."
        className="h-12 bg-neutral-50 border-neutral-200 rounded-xl pr-32 transition-all focus:bg-white"
      />
      <div className="absolute right-1 top-1 flex gap-1">
        <Button
          type="button" 
          size="icon"
          variant="ghost"
          onClick={onAddAction}
          className="h-10 w-10 rounded-lg hover:bg-neutral-200"
        >
          <Plus className="w-4 h-4" />
        </Button>
        <IcpAiDialog onGenerateAction={onAiGenerateAction} />
      </div>
    </div>
  );
}