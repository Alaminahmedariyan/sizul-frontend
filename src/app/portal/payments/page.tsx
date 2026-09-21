"use client";

import { CreditCard } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";

import { useMyPayments } from "@/hooks/use-payments";

export default function PortalPaymentsPage() {
  const { data, isLoading } = useMyPayments();

  const payments = data?.data ?? [];

  return (
    <div>
      <PageHeader title="Payment History" />

      {isLoading && (
        <p className="text-muted-foreground">Loading payments...</p>
      )}
      {!isLoading && payments.length === 0 && (
        <EmptyState icon={CreditCard} title="No payments yet" />
      )}

      <div className="space-y-2">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {payment.amount} {payment.currency}
                </p>
                <p className="text-sm text-muted-foreground">
                  {payment.provider} ·{" "}
                  {payment.paidAt
                    ? new Date(payment.paidAt).toLocaleDateString()
                    : "Pending"}
                </p>
              </div>
              <StatusBadge status={payment.status} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
