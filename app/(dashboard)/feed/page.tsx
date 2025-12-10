"use client"

import { useState, useEffect } from "react"
import { Briefcase, TrendingUp, Users, Sparkles, Award, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/shared/page-header"
import { formatDistanceToNow } from "date-fns"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { toast } from "@/hooks/use-toast"

const iconMap: Record<string, any> = {
    opportunity: Briefcase,
    "skill-trending": TrendingUp,
    "network-activity": Users,
    insight: Sparkles,
    recommendation: Target,
    achievement: Award,
}

export default function FeedPage() {
    const [feedItems, setFeedItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFeed()
    }, [])

    const fetchFeed = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/feed")
            if (!response.ok) throw new Error("Failed to fetch feed")
            const data = await response.json()
            setFeedItems(data.feedItems || [])
        } catch (error) {
            console.error("Error fetching feed:", error)
            toast({
                title: "Error",
                description: "Failed to load feed",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader title="Activity Feed" description="Stay updated with personalized recommendations" />
                <div className="flex items-center justify-center min-h-[400px]">
                    <LoadingSpinner />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <PageHeader title="Activity Feed" description="Stay updated with personalized recommendations" />

            {feedItems.length === 0 ? (
                <Card className="p-12 text-center">
                    <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No feed items yet</h3>
                    <p className="text-sm text-muted-foreground">Your personalized feed will appear here</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {feedItems.map((item) => {
                        const Icon = iconMap[item.type] || Sparkles

                        return (
                            <Card key={item.id} className="transition-all hover:shadow-md">
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-start justify-between">
                                                <h3 className="font-semibold">{item.title}</h3>
                                                <Badge variant={item.priority === "high" ? "default" : "secondary"} className="text-xs">
                                                    {item.priority}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                            {item.image && (
                                                <img src={item.image} alt={item.title} className="rounded-lg mt-2 max-w-md" />
                                            )}
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                                            </p>
                                        </div>
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

