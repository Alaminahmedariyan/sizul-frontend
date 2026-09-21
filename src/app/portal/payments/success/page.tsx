"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <CheckCircle2 className="size-16 text-green-600 mb-4" />
      <h1 className="text-xl font-semibold">Payment Successful</h1>
      <p className="text-muted-foreground mt-1 mb-6">
        Thank you — your payment has been received.
      </p>
      <Button asChild>
        <Link href="/portal/payments">View Payment History</Link>
      </Button>
    </div>
  );
}
