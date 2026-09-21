import { Stagger, StaggerItem } from "@/components/marketing/motion";
import { SectionHeading } from "@/components/marketing/section-heading";
import type { PricingPlan } from "@/lib/api/pricing-plans";
import { cn } from "@/lib/utils";

import { PricingCard } from "./pricing-card";

type Props = {
  plans: PricingPlan[];
  title?: string;
  description?: string;
};

/** Puts the popular plan in the middle of the list (keeps the API order for the rest). */
function centerPopular(plans: PricingPlan[]) {
  const popular = plans.find((plan) => plan.isPopular);

  if (!popular) return plans;

  const others = plans.filter((plan) => plan !== popular);
  const middle = Math.floor(others.length / 2);

  return [...others.slice(0, middle), popular, ...others.slice(middle)];
}

export function PricingSection({
  plans,
  title = "Pricing Plans",
  description,
}: Props) {
  if (plans.length === 0) return null;

  const ordered = centerPopular(plans);

  const columns =
    plans.length === 1
      ? "max-w-md"
      : plans.length === 2
        ? "md:grid-cols-2 lg:max-w-4xl"
        : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="mt-20">
      <SectionHeading title={title} description={description} />

      <Stagger className={cn("mx-auto grid grid-cols-1 gap-6", columns)}>
        {ordered.map((plan) => (
          <StaggerItem
            key={plan.id}
            // Popular plan: first on mobile/tablet, taller than its neighbours on desktop.
            className={cn(plan.isPopular && "max-lg:order-first lg:-my-4")}
          >
            <PricingCard plan={plan} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}