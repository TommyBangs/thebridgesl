"use client"

import { useState, useEffect } from "react"
import { Users, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/shared/page-header"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/shared/loading-spinner"

export default function NetworkPageClient() {
  const [connections, setConnections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchConnections()
  }, [])

  const fetchConnections = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/network/connections")
      if (!response.ok) throw new Error("Failed to fetch connections")
      const data = await response.json()
      setConnections(data.connections || [])
    } catch (error) {
      console.error("Error fetching connections:", error)
      toast({
        title: "Error",
        description: "Failed to load connections",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMessage = (connectionId: string) => {
    router.push(`/messages/${connectionId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
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

      {connections.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Users className="h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">No connections yet</h3>
              <p className="text-sm text-muted-foreground">Start building your network by finding connections</p>
            </div>
            <Link href="/network/find">
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Find Connections
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {connections.map((connection) => (
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
                    onClick={() => handleMessage(connection.id)}
                  >
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
