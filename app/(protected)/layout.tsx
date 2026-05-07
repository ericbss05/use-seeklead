import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { hasSeedAccount } from "@/lib/db/seed-account"
import { SessionProvider } from "@/components/providers/session-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/nav/app-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. AUTH CHECK
  const session = await auth()

  const userId = session?.user?.id

  if (!userId) {
    redirect("/login")
  }

  // 2. ONBOARDING CHECK (seedAccount)
  const hasSeed = await hasSeedAccount(userId)

  if (!hasSeed) {
    redirect("/add")
  }

  // 3. OK → accès dashboard
  return <>
  <SessionProvider>
      <TooltipProvider delayDuration={0}>
        <SidebarProvider>
          {/* On passe le compteusr ici */}
          <AppSidebar /> 
          
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </SessionProvider>
    </>
}