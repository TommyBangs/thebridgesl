"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, TrendingUp, Sparkles, Briefcase } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/shared/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const mockAllJobs = [
  {
    id: "1",
    title: "Junior Software Engineer",
    company: "Tech Innovations SL",
    location: "Freetown, Sierra Leone",
    type: "Full-time",
    salary: "Le 800M - 1.2B",
    match: 92,
  },
  {
    id: "2",
    title: "Data Analyst Intern",
    company: "Digital Solutions",
    location: "Remote",
    type: "Internship",
    salary: "Le 250K - 400K",
    match: 87,
  },
  {
    id: "3",
    title: "Frontend Developer",
    company: "Web Dynamics",
    location: "Freetown, Sierra Leone",
    type: "Contract",
    salary: "Le 1M - 1.5B",
    match: 89,
  },
]

const mockAllSkills = [
  { id: "1", name: "Machine Learning", demand: 95, growth: "+42%", openings: 8934 },
  { id: "2", name: "React & Next.js", demand: 88, growth: "+28%", openings: 12453 },
  { id: "3", name: "Cloud Architecture", demand: 85, growth: "+35%", openings: 5234 },
  { id: "4", name: "Data Science", demand: 92, growth: "+38%", openings: 7621 },
  { id: "5", name: "Cybersecurity", demand: 80, growth: "+30%", openings: 4521 },
  { id: "6", name: "Mobile Development", demand: 78, growth: "+25%", openings: 6789 },
]

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleJobClick = (id: string) => {
    router.push(`/jobs/${id}`)
  }

  const handleSkillClick = (id: string) => {
    router.push(`/skills/${id}`)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Discover"
        description="Explore opportunities, trending skills, and industry insights tailored to your career goals"
      />

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for opportunities, skills, or insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="opportunities" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="skills">Trending Skills</TabsTrigger>
          <TabsTrigger value="insights">Industry Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockAllJobs.slice(0, 6).map((job) => (
              <Card
                key={job.id}
                className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
                onClick={() => handleJobClick(job.id)}
              >
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-shrink-0 rounded-full bg-primary/10 p-3">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="secondary">{job.match}% match</Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>{job.location}</p>
                      <p>{job.type}</p>
                      <p className="font-medium text-success">{job.salary}</p>
                    </div>
                    <Button className="w-full" size="sm">
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="skills" className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockAllSkills.map((skill) => (
              <Card
                key={skill.id}
                className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
                onClick={() => handleSkillClick(skill.id)}
              >
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-shrink-0 rounded-full bg-success/10 p-3">
                        <TrendingUp className="h-5 w-5 text-success" />
                      </div>
                      <Badge variant="outline" className="text-success">
                        {skill.growth}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold">{skill.name}</h3>
                      <p className="text-sm text-muted-foreground">{skill.demand}% market demand</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{skill.openings.toLocaleString()} open positions</p>
                    <Button className="w-full bg-transparent" variant="outline" size="sm">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "AI Revolution in Tech",
                category: "Technology",
                readTime: "5 min read",
                description: "How artificial intelligence is transforming the job market in 2025",
              },
              {
                title: "Remote Work Trends",
                category: "Career",
                readTime: "4 min read",
                description: "The future of remote work and its impact on hiring practices",
              },
              {
                title: "Skill Gap Analysis 2025",
                category: "Education",
                readTime: "6 min read",
                description: "Understanding the most in-demand skills and how to acquire them",
              },
              {
                title: "Tech Salary Guide",
                category: "Compensation",
                readTime: "8 min read",
                description: "Comprehensive salary benchmarks across different tech roles",
              },
            ].map((insight, i) => (
              <Card key={i} className="transition-all hover:border-primary hover:shadow-md">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-shrink-0 rounded-full bg-info/10 p-3">
                        <Sparkles className="h-5 w-5 text-info" />
                      </div>
                      <Badge variant="secondary">{insight.category}</Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{insight.readTime}</span>
                      <Button variant="ghost" size="sm">
                        Read Article
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
