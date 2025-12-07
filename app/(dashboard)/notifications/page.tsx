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
import { mockNotifications } from "@/lib/mock-data"

const iconMap = {
  briefcase: Briefcase,
  users: Users,
  "check-circle": CheckCircle,
  folder: FolderKanban,
  award: Award,
  "trending-up": TrendingUp,
  clock: Clock,
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.read) : notifications

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
            const Icon = iconMap[notification.icon as keyof typeof iconMap] || Briefcase
            return (
              <Card
                key={notification.id}
                className={cn(
                  "group relative transition-all hover:shadow-md animate-fade-in",
                  !notification.read && "bg-accent/5 border-l-4 border-l-primary",
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link href={notification.actionUrl} className="block p-4">
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
