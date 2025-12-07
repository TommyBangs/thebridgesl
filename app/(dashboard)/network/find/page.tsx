"use client"

import { useState } from "react"
import { Search, UserPlus, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { mockSuggestedConnections } from "@/lib/mock-data"

export default function FindConnectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set())

  const filteredConnections = mockSuggestedConnections.filter(
    (person) =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.university?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleConnect = (id: string) => {
    setConnectedIds((prev) => new Set(prev).add(id))
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredConnections.map((person) => {
          const isConnected = connectedIds.has(person.id)

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

                  {person.matchScore && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {person.matchScore}% match
                    </Badge>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{person.mutualConnections} mutual connections</span>
                  </div>

                  <Button size="sm" className="w-full" onClick={() => handleConnect(person.id)} disabled={isConnected}>
                    {isConnected ? (
                      <>Connected</>
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

      {filteredConnections.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No connections found matching your search.</p>
        </div>
      )}
    </div>
  )
}
