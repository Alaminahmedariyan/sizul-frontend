import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusVariant = "default" | "success" | "warning" | "destructive" | "info";

const STATUS_COLOR_MAP: Record<string, StatusVariant> = {
  // Generic
  ACTIVE: "success",
  INACTIVE: "default",
  SUSPENDED: "destructive",
  // Lead
  NEW: "info",
  CONTACTED: "info",
  QUALIFIED: "info",
  PROPOSAL_SENT: "warning",
  NEGOTIATING: "warning",
  CONVERTED: "success",
  LOST: "destructive",
  // Project / Task / Milestone
  PLANNING: "default",
  IN_PROGRESS: "info",
  ON_HOLD: "warning",
  REVIEW: "warning",
  IN_REVIEW: "warning",
  BLOCKED: "destructive",
  COMPLETED: "success",
  CANCELLED: "destructive",
  TODO: "default",
  PENDING: "default",
  // Proposal
  DRAFT: "default",
  SENT: "info",
  VIEWED: "info",
  ACCEPTED: "success",
  REJECTED: "destructive",
  EXPIRED: "destructive",
  // Payment
  PROCESSING: "info",
  SUCCEEDED: "success",
  FAILED: "destructive",
  REFUNDED: "warning",
  // Content
  PUBLISHED: "success",
  ARCHIVED: "default",
  // Consultation
  CONFIRMED: "success",
  NO_SHOW: "destructive",
};

const VARIANT_CLASS_MAP: Record<StatusVariant, string> = {
  default: "",
  success: "bg-green-100 text-green-800 hover:bg-green-100",
  warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  destructive: "bg-red-100 text-red-800 hover:bg-red-100",
  info: "bg-blue-100 text-blue-800 hover:bg-blue-100",
};

export function StatusBadge({ status }: { status: string }) {
  const variant = STATUS_COLOR_MAP[status] ?? "default";

  return (
    <Badge variant="secondary" className={cn(VARIANT_CLASS_MAP[variant])}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
