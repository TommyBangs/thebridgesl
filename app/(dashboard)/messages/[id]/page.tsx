"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PageHeader } from "@/components/shared/page-header"
import { formatDistanceToNow } from "date-fns"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [messageContent, setMessageContent] = useState("")
    const [otherUser, setOtherUser] = useState<any>(null)
    const [conversationId, setConversationId] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        // Get current user ID from session
        fetch("/api/users/profile")
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    setUserId(data.user.id)
                }
            })
            .catch(console.error)
    }, [])

    useEffect(() => {
        const loadParams = async () => {
            const { id } = await params
            setConversationId(id)
        }
        loadParams()
    }, [params])

    useEffect(() => {
        if (conversationId) {
            fetchMessages(conversationId)
            fetchOtherUser(conversationId)
        }
    }, [conversationId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const fetchMessages = async (conversationId: string) => {
        try {
            setLoading(true)
            const response = await fetch(`/api/messages/${conversationId}`)
            if (!response.ok) throw new Error("Failed to fetch messages")
            const data = await response.json()
            setMessages(data.messages || [])
        } catch (error) {
            console.error("Error fetching messages:", error)
            toast({
                title: "Error",
                description: "Failed to load messages",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const fetchOtherUser = async (userId: string) => {
        try {
            const response = await fetch(`/api/users/${userId}`)
            if (!response.ok) throw new Error("Failed to fetch user")
            const data = await response.json()
            setOtherUser(data.user)
        } catch (error) {
            console.error("Error fetching user:", error)
        }
    }

    const handleSendMessage = async () => {
        if (!messageContent.trim() || !userId || !conversationId) return

        try {
            setSending(true)
            const response = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    receiverId: conversationId,
                    content: messageContent,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || "Failed to send message")
            }

            const data = await response.json()
            setMessages((prev) => [...prev, data.message])
            setMessageContent("")
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to send message",
                variant: "destructive",
            })
        } finally {
            setSending(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col h-[calc(100vh-200px)]">
                <PageHeader title="Conversation" />
                <div className="flex items-center justify-center flex-1">
                    <LoadingSpinner />
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-200px)]">
            <div className="flex items-center gap-4 pb-4 border-b">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                {otherUser && (
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={otherUser.avatar || "/placeholder.svg"} alt={otherUser.name} />
                            <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold">{otherUser.name}</h3>
                            <p className="text-sm text-muted-foreground">{otherUser.learnerProfile?.currentJobTitle || "Student"}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 p-4">
                {messages.map((message) => {
                    const isOwn = message.senderId === userId
                    return (
                        <div
                            key={message.id}
                            className={cn("flex gap-3", isOwn ? "justify-end" : "justify-start")}
                        >
                            {!isOwn && (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                                    <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn("flex flex-col max-w-[70%]", isOwn ? "items-end" : "items-start")}>
                                <Card className={cn(isOwn ? "bg-primary text-primary-foreground" : "")}>
                                    <CardContent className="p-3">
                                        <p className="text-sm">{message.content}</p>
                                    </CardContent>
                                </Card>
                                <span className="text-xs text-muted-foreground mt-1">
                                    {formatDistanceToNow(new Date(message.sentAt), { addSuffix: true })}
                                </span>
                            </div>
                            {isOwn && (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                                    <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-4">
                <div className="flex gap-2">
                    <Textarea
                        placeholder="Type your message..."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleSendMessage()
                            }
                        }}
                        rows={2}
                        className="resize-none"
                    />
                    <Button onClick={handleSendMessage} disabled={sending || !messageContent.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

