"use client";

import { useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/auth_card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function Error() {
  const searchParams = useSearchParams();
  console.log(searchParams);
  const error = searchParams.get("error") || "An unknown error occurred";

  console.log("GITHUB_ID:", process.env.GITHUB_ID);
  console.log("GITHUB_SECRET:", process.env.GITHUB_SECRET);

  console.log(error);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <AuthCard title="Authentication Error">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </AuthCard>
    </div>
  );
}
