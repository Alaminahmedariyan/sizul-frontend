import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthDivider, AuthShell } from "@/components/auth/auth-shell";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your account.",
};

function SignInFallback() {
  return (
    <div className="space-y-5" aria-hidden="true">
      <div className="space-y-2">
        <div className="h-4 w-12 animate-pulse rounded bg-muted" />
        <div className="h-11 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        <div className="h-11 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="h-11 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}

export default function SignInPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to see your reports and projects."
      alternate={{
        prompt: "New here?",
        label: "Create account",
        href: "/sign-up",
      }}
    >
      <GoogleSignInButton />

      <AuthDivider label="or sign in with email" />

      {/* useSearchParams needs a Suspense boundary in the App Router, or `next build` fails */}
      <Suspense fallback={<SignInFallback />}>
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
}