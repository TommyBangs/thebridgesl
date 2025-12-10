"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Briefcase, Users, CheckCircle, FolderKanban, Award, TrendingUp, Clock, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/shared/page-header"
import { cn } from "@/lib/utils"
import { useApi } from "@/lib/hooks/use-api"
import { apiPut } from "@/lib/api-client"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { EmptyState } from "@/components/shared/empty-state"
import { toast } from "@/hooks/use-toast"

const iconMap: Record<string, any> = {
  OPPORTUNITY: Briefcase,
  CONNECTION: Users,
  SKILL: CheckCircle,
  PROJECT: FolderKanban,
  CREDENTIAL: Award,
  TRENDING: TrendingUp,
  default: Clock,
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const endpoint = filter === "unread" ? "/notifications?filter=unread" : "/notifications"
  const { data: notificationsData, loading, error, refetch } = useApi<{ notifications: any[] }>(endpoint)

  const notifications = notificationsData?.notifications || []
  const unreadCount = notifications.filter((n: any) => !n.read).length

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiPut(`/notifications/${id}/read`, {})
      toast({
        title: "Notification marked as read",
      })
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark notification as read",
        variant: "destructive",
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await apiPut("/notifications", { action: "mark-all-read" })
      toast({
        title: "All notifications marked as read",
      })
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark all notifications as read",
        variant: "destructive",
      })
    }
  }

  const handleDelete = (id: string) => {
    // Delete functionality can be added when API supports it
    toast({
      title: "Delete not available",
      description: "Delete functionality will be available soon",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading notifications"
        description="Unable to load notifications. Please try again."
      />
    )
  }

  const filteredNotifications = notifications

  return (
    <div className="container mx-auto space-y-6 py-6">
      <PageHeader title="Notifications" description="Stay updated with your latest activities and opportunities" />

      <div className="flex items-center justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "unread")} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">
                All <span className="ml-2 text-xs text-muted-foreground">({notifications.length})</span>
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread <span className="ml-2 text-xs text-muted-foreground">({unreadCount})</span>
              </TabsTrigger>
            </TabsList>

            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                <Check className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
            )}
          </div>
        </Tabs>
      </div>

      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-muted p-4">
                <CheckCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">All caught up!</h3>
                <p className="text-sm text-muted-foreground">
                  {filter === "unread" ? "You have no unread notifications" : "You don't have any notifications yet"}
                </p>
              </div>
            </div>
          </Card>
        ) : (
          filteredNotifications.map((notification: any, index: number) => {
            const Icon = iconMap[notification.type] || iconMap.default || Clock
            return (
              <Card
                key={notification.id}
                className={cn(
                  "group relative transition-all hover:shadow-md animate-fade-in",
                  !notification.read && "bg-accent/5 border-l-4 border-l-primary",
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link href={notification.actionUrl || "#"} className="block p-4">
                  <div className="flex gap-4">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                        !notification.read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={cn(
                            "text-sm leading-tight",
                            !notification.read ? "font-semibold text-foreground" : "font-medium text-foreground",
                          )}
                        >
                          {notification.title}
                        </h4>
                        {!notification.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.preventDefault()
                            handleMarkAsRead(notification.id)
                          }}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => {
                          e.preventDefault()
                          handleDelete(notification.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </Link>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
