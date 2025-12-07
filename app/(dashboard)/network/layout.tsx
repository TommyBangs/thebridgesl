"use client"

import { Users, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/shared/page-header"
import { mockConnections } from "@/lib/mock-data"
import Link from "next/link"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function NetworkPageClient() {
  const [isMessageOpen, setIsMessageOpen] = useState(false)
  const [selectedConnection, setSelectedConnection] = useState<any>(null)
  const [message, setMessage] = useState("")

  const handleMessage = (connection: any) => {
    setSelectedConnection(connection)
    setIsMessageOpen(true)
  }

  const handleSendMessage = () => {
    // Handle sending message
    setMessage("")
    setIsMessageOpen(false)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Network"
        description="Build meaningful professional connections"
        action={
          <div className="flex gap-2">
            <Link href="/network/requests">
              <Button variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Connection Requests
              </Button>
            </Link>
            <Link href="/network/find">
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Find Connections
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockConnections.map((connection) => (
          <Card key={connection.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={connection.avatar || "/placeholder.svg"} alt={connection.name} />
                    <AvatarFallback>{connection.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{connection.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{connection.role}</p>
                    <p className="text-xs text-muted-foreground">{connection.company || connection.university}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{connection.mutualConnections} mutual connections</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => handleMessage(connection)}
                >
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>Send a message to {selectedConnection?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={selectedConnection?.avatar || "/placeholder.svg"} alt={selectedConnection?.name} />
                <AvatarFallback>{selectedConnection?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedConnection?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedConnection?.role}</p>
              </div>
            </div>
            <Textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
            />
            <Button onClick={handleSendMessage} className="w-full">
              Send Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
