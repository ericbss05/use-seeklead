"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { SeedAccountForm } from "@/components/forms/seed-account-form";
import { IcpForm } from "@/components/forms/icp-form";
import { LoadingStep } from "@/components/loader";

type Props = {
  initialSeedAccounts: { linkedinUrl: string }[];
};

export default function AddClient({}: Props) {
  const [step, setStep] = useState(1);
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg">

        {step === 1 && (
          <SeedAccountForm
            onNextAction={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <IcpForm
            onBackAction={() => setStep(1)}
            onNextAction={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <LoadingStep
            onFinishAction={() => router.push("/dashboard")}
          />
        )}

      </div>
    </div>
  );
}