import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "@/components/providers/session-provider";
import { AppSidebar } from "@/components/nav/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getTrackedAccountsCount } from "@/lib/get-accounts-tracked";
import { getTotalScrapedPostsCount } from "@/lib/get-posts-tracked"; // Ton import
import { AccountUrlForm } from "@/components/account-url-form";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Utilisation de Promise.all pour ne pas bloquer le rendu
  const [accountsCount, postsCount] = await Promise.all([
    getTrackedAccountsCount(session.user.id!),
    getTotalScrapedPostsCount(session.user.id!)
  ]);

  const hasNoAccounts = accountsCount === 0;

  return (
    <SessionProvider>
      <TooltipProvider delayDuration={0}>
        <SidebarProvider>
          {/* On passe le compteusr ici */}
          <AppSidebar totalPosts={postsCount} /> 
          
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </header>
            
            {hasNoAccounts && <AccountUrlForm forceOpen={true} />}
            
            <div className="flex flex-1 flex-col gap-4 p-4">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </SessionProvider>
  );
}