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
import { MOCK_TRENDING_SKILLS, MOCK_OPPORTUNITIES } from "@/lib/mock-data"
import { AddProjectDialog } from "@/components/dialogs/add-project-dialog"
import { VerifySkillDialog } from "@/components/dialogs/verify-skill-dialog"

export default function HomePage() {
  const [addProjectOpen, setAddProjectOpen] = useState(false)
  const [verifySkillOpen, setVerifySkillOpen] = useState(false)

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
        <Card className="border-primary bg-primary/5">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Your Skills Match</p>
              <p className="text-4xl font-bold text-primary">83%</p>
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
            <div className="grid gap-4 sm:grid-cols-2">
              {MOCK_TRENDING_SKILLS.slice(0, 6).map((skill) => (
                <TrendingSkillCard key={skill.id} skill={skill} />
              ))}
            </div>
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
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Curated opportunities matched to your profile with AI-powered ranking
            </p>
            <div className="space-y-4">
              {MOCK_OPPORTUNITIES.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          </section>

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

              <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <Badge variant="secondary" className="bg-accent/20 text-accent">
                      Web Development
                    </Badge>
                    <span className="text-xs text-muted-foreground">Q4 2025</span>
                  </div>
                  <h3 className="mb-2 font-semibold">React & Next.js Growth</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    Full-stack positions requiring modern frameworks up 72%
                  </p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Read Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      Cybersecurity
                    </Badge>
                    <span className="text-xs text-muted-foreground">Q4 2025</span>
                  </div>
                  <h3 className="mb-2 font-semibold">Security Skills Gap</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    Critical shortage with 3.5M open positions globally
                  </p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Read Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <BookOpen className="h-5 w-5 text-accent" />
                Learning Resources
              </h2>
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Curated courses from top providers matched to your career goals
            </p>
            <div className="space-y-3">
              <Card className="transition-all hover:border-primary hover:shadow-md">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
                    <BookOpen className="h-6 w-6 text-info" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="font-semibold">Machine Learning Specialization</h3>
                      <Badge variant="secondary" className="bg-info/10 text-info">
                        Coursera
                      </Badge>
                    </div>
                    <p className="mb-2 text-sm text-muted-foreground">Complete ML fundamentals by Andrew Ng</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>4.9★ (128K reviews)</span>
                      <span>•</span>
                      <span>Beginner level</span>
                      <span>•</span>
                      <span>3 months</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all hover:border-primary hover:shadow-md">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                    <BookOpen className="h-6 w-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="font-semibold">AWS Solutions Architect</h3>
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        Udemy
                      </Badge>
                    </div>
                    <p className="mb-2 text-sm text-muted-foreground">Complete AWS certification prep course</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>4.7★ (95K reviews)</span>
                      <span>•</span>
                      <span>Intermediate</span>
                      <span>•</span>
                      <span>2 months</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all hover:border-primary hover:shadow-md">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <BookOpen className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="font-semibold">Advanced React Patterns</h3>
                      <Badge variant="secondary" className="bg-accent/10 text-accent">
                        Frontend Masters
                      </Badge>
                    </div>
                    <p className="mb-2 text-sm text-muted-foreground">Master advanced React concepts and patterns</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>4.8★ (12K reviews)</span>
                      <span>•</span>
                      <span>Advanced</span>
                      <span>•</span>
                      <span>6 weeks</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all hover:border-primary hover:shadow-md">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="font-semibold">Python for Data Science</h3>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        edX
                      </Badge>
                    </div>
                    <p className="mb-2 text-sm text-muted-foreground">Data analysis and visualization with Python</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>4.6★ (45K reviews)</span>
                      <span>•</span>
                      <span>Beginner</span>
                      <span>•</span>
                      <span>10 weeks</span>
                    </div>
                  </div>
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

          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Market Pulse
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="group cursor-pointer rounded-lg border border-border bg-background/50 p-4 transition-all hover:border-primary hover:bg-primary/5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                    <ArrowRight className="h-5 w-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Trending Credentials</p>
                    <p className="text-sm text-muted-foreground">AWS certifications up 45%</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 w-full rounded-full bg-muted">
                        <div className="h-1.5 rounded-full bg-success" style={{ width: "45%" }} />
                      </div>
                      <span className="text-xs font-semibold text-success">↑45%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer rounded-lg border border-border bg-background/50 p-4 transition-all hover:border-primary hover:bg-primary/5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info/10">
                    <Briefcase className="h-5 w-5 text-info" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Local Opportunities</p>
                    <p className="text-sm text-muted-foreground">156 new jobs this week</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Tech, Marketing, Design</span>
                      <span className="text-xs font-semibold text-info">View →</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer rounded-lg border border-border bg-background/50 p-4 transition-all hover:border-primary hover:bg-primary/5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <ExternalLink className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Who's Hiring</p>
                    <p className="text-sm text-muted-foreground">Top companies recruiting now</p>
                    <div className="mt-2 flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-6 w-6 rounded-full border-2 border-background bg-muted" />
                      ))}
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-primary text-[10px] font-semibold text-primary-foreground">
                        +12
                      </div>
                    </div>
                  </div>
                </div>
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
