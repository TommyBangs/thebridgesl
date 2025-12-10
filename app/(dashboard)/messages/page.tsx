"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/shared/page-header"
import { formatDistanceToNow } from "date-fns"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { toast } from "@/hooks/use-toast"

export default function MessagesPage() {
    const [conversations, setConversations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()

    useEffect(() => {
        fetchConversations()
    }, [])

    const fetchConversations = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/messages")
            if (!response.ok) throw new Error("Failed to fetch conversations")
            const data = await response.json()
            setConversations(data.conversations || [])
        } catch (error) {
            console.error("Error fetching conversations:", error)
            toast({
                title: "Error",
                description: "Failed to load conversations",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const filteredConversations = conversations.filter((conv) =>
        conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader title="Messages" description="Connect and communicate with your network" />
                <div className="flex items-center justify-center min-h-[400px]">
                    <LoadingSpinner />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <PageHeader title="Messages" description="Connect and communicate with your network" />

            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                />
            </div>

            {filteredConversations.length === 0 ? (
                <Card className="p-12 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
                    <p className="text-sm text-muted-foreground">Start a conversation with someone in your network</p>
                </Card>
            ) : (
                <div className="space-y-2">
                    {filteredConversations.map((conversation) => (
                        <Card
                            key={conversation.id}
                            className="cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => router.push(`/messages/${conversation.id}`)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={conversation.user.avatar || "/placeholder.svg"} alt={conversation.user.name} />
                                        <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold truncate">{conversation.user.name}</h3>
                                            {conversation.latestMessage && (
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(conversation.latestMessage.sentAt), { addSuffix: true })}
                                                </span>
                                            )}
                                        </div>
                                        {conversation.latestMessage && (
                                            <p className="text-sm text-muted-foreground truncate">{conversation.latestMessage.content}</p>
                                        )}
                                    </div>
                                    {conversation.unreadCount > 0 && (
                                        <Badge variant="default">{conversation.unreadCount}</Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

