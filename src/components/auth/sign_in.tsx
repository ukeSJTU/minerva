"use client";

import { AuthCard } from "@/components/auth/auth_card";
import { AuthButton } from "@/components/auth/auth_button";

export function SignIn() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <AuthCard title="Sign In" description="Choose a provider to sign in with">
        <div className="space-y-4">
          <AuthButton provider="github" action="signin" />
          {/* TODO: Add more providers here */}
        </div>
      </AuthCard>
    </div>
  );
}
