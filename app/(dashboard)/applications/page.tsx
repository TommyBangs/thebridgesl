"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Briefcase, Clock, CheckCircle, XCircle, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/shared/page-header"
import { formatDistanceToNow } from "date-fns"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const statusConfig: Record<string, { label: string; icon: any; variant: any }> = {
    applied: { label: "Applied", icon: Clock, variant: "secondary" },
    viewed: { label: "Viewed", icon: Eye, variant: "default" },
    shortlisted: { label: "Shortlisted", icon: CheckCircle, variant: "default" },
    rejected: { label: "Rejected", icon: XCircle, variant: "destructive" },
    accepted: { label: "Accepted", icon: CheckCircle, variant: "default" },
}

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>("all")
    const router = useRouter()

    useEffect(() => {
        fetchApplications()
    }, [])

    const fetchApplications = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/applications")
            if (!response.ok) throw new Error("Failed to fetch applications")
            const data = await response.json()
            setApplications(data.applications || [])
        } catch (error) {
            console.error("Error fetching applications:", error)
            toast({
                title: "Error",
                description: "Failed to load applications",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const filteredApplications =
        filter === "all" ? applications : applications.filter((app) => app.status.toLowerCase() === filter)

    const statusCounts = applications.reduce(
        (acc, app) => {
            const status = app.status.toLowerCase()
            acc[status] = (acc[status] || 0) + 1
            return acc
        },
        { all: applications.length } as Record<string, number>
    )

    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader title="My Applications" description="Track your job applications" />
                <div className="flex items-center justify-center min-h-[400px]">
                    <LoadingSpinner />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <PageHeader title="My Applications" description="Track your job applications" />

            <Tabs value={filter} onValueChange={setFilter} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
                    <TabsTrigger value="applied">Applied ({statusCounts.applied || 0})</TabsTrigger>
                    <TabsTrigger value="viewed">Viewed ({statusCounts.viewed || 0})</TabsTrigger>
                    <TabsTrigger value="shortlisted">Shortlisted ({statusCounts.shortlisted || 0})</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected ({statusCounts.rejected || 0})</TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="mt-6">
                    {filteredApplications.length === 0 ? (
                        <Card className="p-12 text-center">
                            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No applications found</h3>
                            <p className="text-sm text-muted-foreground">
                                {filter === "all"
                                    ? "You haven't applied to any jobs yet"
                                    : `You don't have any ${filter} applications`}
                            </p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredApplications.map((application) => {
                                const statusInfo = statusConfig[application.status.toLowerCase()] || statusConfig.applied
                                const StatusIcon = statusInfo.icon

                                return (
                                    <Card
                                        key={application.id}
                                        className="cursor-pointer hover:border-primary transition-colors"
                                        onClick={() => router.push(`/jobs/${application.opportunity.id}`)}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold">{application.opportunity.title}</h3>
                                                        <Badge variant={statusInfo.variant}>
                                                            <StatusIcon className="h-3 w-3 mr-1" />
                                                            {statusInfo.label}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-2">{application.opportunity.company}</p>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span>{application.opportunity.location}</span>
                                                        <span>•</span>
                                                        <span>Applied {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

