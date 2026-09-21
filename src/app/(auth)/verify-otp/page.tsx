"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { authClient } from "@/lib/auth-client";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: verifyError } = await authClient.signIn.emailOtp({
      email,
      otp,
    });

    setIsSubmitting(false);

    if (verifyError) {
      setError(verifyError.message ?? "Invalid or expired code.");
      return;
    }

    router.push("/redirect");
    router.refresh();
  };

  const resend = async () => {
    await authClient.emailOtp.sendVerificationOtp({ email, type: "sign-in" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Enter verification code</h1>
      <p>We sent a code to {email}</p>

      {error && <p role="alert">{error}</p>}

      <label>
        OTP
        <input value={otp} onChange={(e) => setOtp(e.target.value)} required />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Verifying..." : "Verify"}
      </button>

      <button type="button" onClick={resend}>
        Resend code
      </button>
    </form>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerifyOtpForm />
    </Suspense>
  );
}
