"use client";

import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  type LucideIcon,
  Phone,
  Send,
  User,
} from "lucide-react";
import Link from "next/link";
import { type ReactNode, useState } from "react";

import { Reveal } from "@/components/marketing/motion";
import { Section } from "@/components/marketing/section";
import { SpotlightCard } from "@/components/marketing/spot-light-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { createLead } from "@/lib/api/leads";

const INPUT_CLASS = "h-12 rounded-xl border-border bg-background/60 pl-11 shadow-none";
const TEXTAREA_CLASS =
  "min-h-32 resize-y rounded-xl border-border bg-background/60 px-4 py-3 shadow-none";

function Backdrop() {
  return (
    <>
      <div aria-hidden className="hero-grid -z-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />
    </>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  children,
}: {
  id: string;
  label: string;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        )}
        {children}
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await createLead({
        name,
        email,
        phone: phone || undefined,
        company: company || undefined,
        message,
        source: "WEBSITE",
      });
      setIsSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Section
        className="isolate overflow-hidden py-16 md:py-24"
        containerClassName="max-w-xl"
      >
        <Backdrop />

        <Reveal immediate>
          <SpotlightCard
            variant="featured"
            className="px-8 py-14 text-center md:px-12"
          >
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400">
              <CheckCircle2 className="size-8" />
            </div>
            <h1 className="mt-6 text-3xl font-semibold">
              Thanks for reaching out!
            </h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              We&apos;ve received your message and will get back to you within
              1-2 business days.
            </p>
            <div className="mt-8">
              <Link href="/" className="brand-btn-secondary">
                Back to home
              </Link>
            </div>
          </SpotlightCard>
        </Reveal>
      </Section>
    );
  }

  return (
    <Section
      className="isolate overflow-hidden py-16 md:py-24"
      containerClassName="max-w-6xl"
    >
      <Backdrop />

      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <Reveal immediate className="lg:sticky lg:top-32">
          <h1 className="text-4xl font-semibold leading-[1.05] md:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            Tell us about your project and we&apos;ll get back to you shortly.
          </p>

          <div className="mt-8 flex max-w-md items-start gap-4 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <Clock className="size-5" />
            </span>
            <div>
              <p className="font-medium">Quick response</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                We&apos;ll get back to you within 1-2 business days.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal immediate delay={0.1}>
          <SpotlightCard className="p-6 sm:p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div
                  className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                  role="alert"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label="Name" icon={User}>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={INPUT_CLASS}
                    required
                  />
                </Field>

                <Field id="email" label="Email" icon={Mail}>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={INPUT_CLASS}
                    required
                  />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="phone" label="Phone (optional)" icon={Phone}>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </Field>

                <Field id="company" label="Company (optional)" icon={Building2}>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={INPUT_CLASS}
                  />
                </Field>
              </div>

              <Field id="message" label="Message">
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your project..."
                  rows={5}
                  className={TEXTAREA_CLASS}
                  required
                />
              </Field>

              <button
                type="submit"
                disabled={isSubmitting}
                className="brand-btn-primary w-full justify-center disabled:pointer-events-none disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="size-4" />
                  </>
                )}
              </button>
            </form>
          </SpotlightCard>
        </Reveal>
      </div>
    </Section>
  );
}