"use client";

import { Check } from "lucide-react";
import { type FormEvent, type ReactNode, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useServicesForManage } from "@/hooks/use-service";
import { apiClient } from "@/lib/api-client";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type BudgetRange =
  | "UNDER_500"
  | "BETWEEN_500_2000"
  | "BETWEEN_2000_5000"
  | "ABOVE_5000";

const BUDGET_OPTIONS: {
  value: BudgetRange;
  label: string;
}[] = [
  {
    value: "UNDER_500",
    label: "Under $500",
  },
  {
    value: "BETWEEN_500_2000",
    label: "$500 – $2,000",
  },
  {
    value: "BETWEEN_2000_5000",
    label: "$2,000 – $5,000",
  },
  {
    value: "ABOVE_5000",
    label: "Above $5,000",
  },
];

const TIMELINE_OPTIONS = [
  "ASAP",
  "Within 1 month",
  "1-3 months",
  "Flexible",
] as const;

const OTHER_SERVICE = "other";

type Timeline = (typeof TIMELINE_OPTIONS)[number];

type FormValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceId: string;
  budget: BudgetRange;
  timeline: Timeline;
  message: string;
  website: string;
};

type FormErrors = Partial<Record<"name" | "email" | "phone", string>>;

const INITIAL_VALUES: FormValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  serviceId: "",
  budget: "BETWEEN_500_2000",
  timeline: "Within 1 month",
  message: "",
  website: "",
};

const NEXT_STEPS = [
  {
    id: "review",
    text: "We review your project details.",
  },
  {
    id: "clarify",
    text: "We reach out to clarify scope and goals.",
  },
  {
    id: "proposal",
    text: "You receive a clear proposal with timeline and pricing.",
  },
];

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Enter your full name.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address, like you@company.com.";
  }

  if (
    values.phone.trim() &&
    !/^\+?[\d\s\-()]{7,20}$/.test(values.phone.trim())
  ) {
    errors.phone = "Use digits only, for example +880 17...";
  }

  return errors;
}

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}

        {optional && (
          <span className="font-normal text-muted-foreground"> (optional)</span>
        )}
      </Label>

      {children}

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function ChoiceChip({
  selected,
  onSelect,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200",
        selected
          ? "border-primary bg-primary/10 text-foreground shadow-[0_0_0_3px_color-mix(in_oklch,var(--primary)_12%,transparent)]"
          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <output
      aria-live="polite"
      className="block animate-fade-up rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-lg)] md:p-12"
    >
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
        <Check aria-hidden="true" className="size-7" />
      </div>

      <h2 className="mt-6 text-2xl font-semibold">Request received</h2>

      <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
        We will reply within {SITE.responseTime} with next steps.
      </p>

      <ol className="mx-auto mt-8 max-w-sm space-y-4 text-left text-sm">
        {NEXT_STEPS.map((step, index) => (
          <li key={step.id} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
            >
              {index + 1}
            </span>

            <span className="pt-0.5 text-muted-foreground">{step.text}</span>
          </li>
        ))}
      </ol>

      <Button
        type="button"
        variant="outline"
        className="mt-8"
        onClick={onReset}
      >
        Send another request
      </Button>
    </output>
  );
}

export function GetQuoteForm() {
  const { data: servicesRes } = useServicesForManage();

  const services = servicesRes?.data ?? [];

  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);

  const [errors, setErrors] = useState<FormErrors>({});

  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (key === "name" || key === "email" || key === "phone") {
      setErrors((prev) => ({
        ...prev,
        [key]: undefined,
      }));
    }
  }

  function reset() {
    setValues(INITIAL_VALUES);
    setErrors({});
    setStatus("idle");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Honeypot: real visitors never see or fill this field.
    if (values.website) {
      setStatus("success");
      return;
    }

    const nextErrors = validate(values);

    setErrors(nextErrors);

    const firstInvalid = Object.keys(nextErrors)[0];

    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();

      return;
    }

    setStatus("loading");

    try {
      await apiClient("/api/v1/leads/public", {
        method: "POST",
        body: {
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim() || undefined,
          company: values.company.trim() || undefined,
          serviceId:
            values.serviceId && values.serviceId !== OTHER_SERVICE
              ? values.serviceId
              : undefined,
          budget: values.budget,
          timeline: values.timeline,
          message: values.message.trim() || undefined,
          source: "WEBSITE",
        },
      });

      setStatus("success");
    } catch (err) {
      setStatus("idle");

      toast.error(
        err instanceof Error
          ? err.message
          : "We could not send your request. Check your connection and try again.",
      );
    }
  }

  if (status === "success") {
    return <SuccessState onReset={reset} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative space-y-6 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-lg)] md:p-10"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field id="name" label="Name" error={errors.name}>
          <Input
            id="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your full name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
        </Field>

        <Field id="email" label="Email" error={errors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field id="phone" label="Phone" optional error={errors.phone}>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+880 17..."
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
        </Field>

        <Field id="company" label="Company" optional>
          <Input
            id="company"
            autoComplete="organization"
            value={values.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="Your company"
          />
        </Field>
      </div>

      <Field id="service" label="Which service do you need?">
        <Select
          value={values.serviceId}
          onValueChange={(value) => update("serviceId", value)}
        >
          <SelectTrigger id="service" className="w-full">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>

          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name}
              </SelectItem>
            ))}

            <SelectItem value={OTHER_SERVICE}>Other / Not sure yet</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <fieldset className="space-y-1.5">
        <legend className="text-sm font-medium">Budget range</legend>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {BUDGET_OPTIONS.map((option) => (
            <ChoiceChip
              key={option.value}
              selected={values.budget === option.value}
              onSelect={() => update("budget", option.value)}
            >
              {option.label}
            </ChoiceChip>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-1.5">
        <legend className="text-sm font-medium">Timeline</legend>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {TIMELINE_OPTIONS.map((option) => (
            <ChoiceChip
              key={option}
              selected={values.timeline === option}
              onSelect={() => update("timeline", option)}
            >
              {option}
            </ChoiceChip>
          ))}
        </div>
      </fieldset>

      <Field id="message" label="Project details" optional>
        <Textarea
          id="message"
          rows={5}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Tell us about your project, your goals and anything else we should know."
        />
      </Field>

      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="website">
          Website
          <input
            id="website"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(e) => update("website", e.target.value)}
          />
        </label>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending…" : "Send quote request"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        We reply within {SITE.responseTime}. No spam, ever.
      </p>
    </form>
  );
}
