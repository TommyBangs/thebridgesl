"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Briefcase, Users, CheckCircle, FolderKanban, Award, TrendingUp, Clock, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/shared/page-header"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/shared/loading-spinner"

const iconMap: Record<string, any> = {
  opportunity: Briefcase,
  connection: Users,
  skill: CheckCircle,
  project: FolderKanban,
  credential: Award,
  trending: TrendingUp,
  default: Clock,
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const [processing, setProcessing] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchNotifications()
  }, [filter])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const url = filter === "unread" ? "/api/notifications?unread=true" : "/api/notifications"
      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch notifications")
      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      setProcessing((prev) => new Set(prev).add(id))
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "PUT",
      })

      if (!response.ok) throw new Error("Failed to mark as read")

      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
    } finally {
      setProcessing((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "PUT",
      })

      if (!response.ok) throw new Error("Failed to mark all as read")

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      toast({
        title: "Success",
        description: "All notifications marked as read",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setProcessing((prev) => new Set(prev).add(id))
      // Note: Delete endpoint not implemented yet, so we'll just remove from state
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      toast({
        title: "Notification removed",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      })
    } finally {
      setProcessing((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length
  const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.read) : notifications

  if (loading && notifications.length === 0) {
    return (
      <div className="container mx-auto space-y-6 py-6">
        <PageHeader title="Notifications" description="Stay updated with your latest activities and opportunities" />
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

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
          filteredNotifications.map((notification, index) => {
            const Icon = iconMap[notification.type] || iconMap.default
            const isProcessing = processing.has(notification.id)

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
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
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
                          disabled={isProcessing}
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
                        disabled={isProcessing}
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
