import { Users, Zap, Activity } from "lucide-react";
import { getTrackedAccountsCount } from "@/lib/get-accounts-tracked";
import { getTotalScrapedPostsCount } from "@/lib/get-posts-tracked";
import { getLeads } from "@/app/actions/get-leads";

export async function StatsCards({ userId }: { userId: string }) {
  const [accountsCount, postsCount, leads] = await Promise.all([
    getTrackedAccountsCount(userId),
    getTotalScrapedPostsCount(userId),
    getLeads(),
  ]);

  const stats = [
    { label: "Sources", value: accountsCount, icon: Users },
    { label: "Analyses", value: postsCount, icon: Activity },
    { label: "Leads", value: leads.length, icon: Zap, highlight: true },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className={`p-5 rounded-2xl border ${
            stat.highlight 
              ? "bg-white border-blue-100 shadow-sm shadow-blue-50" 
              : "bg-white border-zinc-100"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              {stat.label}
            </span>
            <stat.icon className={`h-4 w-4 ${stat.highlight ? "text-blue-600" : "text-zinc-300"}`} />
          </div>

          <div className="flex items-baseline gap-1 bg-neutral">
            <span className="text-3xl font-semibold tracking-tight text-zinc-900">
              {stat.value}
            </span>
            {stat.highlight && (
              <span className="text-[10px] font-medium text-blue-600 ml-1">Live</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}