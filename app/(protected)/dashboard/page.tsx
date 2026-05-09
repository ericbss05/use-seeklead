import { getLeadsByUser } from "@/lib/db/leads";
import { getUser } from "@/lib/get-user";

import LeadsClient from "@/components/lead-list-client";

export default async function LeadsPage() {
  const { id: userId } = await getUser();

  const leads = await getLeadsByUser(userId);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Leads
        </h1>

        <p className="text-muted-foreground mt-1">
          Social signals detected from LinkedIn
        </p>
      </div>

      <LeadsClient leads={leads} />
    </div>
  );
}
