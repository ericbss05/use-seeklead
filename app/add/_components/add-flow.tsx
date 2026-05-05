"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SeedAccountForm } from "@/components/forms/seed-account-form";
import { IcpForm } from "@/components/forms/icp-form/index";
import { LoadingStep } from "@/components/loader";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Comptes seed" },
  { id: 2, label: "Ton ICP" },
  { id: 3, label: "Analyse" },
];

export default function AddClient() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6 selection:bg-black selection:text-white">
      <div className="w-full max-w-130 flex flex-col gap-12">
        
        {/* LOGO & PROGRESS HEADER */}
        <div className="flex flex-col gap-8">

          {/* STEPPER COMPONENT */}
          <div className="flex items-center w-full">
            {STEPS.map((s, i) => (
              <div 
                key={s.id} 
                className={cn(
                  "flex items-center",
                  i !== STEPS.length - 1 ? "flex-1" : ""
                )}
              >
                <div className="flex flex-col items-center gap-2.5">
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 border",
                    step > s.id ? "bg-black border-black text-white" : 
                    step === s.id ? "border-black bg-white text-black ring-4 ring-zinc-50" : 
                    "border-zinc-200 text-zinc-400"
                  )}>
                    {step > s.id ? "✓" : s.id}
                  </div>
                  <span className={cn(
                    "text-[10px] uppercase tracking-[0.15em] font-bold whitespace-nowrap transition-colors",
                    step === s.id ? "text-black" : "text-zinc-400"
                  )}>
                    {s.label}
                  </span>
                </div>
                
                {i < STEPS.length - 1 && (
                  <div className="h-px flex-1 mx-4 -mt-7 transition-colors duration-500">
                    <div className={cn(
                      "h-full w-full transition-all duration-700",
                      step > s.id ? "bg-black" : "bg-zinc-100"
                    )} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="min-h-100">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <SeedAccountForm
                onNextAction={() => setStep(2)}
              />
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <IcpForm
                onBackAction={() => setStep(1)}
                onNextAction={() => setStep(3)}
              />
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in zoom-in-95 duration-1000">
              <LoadingStep
                onFinishAction={() => router.push("/dashboard")}
              />
            </div>
          )}
        </div>

        {/* FOOTER QUOTE / INFO */}
        {step < 3 && (
          <div className="pt-8 border-t border-zinc-50 text-[11px] text-zinc-400 text-center uppercase tracking-widest">
            Configuration de votre moteur d&apos;acquisition
          </div>
        )}
      </div>
    </div>
  );
}