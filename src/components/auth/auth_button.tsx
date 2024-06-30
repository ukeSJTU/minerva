import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react";

interface AuthButtonProps {
  provider?: string;
  action: "signin" | "signout";
  callbackUrl?: string;
}

export function AuthButton({
  provider,
  action,
  callbackUrl = "/",
}: AuthButtonProps) {
  const handleClick = () => {
    if (action === "signin") {
      signIn(provider, { callbackUrl });
    } else {
      signOut({ callbackUrl });
    }
  };

  return (
    <Button onClick={handleClick} className="w-full">
      {action === "signin" ? `Sign in with ${provider}` : "Sign out"}
    </Button>
  );
}
