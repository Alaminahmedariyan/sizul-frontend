"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  AuthSubmitButton,
  FormAlert,
  IconInput,
} from "@/components/auth/auth-fields";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: reqError } =
      await authClient.emailOtp.requestPasswordReset({ email });

    if (reqError) {
      setError(reqError.message ?? "Something went wrong.");
      setIsSubmitting(false);
      return;
    }

    router.push(`/reset-password?email=${encodeURIComponent(email)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-[13px] font-medium">
          Email
        </label>
        <IconInput
          id="email"
          icon={<Mail />}
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {error && <FormAlert message={error} />}

      <AuthSubmitButton busy={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send reset code"}
      </AuthSubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/sign-in"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}