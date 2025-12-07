"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/shared/page-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Check, X, MessageSquare } from "lucide-react"
import { MOCK_CONNECTION_REQUESTS } from "@/lib/mock-data"
import { formatRelativeTime } from "@/lib/format"

export default function ConnectionRequestsPage() {
  const [requests, setRequests] = useState(MOCK_CONNECTION_REQUESTS)

  const handleAccept = (requestId: string) => {
    setRequests(requests.filter((req) => req.id !== requestId))
  }

  const handleDecline = (requestId: string) => {
    setRequests(requests.filter((req) => req.id !== requestId))
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
          requests.map((request) => (
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
                      {request.role} at {request.company}
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
                      Requested {formatRelativeTime(request.requestedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 md:flex-col lg:flex-row">
                  <Button onClick={() => handleAccept(request.id)} size="sm" className="flex-1 md:flex-none">
                    <Check className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleDecline(request.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1 md:flex-none"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Decline
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 md:flex-none">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </main>
  )
}
