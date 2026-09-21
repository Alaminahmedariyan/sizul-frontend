"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { signOut } from "@/lib/auth-client";

async function handleSignOut(router: ReturnType<typeof useRouter>) {
  await signOut();
  router.push("/sign-in");
  router.refresh();
}

/** Standalone button — use where there's no dropdown (e.g. a plain page). */
export function SignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={isSigningOut}
      onClick={async () => {
        setIsSigningOut(true);
        await handleSignOut(router);
      }}
    >
      {isSigningOut ? "Signing out..." : "Sign out"}
    </Button>
  );
}

/** Use inside a DropdownMenuContent (e.g. the topbar user menu). */
export function SignOutButtonMenuItem() {
  const router = useRouter();

  return (
    <DropdownMenuItem
      variant="destructive"
      onClick={() => handleSignOut(router)}
    >
      <LogOut className="size-4" />
      Sign out
    </DropdownMenuItem>
  );
}
