import { getLeadsByUser } from "@/lib/db/leads";
import { getUser } from "@/lib/get-user";

import LeadsClient from "./_components/leads-list";
import { LeadsStats } from "./_components/leads-stats";

export default async function LeadsPage() {
  const { id: userId } = await getUser();

  const leads = await getLeadsByUser(userId);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Tableau de bord
        </h1>

        <p className="text-muted-foreground mt-1">
          Analyse en temps réel de vos profils LinkedIn cibles.
        </p>
      </div>
      <LeadsStats leads={leads} />

      <LeadsClient leads={leads} />
    </div>
  );
}
