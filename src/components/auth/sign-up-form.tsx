"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { cn } from "@/lib/utils";

const signUpSchema = z
  .object({
    name: z.string().min(2, { error: "Name must be at least 2 characters" }),
    email: z.email({ error: "Enter a valid email address" }),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

const STRENGTH_LEVELS = [
  { label: "", bar: "" },
  { label: "Weak", bar: "bg-destructive" },
  { label: "Fair", bar: "bg-amber-500" },
  { label: "Good", bar: "bg-emerald-400" },
  { label: "Strong", bar: "bg-emerald-500" },
];

function getStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score += 1;
  return score;
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const score = getStrength(password);
  const level = STRENGTH_LEVELS[score];

  return (
    <div className="flex items-center gap-3 pt-1" aria-live="polite">
      <div className="flex flex-1 gap-1.5">
        {[1, 2, 3, 4].map((segment) => (
          <span
            key={segment}
            className={cn(
              "h-1 flex-1 rounded-full bg-muted transition-colors duration-300",
              segment <= score && level.bar,
            )}
          />
        ))}
      </div>
      <span className="w-12 text-right text-xs text-muted-foreground">
        {level.label}
      </span>
    </div>
  );
}

export function SignUpForm() {
  const router = useRouter();

  const [formError, setFormError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const isSubmitting = form.formState.isSubmitting;
  const isBusy = isSubmitting || isRedirecting;
  const passwordValue = form.watch("password");

const onSubmit = async (values: SignUpValues) => {
  setFormError(null);

  const { error } = await authClient.signUp.email({
    name: values.name,
    email: values.email,
    password: values.password,
  });

  if (error) {
    setFormError(error.message ?? "Sign up failed. Please try again.");
    return;
  }

  setIsRedirecting(true);

  // Email verification is required in production.
  // Route through /verify-email so the user enters the OTP.
  router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
  router.refresh();
};

  const buttonLabel = isRedirecting
    ? "Redirecting…"
    : isSubmitting
      ? "Creating account…"
      : "Create account";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px]">Full name</FormLabel>
              <FormControl>
                <IconInput
                  icon={<User />}
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Rahman"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
              <FormLabel className="text-[13px]">Password</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  {...field}
                />
              </FormControl>
              <PasswordStrength password={passwordValue} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px]">Confirm password</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="new-password"
                  placeholder="Repeat your password"
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