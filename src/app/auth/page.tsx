"use client";

import { useSearchParams } from "next/navigation";
import { SignIn } from "@/components/auth/sign_in";
import { SignOut } from "@/components/auth/sign_out";
import { NewUser } from "@/components/auth/new_user";
import { Error } from "@/components/auth/error";
import { VerifyRequest } from "@/components/auth/verify_request";
import { Suspense } from "react";

function AuthContent() {
  const searchParams = useSearchParams();
  const action = searchParams.get("action");

  switch (action) {
    case "signin":
      return <SignIn />;
    case "signout":
      return <SignOut />;
    case "error":
      return <Error />;
    case "verifyRequest":
      return <VerifyRequest />;
    case "newUser":
      return <NewUser />;
    default:
      return <SignIn />; // Default to sign in if no action is specified
  }
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
