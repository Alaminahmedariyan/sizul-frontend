import type { LucideIcon } from "lucide-react";
import {
  CreditCard,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Star,
  User,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const PORTAL_NAV: NavItem[] = [
  { label: "Dashboard", href: "/portal/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/portal/projects", icon: FolderKanban },
  { label: "Proposals", href: "/portal/proposals", icon: FileText },
  { label: "Payments", href: "/portal/payments", icon: CreditCard },
  { label: "Reviews", href: "/portal/reviews", icon: Star },
  { label: "Profile", href: "/portal/profile", icon: User },
];
