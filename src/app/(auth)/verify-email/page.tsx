"use client";

import { KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import {
  AuthSubmitButton,
  FormAlert,
  IconInput,
} from "@/components/auth/auth-fields";
import { authClient } from "@/lib/auth-client";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: verifyError } = await authClient.emailOtp.verifyEmail({
      email,
      otp,
    });

    if (verifyError) {
      setError(verifyError.message ?? "Invalid or expired code.");
      setIsSubmitting(false);
      return;
    }

    // autoSignInAfterVerification: true — user is signed in after this
    router.push("/redirect");
    router.refresh();
  };

  const handleResend = async () => {
    setError(null);
    setResendMessage(null);
    setIsResending(true);

    const { error: resendError } =
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

    setIsResending(false);

    if (resendError) {
      setError(resendError.message ?? "Could not resend the code.");
      return;
    }

    setResendMessage("A new code has been sent to your email.");
  };

  if (!email) {
    return (
      <div className="space-y-4">
        <FormAlert message="Missing email. Please sign up again." />
        <Link
          href="/sign-up"
          className="inline-block text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          Back to sign up
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <p className="text-sm text-muted-foreground">
        We sent a 6-digit code to <strong>{email}</strong>
      </p>

      <div className="space-y-1.5">
        <label htmlFor="otp" className="text-[13px] font-medium">
          Verification code
        </label>
        <IconInput
          id="otp"
          icon={<KeyRound />}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="123456"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          required
        />
      </div>

      {error && <FormAlert message={error} />}

      {resendMessage && (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          {resendMessage}
        </p>
      )}

      <AuthSubmitButton busy={isSubmitting}>
        {isSubmitting ? "Verifying…" : "Verify email"}
      </AuthSubmitButton>

      <button
        type="button"
        onClick={handleResend}
        disabled={isResending}
        className="w-full text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline disabled:opacity-50"
      >
        {isResending ? "Resending…" : "Resend code"}
      </button>
    </form>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted-foreground">Loading…</p>}
    >
      <VerifyEmailContent />
    </Suspense>
  );
}