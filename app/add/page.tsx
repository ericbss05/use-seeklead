import { auth } from "@/auth";
import { getSeedAccounts } from "@/lib/db/seed-account";
import AddClient from "./_components/add-flow";

export default async function AddPage() {
  const session = await auth();

  const seedAccounts = await getSeedAccounts(session?.user?.id ?? "");

  return (
    <AddClient initialSeedAccounts={seedAccounts} />
  );
}