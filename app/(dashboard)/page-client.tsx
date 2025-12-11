"use client"

import { useState } from "react"
import Link from "next/link"
import { QuickActionCard } from "@/components/dashboard/quick-action-card"
import { TrendingSkillCard } from "@/components/dashboard/trending-skill-card"
import { OpportunityCard } from "@/components/dashboard/opportunity-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, TrendingUp, BookOpen, ArrowRight, ExternalLink, Briefcase } from "lucide-react"
import { AddProjectDialog } from "@/components/dialogs/add-project-dialog"
import { VerifySkillDialog } from "@/components/dialogs/verify-skill-dialog"
import { useApi } from "@/lib/hooks/use-api"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { EmptyState } from "@/components/shared/empty-state"
import type { Skill, Opportunity } from "@/types"
import Link from "next/link"

export default function HomePageClient() {
  const [addProjectOpen, setAddProjectOpen] = useState(false)
  const [verifySkillOpen, setVerifySkillOpen] = useState(false)

  const { data: profileData, loading: profileLoading } = useApi<{ user: any }>("/users/profile")
  const { data: skillsData, loading: skillsLoading } = useApi<{ skills: Skill[] }>("/skills?trending=true")
  const { data: opportunitiesData, loading: opportunitiesLoading } = useApi<{ opportunities: Opportunity[] }>("/opportunities?limit=5")

  const user = profileData?.user
  const trendingSkills = skillsData?.skills || []
  const opportunities = opportunitiesData?.opportunities || []

  const profileCompletion = (() => {
    if (!user) return { percent: 0, checklist: [] as { label: string; done: boolean }[] }
    const checklist = [
      { label: "Add a profile photo", done: !!user.avatar },
      { label: "Write a bio", done: !!user.learnerProfile?.bio },
      { label: "Set your location", done: !!user.learnerProfile?.location },
      {
        label: "Add education or current role",
        done: !!user.learnerProfile?.university || !!user.learnerProfile?.currentJobTitle,
      },
      { label: "Add a project", done: (user.projects?.length || 0) > 0 },
      { label: "Add at least one skill", done: (user.userSkills?.length || 0) > 0 },
    ]
    const doneCount = checklist.filter((c) => c.done).length
    const percent = Math.round((doneCount / checklist.length) * 100)
    return { percent, checklist }
  })()

  if (profileLoading || skillsLoading || opportunitiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  const skillsMatchPercentage = user?.learnerProfile?.skillsMatchPercentage || 0

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="animate-in slide-in-from-bottom-4 duration-500">
        <h2 className="mb-4 text-xl font-bold">Quick Actions</h2>
        <div className="grid gap-2 grid-cols-2 sm:gap-3 lg:gap-4 lg:grid-cols-4">
          <QuickActionCard
            icon="folder-plus"
            title="Add Project"
            description="Showcase your latest work"
            onClick={() => setAddProjectOpen(true)}
          />
          <QuickActionCard
            icon="check-circle"
            title="Verify Skill"
            description="Get your skills validated"
            variant="primary"
            onClick={() => setVerifySkillOpen(true)}
          />
          <QuickActionCard
            icon="compass"
            title="Career Checkup"
            description="Explore your career path"
            href="/career"
          />
          <QuickActionCard icon="award" title="Credentials" description="View your certificates" href="/profile" />
        </div>
      </section>

      <section>
        <Card className="border-muted">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Profile completeness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Complete your profile to improve matches</div>
              <span className="text-sm font-semibold">{profileCompletion.percent}%</span>
            </div>
            <Progress value={profileCompletion.percent} />
            <div className="space-y-2">
              {profileCompletion.checklist.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  <span
                    className={`h-2 w-2 rounded-full ${item.done ? "bg-green-500" : "bg-muted-foreground/40"}`}
                    aria-hidden
                  />
                  <span className={item.done ? "line-through text-muted-foreground" : ""}>{item.label}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/profile">Edit profile</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/onboarding">Onboarding</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="border-primary bg-primary/5">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Your Skills Match</p>
              <p className="text-4xl font-bold text-primary">{skillsMatchPercentage}%</p>
              <p className="text-sm text-muted-foreground">Above industry average</p>
            </div>
            <div className="rounded-full bg-primary/10 p-4">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Trending Skills</h2>
                <Badge variant="secondary" className="bg-success/10 text-success">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  Live
                </Badge>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/discover">View all</Link>
              </Button>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">Real-time skill demand data powered by market analysis</p>
            {trendingSkills.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {trendingSkills.slice(0, 6).map((skill) => (
                  <TrendingSkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            ) : (
              <EmptyState title="No trending skills" description="Check back later for trending skills data" />
            )}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Opportunity Board</h2>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  AI Ranked
                </Badge>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/discover">View all</Link>
              </Button>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Curated opportunities matched to your profile with AI-powered ranking
            </p>
            {opportunities.length > 0 ? (
              <div className="space-y-4">
                {opportunities.map((opportunity) => (
                  <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                ))}
              </div>
            ) : (
              <EmptyState title="No opportunities" description="Check back later for new opportunities" />
            )}
          </section>

          {/* Industry Insights and Learning Resources sections remain the same */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <TrendingUp className="h-5 w-5 text-info" />
                Industry Insights
              </h2>
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">Latest sector analysis and career trend reports</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-info/20 bg-gradient-to-br from-info/5 to-info/10">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <Badge variant="secondary" className="bg-info/20 text-info">
                      Tech Sector
                    </Badge>
                    <span className="text-xs text-muted-foreground">Q4 2025</span>
                  </div>
                  <h3 className="mb-2 font-semibold">AI Engineering Boom</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    AI engineering roles up 156% YoY with $145K avg salary
                  </p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Read Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-success/20 bg-gradient-to-br from-success/5 to-success/10">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <Badge variant="secondary" className="bg-success/20 text-success">
                      Cloud Computing
                    </Badge>
                    <span className="text-xs text-muted-foreground">Q4 2025</span>
                  </div>
                  <h3 className="mb-2 font-semibold">Cloud Skills in Demand</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    AWS, Azure, GCP certifications driving 89% hiring preference
                  </p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Read Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Hot Skills Now
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">AI/ML</span>
                  <span className="text-sm font-bold text-success">38% ↑</span>
                </div>
                <Progress value={38} className="h-2" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Cloud Computing</span>
                  <span className="text-sm font-bold text-success">32% ↑</span>
                </div>
                <Progress value={32} className="h-2" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">React/Next.js</span>
                  <span className="text-sm font-bold text-success">28% ↑</span>
                </div>
                <Progress value={28} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddProjectDialog open={addProjectOpen} onOpenChange={setAddProjectOpen} />
      <VerifySkillDialog open={verifySkillOpen} onOpenChange={setVerifySkillOpen} />
    </div>
  )
}

