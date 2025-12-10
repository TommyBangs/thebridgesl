"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Briefcase, Clock } from "lucide-react"
import { formatRelativeTime, formatCurrency } from "@/lib/format"
import { SkillBadge } from "@/components/shared/skill-badge"
import { ApplyJobDialog } from "@/components/dialogs/apply-job-dialog"
import type { Opportunity } from "@/types"

interface OpportunityCardProps {
  opportunity: Opportunity
  onApply?: () => void
}

export function OpportunityCard({ opportunity, onApply }: OpportunityCardProps) {
  const [applyDialogOpen, setApplyDialogOpen] = useState(false)
  const router = useRouter()
  const { title, company, companyLogo, type, location, remote, skills, matchScore, salary, postedDate } = opportunity

  const handleCardClick = () => {
    router.push(`/jobs/${opportunity.id}`)
  }

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click when clicking apply button
    if (onApply) {
      onApply()
    }
    setApplyDialogOpen(true)
  }

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={handleCardClick}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={companyLogo || "/placeholder.svg"} alt={company} />
              <AvatarFallback>{company[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-tight">{title}</h3>
                  <Badge variant="secondary" className="text-success">
                    {matchScore}% match
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{company}</p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  <span className="capitalize">{type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{remote ? "Remote" : location}</span>
                </div>
                {salary && (
                  <div className="font-medium text-foreground">
                    {formatCurrency(salary.min)} - {formatCurrency(salary.max)} / month
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatRelativeTime(postedDate)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 4).map((skill) => (
                  <SkillBadge key={skill} name={skill} size="sm" variant="outline" />
                ))}
                {skills.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{skills.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t border-border bg-muted/30 p-4">
          <Button onClick={handleApply} className="w-full" size="sm">
            Apply Now
          </Button>
        </CardFooter>
      </Card>

      <ApplyJobDialog 
        open={applyDialogOpen} 
        onOpenChange={setApplyDialogOpen} 
        jobTitle={title} 
        company={company}
        opportunityId={opportunity.id}
      />
    </>
  )
}
