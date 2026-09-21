"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AuthSubmitButton,
  FormAlert,
  IconInput,
  PasswordInput,
} from "@/components/auth/auth-fields";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";

const signInSchema = z.object({
  email: z.email({ error: "Enter a valid email address" }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters" }),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const [formError, setFormError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const isSubmitting = form.formState.isSubmitting;
  const isBusy = isSubmitting || isRedirecting;

  const onSubmit = async (values: SignInValues) => {
    setFormError(null);

    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setFormError(error.message ?? "Sign in failed. Check your credentials.");
      return;
    }

    // Keep the button locked while the next page loads.
    setIsRedirecting(true);

    // Let the server decide where this role belongs — don't guess a path here.
    router.push(
      redirectTo
        ? `/redirect?to=${encodeURIComponent(redirectTo)}`
        : "/redirect",
    );
    router.refresh();
  };

  const buttonLabel = isRedirecting
    ? "Redirecting…"
    : isSubmitting
      ? "Signing in…"
      : "Sign in";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-5"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px]">Email</FormLabel>
              <FormControl>
                <IconInput
                  icon={<Mail />}
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-[13px]">Password</FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <PasswordInput
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {formError && <FormAlert message={formError} />}

        <AuthSubmitButton busy={isBusy}>{buttonLabel}</AuthSubmitButton>
      </form>
    </Form>
  );
}