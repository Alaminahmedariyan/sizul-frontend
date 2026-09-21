"use client";

import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: reqError } = await authClient.forgetPassword.emailOtp({
      email,
    });

    setIsSubmitting(false);

    if (reqError) {
      setError(reqError.message ?? "Something went wrong.");
      return;
    }

    setSent(true);
  };

  if (sent) {
    return <p>Check your email for a password reset link.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Forgot password</h1>

      {error && <p role="alert">{error}</p>}

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}
