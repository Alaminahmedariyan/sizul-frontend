import { User as UserIcon } from "lucide-react";
import { MobileSidebar } from "@/components/admin/mobile-sidebar";
import { SignOutButtonMenuItem } from "@/components/shared/sign-out-button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { UserRole } from "@/types/auth";

export function Topbar({ email, role }: { email: string; role: UserRole }) {
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6 bg-background">
      <div className="flex items-center gap-2">
        <MobileSidebar role={role} />
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="size-8 border border-border">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-1">
              <span className="text-sm font-normal truncate">{email}</span>
              <Badge variant="secondary" className="w-fit text-xs">
                {role}
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="size-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <SignOutButtonMenuItem />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
