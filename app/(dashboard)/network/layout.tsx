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
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 w-full sm:w-auto">
            <Link href="/network/requests" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                <UserPlus className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">Connection Requests</span>
                <span className="sm:hidden">Requests</span>
              </Button>
            </Link>
            <Link href="/network/find" className="flex-1 sm:flex-none">
              <Button className="w-full sm:w-auto">
                <Users className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">Find Connections</span>
                <span className="sm:hidden">Find</span>
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
                  <Avatar className="h-12 w-12 flex-shrink-0">
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
                  <Users className="h-3 w-3 flex-shrink-0" />
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
