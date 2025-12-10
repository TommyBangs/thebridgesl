"use client"

import { useState, useEffect } from "react"
import { Search, UserPlus, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { useDebounce } from "@/hooks/use-debounce"
import { toast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/shared/loading-spinner"

export default function FindConnectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingRequest, setSendingRequest] = useState<Set<string>>(new Set())
  const debouncedSearch = useDebounce(searchQuery, 500)

  useEffect(() => {
    fetchSuggestions()
  }, [debouncedSearch])

  const fetchSuggestions = async () => {
    try {
      setLoading(true)
      const url = debouncedSearch
        ? `/api/network/suggestions?search=${encodeURIComponent(debouncedSearch)}`
        : "/api/network/suggestions"
      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch suggestions")
      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      toast({
        title: "Error",
        description: "Failed to load suggestions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (userId: string) => {
    try {
      setSendingRequest((prev) => new Set(prev).add(userId))
      const response = await fetch("/api/network/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: userId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to send connection request")
      }

      toast({
        title: "Connection request sent",
        description: "Your connection request has been sent",
      })

      // Remove from suggestions
      setSuggestions((prev) => prev.filter((s) => s.id !== userId))
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send connection request",
        variant: "destructive",
      })
    } finally {
      setSendingRequest((prev) => {
        const next = new Set(prev)
        next.delete(userId)
        return next
      })
    }
  }

  if (loading && suggestions.length === 0) {
    return (
      <div className="space-y-8">
        <PageHeader title="Find Connections" description="Discover and connect with professionals in your field" />
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
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

      {loading && suggestions.length > 0 ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : suggestions.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No connections found matching your search.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((person) => {
            const isSending = sendingRequest.has(person.id)

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
                        <p className="text-sm text-muted-foreground truncate">{person.role}</p>
                        <p className="text-xs text-muted-foreground truncate">{person.company || person.university}</p>
                      </div>
                    </div>

                    {person.matchScore > 0 && (
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
                      onClick={() => handleConnect(person.id)}
                      disabled={isSending}
                    >
                      {isSending ? (
                        "Sending..."
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
    </div>
  )
}
