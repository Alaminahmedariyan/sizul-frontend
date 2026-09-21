"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";

import { useClientProposals, useMyClientProfile } from "@/hooks/use-clients";

export default function PortalProposalsPage() {
  const { data: clientRes, isLoading: isClientLoading } = useMyClientProfile();
  const clientId = clientRes?.data?.id ?? "";

  const { data: proposalsRes, isLoading } = useClientProposals(clientId);

  if (isClientLoading || isLoading)
    return <p className="text-muted-foreground">Loading proposals...</p>;

  const proposals = proposalsRes?.data ?? [];

  return (
    <div>
      <PageHeader
        title="Your Proposals"
        description="Review and respond to proposals from the team"
      />

      {proposals.length === 0 && (
        <EmptyState
          icon={FileText}
          title="No proposals yet"
          description="Proposals sent to you will appear here."
        />
      )}

      <div className="space-y-3">
        {proposals.map((proposal) => (
          <Link key={proposal.id} href={`/portal/proposals/${proposal.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="font-medium">{proposal.title}</p>
                  <p className="text-sm text-muted-foreground">
                    #{proposal.proposalNumber}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {proposal.total} {proposal.currency}
                  </span>
                  <StatusBadge status={proposal.status} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
