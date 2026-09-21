import type { Metadata } from "next";

import { CtaSection } from "@/components/marketing/cta-section";
import { FaqPreview } from "@/components/marketing/faq-preview";
import { FeaturedWork } from "@/components/marketing/featured-work";
import { Hero } from "@/components/marketing/hero";
import { ProcessSection } from "@/components/marketing/process-section";
import { ServicesSection } from "@/components/marketing/service-section";
import { StatsStrip } from "@/components/marketing/stats-strip";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { TrustedBy } from "@/components/marketing/trusted-by";
import { getServices } from "@/lib/api/services";
import { getTestimonials } from "@/lib/api/testimonials";
import { SITE } from "@/lib/site";
import { HomeCursor } from "@/components/marketing/home-cursor";

export const metadata: Metadata = {
  title: "SEO and web design agency",
  description: SITE.description,
};

export default async function HomePage() {
  const [servicesRes, testimonialsRes] = await Promise.allSettled([
    getServices(),
    getTestimonials(),
  ]);

  const services =
    servicesRes.status === "fulfilled" ? servicesRes.value.data : [];
  const testimonials =
    testimonialsRes.status === "fulfilled"
      ? testimonialsRes.value.data.slice(0, 3)
      : [];

  return (
    <>
      <HomeCursor />
      <Hero />
      <TrustedBy />
      <StatsStrip />
      <ServicesSection services={services} />
      <ProcessSection />
      <FeaturedWork />
      <TestimonialsSection testimonials={testimonials} />
      <FaqPreview />
      <CtaSection />
    </>
  );
}