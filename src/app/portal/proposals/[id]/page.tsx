"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useBkashCheckout,
  useSslcommerzCheckout,
  useStripeCheckout,
} from "@/hooks/use-payments";
import {
  useAcceptProposal,
  useProposal,
  useRejectProposal,
} from "@/hooks/use-proposals";

export default function PortalProposalDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: proposalRes, isLoading } = useProposal(id);
  const acceptProposal = useAcceptProposal(id);
  const rejectProposal = useRejectProposal(id);

  const stripeCheckout = useStripeCheckout();
  const bkashCheckout = useBkashCheckout();
  const sslcommerzCheckout = useSslcommerzCheckout();

  if (isLoading)
    return <p className="text-muted-foreground">Loading proposal...</p>;

  const proposal = proposalRes?.data;
  if (!proposal)
    return <p className="text-muted-foreground">Proposal not found.</p>;

  const isBdt = proposal.currency === "BDT";
  const isPending = proposal.status === "SENT" || proposal.status === "VIEWED";
  const needsPayment = proposal.status === "ACCEPTED";

  const handleAccept = () => {
    acceptProposal.mutate(undefined, {
      onSuccess: () =>
        toast.success("Proposal accepted! You can now proceed to payment."),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleReject = () => {
    rejectProposal.mutate(undefined, {
      onSuccess: () => toast.success("Proposal declined."),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleStripeCheckout = () => {
    stripeCheckout.mutate(proposal.id, {
      onSuccess: (res) => {
        window.location.href = res.data.checkoutUrl;
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleBkashCheckout = () => {
    bkashCheckout.mutate(proposal.id, {
      onSuccess: (res) => {
        window.location.href = res.data.checkoutUrl;
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleSslcommerzCheckout = () => {
    sslcommerzCheckout.mutate(proposal.id, {
      onSuccess: (res) => {
        window.location.href = res.data.checkoutUrl;
      },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div>
      <PageHeader
        title={proposal.title}
        description={`Proposal #${proposal.proposalNumber}`}
        action={<StatusBadge status={proposal.status} />}
      />

      {proposal.introduction && (
        <p className="text-sm mb-4">{proposal.introduction}</p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>What's Included</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposal.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unitPrice}</TableCell>
                  <TableCell>{item.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="text-right mt-4 space-y-1 text-sm">
            <p>Subtotal: {proposal.subtotal}</p>
            {Number(proposal.discount) > 0 && (
              <p>Discount: -{proposal.discount}</p>
            )}
            {Number(proposal.tax) > 0 && <p>Tax: {proposal.tax}</p>}
            <p className="font-semibold text-base">
              Total: {proposal.total} {proposal.currency}
            </p>
          </div>
        </CardContent>
      </Card>

      {proposal.terms && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Terms</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">{proposal.terms}</CardContent>
        </Card>
      )}

      {isPending && (
        <Card className="mt-4">
          <CardContent className="pt-6 flex gap-2">
            <Button disabled={acceptProposal.isPending} onClick={handleAccept}>
              {acceptProposal.isPending ? "Accepting..." : "Accept Proposal"}
            </Button>
            <Button
              variant="outline"
              disabled={rejectProposal.isPending}
              onClick={handleReject}
            >
              Decline
            </Button>
          </CardContent>
        </Card>
      )}

      {needsPayment && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Proceed to Payment</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              disabled={stripeCheckout.isPending}
              onClick={handleStripeCheckout}
            >
              Pay with Card (Stripe)
            </Button>
            {isBdt && (
              <>
                <Button
                  variant="secondary"
                  disabled={bkashCheckout.isPending}
                  onClick={handleBkashCheckout}
                >
                  Pay with bKash
                </Button>
                <Button
                  variant="secondary"
                  disabled={sslcommerzCheckout.isPending}
                  onClick={handleSslcommerzCheckout}
                >
                  Pay with SSLCommerz
                </Button>
              </>
            )}
            {!isBdt && (
              <p className="text-xs text-muted-foreground self-center">
                bKash and SSLCommerz are only available for BDT proposals.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {proposal.status === "REJECTED" && (
        <p className="text-sm text-muted-foreground mt-4">
          You declined this proposal.
        </p>
      )}
    </div>
  );
}
