"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Briefcase, Clock, DollarSign, Share2, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SkillBadge } from "@/components/shared/skill-badge"
import { ApplyJobDialog } from "@/components/dialogs/apply-job-dialog"
import { formatCurrency, formatRelativeTime } from "@/lib/format"
import type { Opportunity } from "@/types"

interface JobDetailClientProps {
  job: Opportunity
}

export function JobDetailClient({ job }: JobDetailClientProps) {
  const router = useRouter()
  const [applyDialogOpen, setApplyDialogOpen] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <p className="text-muted-foreground">{job.company}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Job Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={job.companyLogo || "/placeholder.svg"} alt={job.company} />
                      <AvatarFallback>{job.company[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{job.title}</CardTitle>
                      <p className="text-muted-foreground">{job.company}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-success">
                    {job.matchScore}% match
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{job.remote ? "Remote" : job.location}</span>
                  </div>
                  {job.salary && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {formatCurrency(job.salary.min)} - {formatCurrency(job.salary.max)} / month
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Posted {formatRelativeTime(job.postedDate)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Job Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold">Requirements</h3>
                  <ul className="space-y-2">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <SkillBadge key={skill} name={skill} size="md" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button className="w-full" size="lg" onClick={() => setApplyDialogOpen(true)}>
                  Apply Now
                </Button>
                <Button
                  className="w-full bg-transparent"
                  variant="outline"
                  size="lg"
                  onClick={() => setBookmarked(!bookmarked)}
                >
                  <Bookmark className={`mr-2 h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
                  {bookmarked ? "Saved" : "Save Job"}
                </Button>
                <Button className="w-full bg-transparent" variant="outline" size="lg">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Location</p>
                  <p className="font-medium">{job.remote ? "Remote" : job.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Job Type</p>
                  <p className="font-medium capitalize">{job.type}</p>
                </div>
                {job.salary && (
                  <div>
                    <p className="text-muted-foreground mb-1">Salary Range</p>
                    <p className="font-medium">
                      {formatCurrency(job.salary.min)} - {formatCurrency(job.salary.max)} / month
                    </p>
                  </div>
                )}
                {job.deadline && (
                  <div>
                    <p className="text-muted-foreground mb-1">Application Deadline</p>
                    <p className="font-medium">{job.deadline.toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground mb-1">Posted</p>
                  <p className="font-medium">{formatRelativeTime(job.postedDate)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ApplyJobDialog
        open={applyDialogOpen}
        onOpenChange={setApplyDialogOpen}
        jobTitle={job.title}
        company={job.company}
      />
    </>
  )
}
