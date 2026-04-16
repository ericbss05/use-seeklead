import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";

import { Field, FieldGroup } from "@/components/ui/field";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à Seeklead",
};

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <form>
            <FieldGroup className="gap-6">
              {/* Section Header avec Logo */}
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex size-10 items-center justify-center">
                    <Image src="/logo.svg" alt="logo" width={24} height={24} />
                  </div>
                  <span className="font-bold text-xl tracking-tight">Seeklead</span>
                </div>
                <h1 className="text-2xl font-bold">Bienvenue</h1>
              </div>

              {/* Boutons de connexion */}
              <div className="flex flex-col gap-4">
                <Field>
                  <GoogleSignInButton />
                </Field>
              </div>
            </FieldGroup>
          </form>

          {/* Footer légal */}
          <p className="px-4 text-center text-sm text-muted-foreground">
            Retour a
            <Link href="/" className="underline underline-offset-4 px-2 hover:text-primary">
              l&apos;acceuil
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}