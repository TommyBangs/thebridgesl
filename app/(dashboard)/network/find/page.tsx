"use client"

import { useState, useMemo } from "react"
import { Search, UserPlus, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { useApi } from "@/lib/hooks/use-api"
import { apiPost } from "@/lib/api-client"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { EmptyState } from "@/components/shared/empty-state"
import { toast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function FindConnectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [message, setMessage] = useState("")
  const { data: suggestionsData, loading, error, refetch } = useApi<{ suggestions: any[] }>("/network/suggestions")

  const filteredConnections = useMemo(() => {
    if (!suggestionsData?.suggestions) return []
    const suggestions = suggestionsData.suggestions
    if (!searchQuery.trim()) return suggestions
    
    const query = searchQuery.toLowerCase()
    return suggestions.filter(
      (person: any) =>
        person.name.toLowerCase().includes(query) ||
        person.jobTitle?.toLowerCase().includes(query) ||
        person.company?.toLowerCase().includes(query) ||
        person.university?.toLowerCase().includes(query),
    )
  }, [suggestionsData, searchQuery])

  const handleConnect = (user: any) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleSendRequest = async () => {
    if (!selectedUser) return
    
    try {
      await apiPost("/network/requests", {
        receiverId: selectedUser.id,
        message: message || undefined,
      })
      setRequestedIds((prev) => new Set(prev).add(selectedUser.id))
      toast({
        title: "Connection request sent",
        description: `Your request has been sent to ${selectedUser.name}`,
      })
      setIsDialogOpen(false)
      setMessage("")
      setSelectedUser(null)
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send connection request",
        variant: "destructive",
      })
    }
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
        title="Error loading suggestions"
        description="Unable to load connection suggestions. Please try again."
      />
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Find Connections" description="Discover and connect with professionals in your field" />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name, role, or company..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredConnections.length === 0 ? (
        <EmptyState
          title="No suggestions found"
          description={searchQuery ? "No connections match your search. Try different keywords." : "No connection suggestions available at the moment."}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredConnections.map((person: any) => {
            const isRequested = requestedIds.has(person.id)

            return (
              <Card key={person.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                        <AvatarFallback>{person.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{person.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{person.jobTitle || person.role}</p>
                        <p className="text-xs text-muted-foreground truncate">{person.company || person.university}</p>
                      </div>
                    </div>

                    {person.matchScore && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {person.matchScore}% match
                      </Badge>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{person.mutualConnections} mutual connections</span>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full" 
                      onClick={() => handleConnect(person)} 
                      disabled={isRequested}
                    >
                      {isRequested ? (
                        <>Request Sent</>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Connect
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Connection Request</DialogTitle>
            <DialogDescription>Send a connection request to {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={selectedUser?.avatar || "/placeholder.svg"} alt={selectedUser?.name} />
                <AvatarFallback>{selectedUser?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedUser?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedUser?.jobTitle || selectedUser?.role}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Optional Message</label>
              <Textarea
                placeholder="Add a personal message (optional)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSendRequest} className="flex-1">
                <UserPlus className="mr-2 h-4 w-4" />
                Send Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
