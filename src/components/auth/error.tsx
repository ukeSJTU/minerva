"use client";

import { useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/auth_card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "An unknown error occurred";

  console.log("GITHUB_ID:", process.env.NEXT_PUBLIC_GITHUB_ID);
  console.log("GITHUB_SECRET:", process.env.NEXT_PUBLIC_GITHUB_SECRET);

  console.log(error);

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}

export function Error() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <AuthCard title="Authentication Error">
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorContent />
        </Suspense>
      </AuthCard>
    </div>
  );
}
