"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

import { resetPassword } from "@/lib/auth-client";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: resetError } = await resetPassword({
      newPassword: password,
      token,
    });

    setIsSubmitting(false);

    if (resetError) {
      setError(resetError.message ?? "Reset link is invalid or expired.");
      return;
    }

    router.push("/sign-in");
  };

  if (!token) {
    return <p>Missing or invalid reset link.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Reset password</h1>

      {error && <p role="alert">{error}</p>}

      <label>
        New password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Resetting..." : "Reset password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
