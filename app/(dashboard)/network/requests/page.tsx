"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/shared/page-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Check, X, MessageSquare } from "lucide-react"
import { formatRelativeTime } from "@/lib/format"
import { toast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { useRouter } from "next/navigation"

export default function ConnectionRequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/network/requests?type=received")
      if (!response.ok) throw new Error("Failed to fetch requests")
      const data = await response.json()
      setRequests(data.requests || [])
    } catch (error) {
      console.error("Error fetching requests:", error)
      toast({
        title: "Error",
        description: "Failed to load connection requests",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (requestId: string) => {
    try {
      setProcessing((prev) => new Set(prev).add(requestId))
      const response = await fetch(`/api/network/requests/${requestId}/accept`, {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to accept request")
      }

      toast({
        title: "Connection accepted",
        description: "You are now connected",
      })

      // Remove from list
      setRequests((prev) => prev.filter((req) => req.id !== requestId))
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to accept connection",
        variant: "destructive",
      })
    } finally {
      setProcessing((prev) => {
        const next = new Set(prev)
        next.delete(requestId)
        return next
      })
    }
  }

  const handleDecline = async (requestId: string) => {
    try {
      setProcessing((prev) => new Set(prev).add(requestId))
      const response = await fetch(`/api/network/requests/${requestId}/decline`, {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to decline request")
      }

      toast({
        title: "Connection declined",
        description: "The connection request has been declined",
      })

      // Remove from list
      setRequests((prev) => prev.filter((req) => req.id !== requestId))
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to decline connection",
        variant: "destructive",
      })
    } finally {
      setProcessing((prev) => {
        const next = new Set(prev)
        next.delete(requestId)
        return next
      })
    }
  }

  const handleMessage = (userId: string) => {
    router.push(`/messages/${userId}`)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Connection Requests"
          description="Manage your connection requests"
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <main className="flex-1">
      <PageHeader
        title="Connection Requests"
        description={`You have ${requests.length} pending connection request${requests.length !== 1 ? "s" : ""}`}
      />

      <div className="space-y-4">
        {requests.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No pending connection requests</p>
          </Card>
        ) : (
          requests.map((request) => {
            const isProcessing = processing.has(request.id)

            return (
              <Card key={request.id} className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.name} />
                      <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{request.name}</h3>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {request.connectionType}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-1">
                        {request.role} {request.company ? `at ${request.company}` : ""}
                      </p>

                      {request.mutualConnections > 0 && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {request.mutualConnections} mutual connection{request.mutualConnections !== 1 ? "s" : ""}
                        </p>
                      )}

                      {request.message && (
                        <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3 py-1">
                          "{request.message}"
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground mt-2">
                        Requested {formatRelativeTime(new Date(request.requestedAt))}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 md:flex-col lg:flex-row">
                    <Button
                      onClick={() => handleAccept(request.id)}
                      size="sm"
                      className="flex-1 md:flex-none"
                      disabled={isProcessing}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleDecline(request.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1 md:flex-none"
                      disabled={isProcessing}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 md:flex-none"
                      onClick={() => handleMessage(request.senderId)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </main>
  )
}
