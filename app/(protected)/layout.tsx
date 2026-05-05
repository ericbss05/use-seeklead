import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { hasSeedAccount } from "@/lib/db/seed-account"

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
  return <>{children}</>
}