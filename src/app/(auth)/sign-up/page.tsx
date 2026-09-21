import type { Metadata } from "next";
import { AuthDivider, AuthShell } from "@/components/auth/auth-shell";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a new account.",
};

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Set up your access in under a minute."
      alternate={{
        prompt: "Have an account?",
        label: "Sign in",
        href: "/sign-in",
      }}
    >
      <GoogleSignInButton />

      <AuthDivider label="or sign up with email" />

      <SignUpForm />
    </AuthShell>
  );
}