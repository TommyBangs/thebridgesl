"use client"

import { useState } from "react"
import { Target, BookOpen, DollarSign, ArrowRight, Sparkles, Loader2, TrendingUp, Briefcase } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/format"

interface PathwayStep {
  stage: number
  title: string
  description: string
  progress?: number
  status: "current" | "upcoming" | "future"
}

interface CareerRecommendation {
  title: string
  demand: number
  growth: string
  avgSalary: number
  openings: number
  matchScore: number
}

const careerRecommendations: CareerRecommendation[] = [
  { title: "AI/ML Engineer", demand: 95, growth: "+42%", avgSalary: 1450000000, openings: 8934, matchScore: 94 },
  { title: "Full Stack Developer", demand: 88, growth: "+28%", avgSalary: 1200000000, openings: 12453, matchScore: 89 },
  { title: "Data Scientist", demand: 92, growth: "+38%", avgSalary: 1350000000, openings: 7621, matchScore: 91 },
  { title: "Cloud Architect", demand: 85, growth: "+35%", avgSalary: 1550000000, openings: 5234, matchScore: 87 },
  { title: "DevOps Engineer", demand: 83, growth: "+30%", avgSalary: 1250000000, openings: 6789, matchScore: 85 },
  { title: "Product Manager", demand: 80, growth: "+25%", avgSalary: 1400000000, openings: 4521, matchScore: 82 },
]

export default function CareerClientPage() {
  const [careerGoal, setCareerGoal] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPathway, setGeneratedPathway] = useState<PathwayStep[] | null>(null)

  const handleGeneratePathway = async () => {
    if (!careerGoal.trim()) return

    setIsGenerating(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const pathway: PathwayStep[] = [
      {
        stage: 1,
        title: "Foundation",
        description: "Building core skills and knowledge base",
        progress: 100,
        status: "current",
      },
      {
        stage: 2,
        title: `Learn ${careerGoal} Essentials`,
        description: "Master fundamental concepts and tools",
        progress: 65,
        status: "current",
      },
      {
        stage: 3,
        title: `Build ${careerGoal} Experience`,
        description: "Real-world projects and practical application",
        progress: 0,
        status: "upcoming",
      },
      {
        stage: 4,
        title: `Advance ${careerGoal} Expertise`,
        description: "Specialization and professional networking",
        progress: 0,
        status: "future",
      },
      {
        stage: 5,
        title: `Master ${careerGoal}`,
        description: "Leadership and industry recognition",
        progress: 0,
        status: "future",
      },
    ]

    setGeneratedPathway(pathway)
    setIsGenerating(false)
  }

  // Only show pathway if user has generated one
  const displayPathway = generatedPathway || []

  return (
    <div className="space-y-8">
      <PageHeader title="Career Navigator" description="AI-powered insights to guide your professional journey" />

      {/* AI Career Path Generator */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-success/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Career Path Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter your career goal (e.g., Data Scientist, Product Manager, Full Stack Developer)"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGeneratePathway()}
                className="flex-1"
              />
              <Button onClick={handleGeneratePathway} disabled={isGenerating || !careerGoal.trim()}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Path
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Our AI will create a personalized roadmap to help you achieve your career goals
            </p>
          </div>
        </CardContent>
      </Card>

      {displayPathway.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Your Path to {careerGoal}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-0">
              {displayPathway.map((step, index) => (
              <div key={index} className="relative flex gap-6 pb-8 last:pb-0">
                {/* Stage Circle */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={`z-10 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold transition-all ${
                      step.status === "current"
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50"
                        : step.status === "upcoming"
                          ? "border-2 border-primary bg-background text-primary"
                          : "border-2 border-muted bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    {step.stage}
                  </div>
                  {/* Arrow connector */}
                  {index < displayPathway.length - 1 && (
                    <div className="absolute left-1/2 top-12 flex h-[calc(100%+2rem)] -translate-x-1/2 flex-col items-center">
                      <div className={`w-0.5 flex-1 ${step.status === "current" ? "bg-primary" : "bg-border"}`} />
                      <ArrowRight
                        className={`absolute bottom-0 h-6 w-6 rotate-90 ${
                          step.status === "current" ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div
                    className={`rounded-lg border p-4 transition-all ${
                      step.status === "current"
                        ? "border-primary/50 bg-primary/5"
                        : step.status === "upcoming"
                          ? "border-primary/30 bg-background"
                          : "border-muted bg-muted/20"
                    }`}
                  >
                    {step.status === "current" && step.stage === 1 && (
                      <Badge className="mb-2 bg-success">Current Stage</Badge>
                    )}
                    <h3 className="mb-1 text-lg font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    {step.progress !== undefined && step.progress > 0 && (
                      <div className="mt-3">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="font-medium">Progress</span>
                          <span className="text-muted-foreground">{step.progress}%</span>
                        </div>
                        <Progress value={step.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {displayPathway.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No Career Path Generated</h3>
            <p className="text-sm text-muted-foreground">
              Enter a career goal above and click "Generate Path" to create your personalized roadmap
            </p>
          </CardContent>
        </Card>
      )}
      {/* </CHANGE> */}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <TrendingUp className="h-5 w-5 text-success" />
            Trending Career Paths
          </h2>
          <p className="text-sm text-muted-foreground">Based on market demand and growth</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {careerRecommendations.map((career, i) => (
            <Card key={i} className="transition-all hover:border-primary/50 hover:shadow-md">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {career.matchScore}% match
                        </Badge>
                        <Badge variant="outline" className="text-xs font-normal text-success">
                          {career.growth}
                        </Badge>
                      </div>
                      <h3 className="mb-1 font-semibold">{career.title}</h3>
                    </div>
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Market Demand</span>
                      <span className="font-medium">{career.demand}%</span>
                    </div>
                    <Progress value={career.demand} className="h-1.5" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Avg. Salary</p>
                      <p className="font-semibold text-success">{formatCurrency(career.avgSalary)} / month</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Open Roles</p>
                      <p className="font-semibold">{career.openings.toLocaleString()}</p>
                    </div>
                  </div>

                  <Button size="sm" className="w-full bg-transparent" variant="outline">
                    Explore Path
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      {/* </CHANGE> */}

      {/* Skills Gap Analysis */}
      <section>
        <h2 className="mb-4 text-xl font-bold">Skills Gap Analysis</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Python</span>
                  <span className="text-sm text-muted-foreground">Intermediate → Advanced</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Machine Learning</span>
                  <span className="text-sm text-muted-foreground">Beginner → Intermediate</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">System Design</span>
                  <span className="text-sm text-muted-foreground">Beginner → Advanced</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Recommended Courses */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <BookOpen className="h-5 w-5 text-primary" />
            Recommended Learning
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Advanced Python Programming", provider: "Coursera", hours: 40, relevance: 95 },
            { title: "Machine Learning Fundamentals", provider: "edX", hours: 60, relevance: 92 },
            { title: "System Design Interviews", provider: "Udemy", hours: 20, relevance: 88 },
          ].map((course, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {course.relevance}% match
                    </Badge>
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.provider}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{course.hours} hours</p>
                  <Button size="sm" className="w-full">
                    Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Salary Projections */}
      <section>
        <h2 className="mb-4 text-xl font-bold">Salary Projections</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-success" />
              Expected Earnings Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Current (Intern)</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(300000000)} / month</p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Target (Junior Dev)</p>
                <p className="text-2xl font-bold text-success">{formatCurrency(850000000)} / month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
