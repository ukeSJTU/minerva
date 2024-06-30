import { AuthCard } from "@/components/auth/auth_card";

export function VerifyRequest() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <AuthCard
        title="Check Your Email"
        description="A sign in link has been sent to your email address."
      >
        <p>Please check your inbox and click the link to sign in.</p>
      </AuthCard>
    </div>
  );
}
