import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AddFlow from "./_components/add-flow";

export default async function AddPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <AddFlow />
  );
}