import { ArrowRight, Check, Layers, Sparkles } from "lucide-react";
import Link from "next/link";

import { SpotlightCard } from "@/components/marketing/spot-light-card";
import type { PricingPlan } from "@/lib/api/pricing-plans";
import { cn } from "@/lib/utils";

type Props = {
  plan: PricingPlan;
  featured?: boolean;
};

const BILLING_LABEL: Record<string, string> = {
  ONE_TIME: "one-time",
  MONTHLY: "per month",
  QUARTERLY: "per quarter",
  YEARLY: "per year",
  CUSTOM: "custom",
};

export function PricingCard({ plan, featured }: Props) {
  const features = Array.isArray(plan.features) ? plan.features : [];
  const isFeatured = featured ?? plan.isPopular;
  const billingLabel =
    BILLING_LABEL[plan.billingInterval] ?? plan.billingInterval.toLowerCase();
  const Icon = isFeatured ? Sparkles : Layers;

  // Stable keys without the array index (a repeated feature gets a counter suffix).
  const seen = new Map<string, number>();
  const featureItems = features.map((feature) => {
    const count = (seen.get(feature) ?? 0) + 1;
    seen.set(feature, count);
    return { feature, key: `${feature}-${count}` };
  });

  return (
    <article className="group relative isolate h-full">
      {/* Soft brand aura behind the popular plan */}
      {isFeatured && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-8 -bottom-4 top-12 -z-10 rounded-full bg-primary/20 blur-3xl dark:bg-primary/25"
        />
      )}

      <SpotlightCard
        variant={isFeatured ? "featured" : "default"}
        className="flex h-full flex-col p-8"
      >
        {/* Light line along the top edge of the popular plan */}
        {isFeatured && (
          <div
            aria-hidden
            className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        )}

        <div className="flex items-start justify-between gap-4">
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-2xl",
              isFeatured
                ? "bg-primary text-primary-foreground shadow-(--shadow-primary)"
                : "bg-primary/10 text-primary ring-1 ring-primary/15",
            )}
          >
            <Icon className="size-5" />
          </div>

          {isFeatured && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-(--shadow-primary)">
              <span className="size-1.5 rounded-full bg-primary-foreground" />
              Most popular
            </span>
          )}
        </div>

        <h3 className="mt-6 text-2xl font-semibold">{plan.name}</h3>

        {plan.description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {plan.description}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span
            className={cn(
              "text-4xl font-semibold tracking-tight tabular-nums",
              isFeatured && "lg:text-5xl",
            )}
          >
            {plan.price}
          </span>
          <span className="text-base font-medium">{plan.currency}</span>
          <span className="text-sm text-muted-foreground">
            / {billingLabel}
          </span>
        </div>

        {features.length > 0 && (
          <>
            <p className="mt-8 text-sm font-medium text-muted-foreground">
              What&apos;s included
            </p>
            <ul className="mt-4 space-y-3 border-t border-border pt-5">
              {featureItems.map(({ feature, key }) => (
                <li key={key} className="flex items-start gap-3 text-sm">
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                      isFeatured
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <span className="text-foreground/85">{feature}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-auto pt-8">
          <Link
            href="/contact"
            className={cn(
              isFeatured ? "brand-btn-primary" : "brand-btn-secondary",
              "w-full justify-center",
            )}
          >
            Get Started
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </SpotlightCard>
    </article>
  );
}