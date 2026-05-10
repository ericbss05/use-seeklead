"use client";

import { useMemo } from "react";
import { Users, Flame, Target } from "lucide-react";

type Lead = {
  id: string;
  score: number | null;
  keywords?: string[];
};

export function LeadsStats({ leads }: { leads: Lead[] }) {
  const stats = useMemo(() => {
    const totalLeads = leads.length;

    const actionableLeads = leads.filter((lead) => {
      const score = lead.score ?? 0;
      const hasKeyword = (lead.keywords?.length ?? 0) > 0;
      return score === 3 || (score === 2 && hasKeyword);
    }).length;

    const icpMatchedLeads = leads.filter(
      (lead) => (lead.keywords?.length ?? 0) > 0
    ).length;

    const icpMatchRate =
      totalLeads > 0
        ? Math.round((icpMatchedLeads / totalLeads) * 100)
        : 0;

    return { totalLeads, actionableLeads, icpMatchRate };
  }, [leads]);

  const cards = [
    {
      title: "Total leads",
      value: stats.totalLeads.toLocaleString(),
      description: "Profils identifiés",
      icon: Users,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Leads exploitables",
      value: stats.actionableLeads.toLocaleString(),
      description: "Prêts à contacter",
      icon: Flame,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
    },
    {
      title: "ICP match",
      value: `${stats.icpMatchRate}%`,
      description: "Correspondance avec ton ciblage",
      icon: Target,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card md:grid-cols-3 md:divide-x md:divide-y-0">
      {cards.map((card) => (
        <div key={card.title} className="px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[12px] text-muted-foreground">{card.title}</p>
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${card.iconBg}`}>
              <card.icon className={`h-3.5 w-3.5 ${card.iconColor}`} />
            </div>
          </div>
          <p className="text-[26px] font-medium leading-none text-foreground">
            {card.value}
          </p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
}