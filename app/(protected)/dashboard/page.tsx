import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Libs & Actions
import { getLeads } from "@/app/actions/get-leads";
import { getTrackedAccountsList } from "@/lib/get-accounts-tracked";

// Components
import { AccountUrlForm } from "@/components/account-url-form";
import { LeadTable } from "@/components/leads-table";
import { Skeleton } from "@/components/ui/skeleton";

export default async function DashboardPage() {
  // 1. Authentification
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // 2. Récupération des données en parallèle (Performance optimale)
  // On récupère la LISTE complète pour que la modale puisse l'afficher
  const [leads, trackedAccounts] = await Promise.all([
    getLeads(),
    getTrackedAccountsList(userId),
  ]);

  // Logique métier : si aucun compte n'est suivi, on force l'ouverture de la modale
  const hasNoAccounts = trackedAccounts.length === 0;

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto w-full">
      
      {/* Header avec Titre et Gestion des comptes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Tableau de bord
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Analyse en temps réel de vos profils LinkedIn cibles.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <AccountUrlForm 
            initialAccounts={trackedAccounts} 
            forceOpen={hasNoAccounts}
            defaultOpen={hasNoAccounts}
          />
        </div>
      </div>

      <Suspense fallback={<Skeleton />}>
          <StatsCards userId={session.user.id} />
        </Suspense>

      {/* Section Principale : Tableau des Leads */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          {leads.length > 0 && (
            <span className="text-xs text-zinc-400 font-medium">
              {leads.length} opportunités détectées
            </span>
          )}
        </div>
        
        {/* Ici, le Suspense est une protection visuelle. 
          Pour du vrai streaming, il faudrait déplacer le "await getLeads" 
          dans un composant <LeadTableContainer /> 
        */}
        <Suspense fallback={<TableSkeleton />}>
          {hasNoAccounts ? (
            <EmptyState />
          ) : (
            <LeadTable leads={leads} />
          )}
        </Suspense>
      </div>
    </div>
  );
}

/** * État vide si l'utilisateur ne suit aucun compte 
 */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-100 rounded-2xl bg-zinc-50/50">
      <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
        <Link2 className="h-6 w-6 text-zinc-400" />
      </div>
      <h3 className="text-zinc-900 font-semibold">Aucun compte sous surveillance</h3>
      <p className="text-zinc-500 text-sm max-w-xs text-center mt-1">
        Ajoutez un profil LinkedIn via le bouton ci-dessus pour commencer à extraire des leads.
      </p>
    </div>
  );
}

/** * Skeleton pour le chargement 
 */
function TableSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-100 overflow-hidden">
      <div className="h-12 bg-zinc-50 border-b border-zinc-100" />
      <div className="p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}

// Import manquant pour l'EmptyState
import { Link2 } from "lucide-react";
import { StatsCards } from "@/components/stats-cards";
