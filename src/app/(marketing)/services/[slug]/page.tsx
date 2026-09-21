import Link from "next/link";
import { notFound } from "next/navigation";
import { PricingSection } from "@/components/pricing/pricing-section";
import { Button } from "@/components/ui/button";

import { getPricingPlans } from "@/lib/api/pricing-plans";
import { getServiceBySlug } from "@/lib/api/services";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let service: Awaited<ReturnType<typeof getServiceBySlug>>["data"] | null =
    null;

  try {
    const res = await getServiceBySlug(slug);
    service = res.data;
  } catch {
    notFound();
  }

  if (!service) notFound();

  let pricingPlans: Awaited<ReturnType<typeof getPricingPlans>>["data"] = [];
  try {
    const plansRes = await getPricingPlans(service.id);
    pricingPlans = plansRes.data;
  } catch {
    pricingPlans = [];
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">{service.name}</h1>
        {service.tagline && (
          <p className="mt-3 text-lg text-muted-foreground">
            {service.tagline}
          </p>
        )}
        {service.description && (
          <p className="mt-6 leading-relaxed text-foreground/80">
            {service.description}
          </p>
        )}
      </div>

      {pricingPlans.length > 0 && (
        <PricingSection
          plans={pricingPlans}
          title="Pricing Plans"
          description="Choose the plan that fits your business needs."
        />
      )}

      <div className="mt-14 flex justify-center">
        <Button size="lg" asChild>
          <Link href="/contact">Get Started</Link>
        </Button>
      </div>
    </div>
  );
}
