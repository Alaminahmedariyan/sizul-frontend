"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "cn";

interface UserAvatarProps {
  image?: string | null;
  name?: string | null;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function UserAvatar({
  image,
  name,
  size = "default",
  className,
}: UserAvatarProps) {
  const initials = getInitials(name);

  return (
    <Avatar size={size} className={cn(className)}>
      {image ? (
        <AvatarImage
          src={image}
          alt={name ?? "User avatar"}
          referrerPolicy="no-referrer"
        />
      ) : null}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}

function getInitials(name?: string | null): string {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/).slice(0, 2);
  const initials = parts.map((part) => part[0]?.toUpperCase() ?? "").join("");

  return initials || "?";
}