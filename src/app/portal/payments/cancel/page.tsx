"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <XCircle className="size-16 text-destructive mb-4" />
      <h1 className="text-xl font-semibold">Payment Cancelled</h1>
      <p className="text-muted-foreground mt-1 mb-6">
        Your payment was not completed. No charge was made.
      </p>
      <Button asChild>
        <Link href="/portal/proposals">Back to Proposals</Link>
      </Button>
    </div>
  );
}
