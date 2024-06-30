"use client";

import { useSession } from "next-auth/react";
import { AuthCard } from "@/components/auth/auth_card";

export function NewUser() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <AuthCard
        title="Welcome, New User!"
        description="Your account has been created successfully."
      >
        {session?.user?.name && (
          <p className="text-xl">Hello, {session.user.name}!</p>
        )}
      </AuthCard>
    </div>
  );
}
