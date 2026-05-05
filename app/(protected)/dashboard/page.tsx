import React from "react";
import { auth } from "@/auth";
import Image from "next/image";

async function Page() {
  const session = await auth();

  return (
    <div className="w-screen flex justify-center">
      <div className="p-6">
        {session?.user ? (
          <div>
            <p>Nom : {session.user.name}</p>
            <p>Email : {session.user.email}</p>
            <Image src={session.user.image ?? ""} alt="avatar" width={50} height={50} />
          </div>
        ) : (
          <p>Non connecté</p>
        )}
      </div>
    </div>
  );
}

export default Page;