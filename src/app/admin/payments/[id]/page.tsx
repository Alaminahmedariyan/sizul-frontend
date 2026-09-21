"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { usePayment, useRefundPayment } from "@/hooks/use-payments";

export default function AdminPaymentDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: paymentRes, isLoading } = usePayment(id);
  const refundPayment = useRefundPayment();

  if (isLoading)
    return <p className="text-muted-foreground">Loading payment...</p>;

  const payment = paymentRes?.data;
  if (!payment)
    return <p className="text-muted-foreground">Payment not found.</p>;

  const canRefund =
    payment.provider === "STRIPE" && payment.status === "SUCCEEDED";

  return (
    <div>
      <PageHeader
        title={`${payment.amount} ${payment.currency}`}
        description={`via ${payment.provider}`}
        action={<StatusBadge status={payment.status} />}
      />

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Provider Payment ID:</span>{" "}
            {payment.providerPaymentId ?? "-"}
          </p>
          <p>
            <span className="text-muted-foreground">Method:</span>{" "}
            {payment.method ?? "-"}
          </p>
          <p>
            <span className="text-muted-foreground">Paid At:</span>{" "}
            {payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "-"}
          </p>
        </CardContent>
      </Card>

      {canRefund && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ConfirmDeleteDialog
              trigger={<Button variant="destructive">Refund Payment</Button>}
              title="Refund this payment?"
              description="This will refund the full amount via Stripe. This action cannot be undone."
              onConfirm={() =>
                refundPayment.mutate(payment.id, {
                  onSuccess: () => toast.success("Payment refunded"),
                  onError: (err) => toast.error(err.message),
                })
              }
              isPending={refundPayment.isPending}
            />
          </CardContent>
        </Card>
      )}

      {payment.status === "REFUNDED" && (
        <p className="text-sm text-yellow-600 mt-4">
          This payment has already been refunded.
        </p>
      )}
    </div>
  );
}
