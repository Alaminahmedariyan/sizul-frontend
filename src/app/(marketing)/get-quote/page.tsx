import type { Metadata } from "next";

import { GetQuoteForm } from "@/components/marketing/get-quote-form";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Tell us about your project and we'll get back to you with a quote.",
};

export default function GetQuotePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Get a Quote
        </h1>
        <p className="mt-3 text-muted-foreground">
          Tell us about your project and we&apos;ll get back to you within 24
          hours.
        </p>
      </div>

      <GetQuoteForm />
    </div>
  );
}
