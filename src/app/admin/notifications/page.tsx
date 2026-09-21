"use client";

import { Bell, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useMyNotifications,
} from "@/hooks/use-notifications";

export default function AdminNotificationsPage() {
  const { data, isLoading } = useMyNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();

  const notifications = data?.data ?? [];

  return (
    <div>
      <PageHeader
        title="Notifications"
        action={
          <Button
            variant="outline"
            size="sm"
            disabled={markAllRead.isPending}
            onClick={() =>
              markAllRead.mutate(undefined, {
                onSuccess: () => toast.success("All marked as read"),
              })
            }
          >
            Mark all read
          </Button>
        }
      />

      {isLoading && (
        <p className="text-muted-foreground">Loading notifications...</p>
      )}
      {!isLoading && notifications.length === 0 && (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up."
        />
      )}

      <div className="space-y-2">
        {notifications.map((n) => (
          <Card key={n.id} className={n.isRead ? "opacity-60" : ""}>
            <CardContent className="pt-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                {!n.isRead && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => markRead.mutate(n.id)}
                  >
                    <Check className="size-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteNotification.mutate(n.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
