import { auth } from "@/auth";

export async function getUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return {
    id: session.user.id, 
  };
}