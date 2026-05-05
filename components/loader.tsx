"use client";

import { useEffect, useState } from "react";

/**
 * Props typées (aucun any)
 */
type LoadingStepProps = {
  onFinishAction: () => void;
};

/**
 * Steps de ton pipeline (facilement extensible)
 */
const STEPS: string[] = [
  "Récupération des publications",
  "Extraction des commentaires",
  "Filtrage des profils ICP",
  "Scoring des leads",
];

export function LoadingStep({ onFinishAction }: LoadingStepProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // animation des steps
    STEPS.forEach((_, i) => {
      const timer = setTimeout(() => {
        setCurrentStep(i + 1);
      }, i * 1200);

      timers.push(timer);
    });

    // fin du process
    const finishTimer = setTimeout(() => {
      onFinishAction();
    }, STEPS.length * 1200 + 500);

    timers.push(finishTimer);

    // cleanup (ultra important)
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [onFinishAction]);

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="flex flex-col items-center text-center gap-8">

      {/* SPINNER */}
      <div className="w-20 h-20 relative flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-zinc-200 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-t-black rounded-full animate-spin"></div>
      </div>

      {/* TITLE */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Analyse en cours...
        </h2>
        <p className="text-zinc-500 text-sm">
          On traite les données issues de tes comptes seed
        </p>
      </div>

      {/* STEPS */}
      <div className="w-full space-y-3 text-left">
        {STEPS.map((step, i) => {
          const isActive = currentStep >= i;
          const isDone = currentStep > i;

          return (
            <div
              key={i}
              className={`flex items-center gap-3 text-sm transition-opacity ${
                isActive ? "opacity-100" : "opacity-30"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  isDone
                    ? "bg-black text-white"
                    : "border border-zinc-200"
                }`}
              >
                {isDone ? "✓" : ""}
              </div>

              <span className={isActive ? "font-medium" : "text-zinc-400"}>
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* PROGRESS BAR */}
      <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-black transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}