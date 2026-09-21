import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Briefcase,
  CalendarCheck,
  CreditCard,
  FileText,
  FolderKanban,
  Gift,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  Mail,
  Settings,
  ShieldCheck,
  Star,
  UserCog,
  Users,
} from "lucide-react";

import type { UserRole } from "@/types/auth";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Omit -> visible to everyone allowed in /admin (ADMIN + STAFF) */
  roles?: UserRole[];
};

export const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/admin/leads", icon: FileText },
  { label: "Consultations", href: "/admin/consultations", icon: CalendarCheck },
  { label: "Clients", href: "/admin/clients", icon: Users },
  { label: "Proposals", href: "/admin/proposals", icon: FileText },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Services", href: "/admin/services", icon: Briefcase },
  { label: "Content", href: "/admin/content/portfolio", icon: Layers },
  { label: "Media", href: "/admin/media", icon: ImageIcon },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Appreciations", href: "/admin/appreciations", icon: Gift },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Staff", href: "/admin/staff", icon: UserCog, roles: ["ADMIN"] },
  { label: "Users", href: "/admin/users", icon: ShieldCheck, roles: ["ADMIN"] },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    roles: ["ADMIN"],
  },
];
