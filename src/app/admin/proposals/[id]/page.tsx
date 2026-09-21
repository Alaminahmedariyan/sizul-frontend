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
  useAcceptProposal,
  useProposal,
  useRejectProposal,
  useSendProposal,
} from "@/hooks/use-proposals";

export default function ProposalDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: proposalRes, isLoading } = useProposal(id);
  const sendProposal = useSendProposal(id);
  const acceptProposal = useAcceptProposal(id);
  const rejectProposal = useRejectProposal(id);

  if (isLoading)
    return <p className="text-muted-foreground">Loading proposal...</p>;

  const proposal = proposalRes?.data;
  if (!proposal)
    return <p className="text-muted-foreground">Proposal not found.</p>;

  const runAction = (action: typeof sendProposal, successMsg: string) => {
    action.mutate(undefined, {
      onSuccess: () => toast.success(successMsg),
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
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Unit Price</TableHead>
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
            <p>Discount: {proposal.discount}</p>
            <p>Tax: {proposal.tax}</p>
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

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          {proposal.status === "DRAFT" && (
            <Button
              disabled={sendProposal.isPending}
              onClick={() => runAction(sendProposal, "Proposal sent")}
            >
              {sendProposal.isPending ? "Sending..." : "Send to Client"}
            </Button>
          )}

          {(proposal.status === "SENT" || proposal.status === "VIEWED") && (
            <>
              <Button
                variant="secondary"
                disabled={acceptProposal.isPending}
                onClick={() => runAction(acceptProposal, "Marked as accepted")}
              >
                Mark Accepted
              </Button>
              <Button
                variant="outline"
                disabled={rejectProposal.isPending}
                onClick={() => runAction(rejectProposal, "Marked as rejected")}
              >
                Mark Rejected
              </Button>
            </>
          )}

          {proposal.status === "ACCEPTED" && (
            <p className="text-sm text-green-600">
              ✅ Client accepted this proposal.
            </p>
          )}
          {proposal.status === "REJECTED" && (
            <p className="text-sm text-red-600">
              ❌ Client rejected this proposal.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
