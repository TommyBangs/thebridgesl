"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, TrendingUp, Briefcase, BookOpen, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatCurrency, formatNumber } from "@/lib/format"
import type { Skill } from "@/types"

interface SkillDetailClientProps {
  skill: Skill & {
    description: string
    learningPath: string[]
    relatedCourses: { title: string; provider: string; duration: string }[]
    careerOpportunities: string[]
  }
}

export function SkillDetailClient({ skill }: SkillDetailClientProps) {
  const router = useRouter()

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{skill.name}</h1>
            {skill.verified && <Badge variant="secondary">Verified Skill</Badge>}
          </div>
          <p className="text-muted-foreground capitalize">{skill.category.replace("-", " ")}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>About This Skill</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{skill.description}</p>
            </CardContent>
          </Card>

          {/* Learning Path */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Learning Path
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {skill.learningPath.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {i + 1}
                    </div>
                    <p className="pt-1 text-muted-foreground">{step}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Related Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Recommended Courses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skill.relatedCourses.map((course, i) => (
                <div key={i} className="flex items-start justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">{course.provider}</p>
                    <p className="text-xs text-muted-foreground">Duration: {course.duration}</p>
                  </div>
                  <Button size="sm">Enroll</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Career Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Career Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {skill.careerOpportunities.map((role, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg border p-3">
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-success" />
                    <span className="text-sm font-medium">{role}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Market Stats */}
          {skill.trending && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Demand</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Demand Level</span>
                    <span className="font-semibold">{skill.trending.demandPercentage}%</span>
                  </div>
                  <Progress value={skill.trending.demandPercentage} className="h-2" />
                </div>

                <div className="flex items-center justify-between rounded-lg bg-success/10 p-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Growth Rate</span>
                  </div>
                  <span className="font-semibold text-success">+{skill.trending.growthRate}%</span>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Salary</span>
                    <span className="font-semibold">{formatCurrency(skill.trending.averageSalary)} / month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Open Positions</span>
                    <span className="font-semibold">{formatNumber(skill.trending.openPositions)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Skill Level */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skill Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Difficulty Level</p>
                <Badge variant="secondary" className="capitalize">
                  {skill.level}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Category</p>
                <p className="font-medium capitalize">{skill.category.replace("-", " ")}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Endorsements</p>
                <p className="font-medium">{skill.endorsements} professionals</p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6 space-y-3">
              <h3 className="font-semibold">Start Learning Today</h3>
              <p className="text-sm opacity-90">
                Join thousands of learners mastering {skill.name} and advancing their careers.
              </p>
              <Button className="w-full bg-background text-foreground hover:bg-background/90">Get Started</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
