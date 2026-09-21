import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  /** e.g. "+12% from last month" — plain text, color decided by `trendDirection` */
  trend?: { text: string; direction: "up" | "down" | "neutral" };
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        {Icon && <Icon className="size-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p
            className={cn(
              "text-xs mt-1",
              trend.direction === "up" && "text-green-600",
              trend.direction === "down" && "text-red-600",
              trend.direction === "neutral" && "text-muted-foreground",
            )}
          >
            {trend.text}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
