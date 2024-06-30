"use client";

import { AuthCard } from "@/components/auth/auth_card";
import { AuthButton } from "@/components/auth/auth_button";

export function SignOut() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <AuthCard
        title="Sign Out"
        description="Are you sure you want to sign out?"
      >
        <AuthButton action="signout" />
      </AuthCard>
    </div>
  );
}
