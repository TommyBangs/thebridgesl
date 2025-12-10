"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, TrendingUp, Sparkles, Briefcase } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/shared/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDebounce } from "@/hooks/use-debounce"
import { toast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/shared/loading-spinner"

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [loading, setLoading] = useState({ opportunities: false, skills: false })
  const router = useRouter()
  const debouncedSearch = useDebounce(searchQuery, 500)

  useEffect(() => {
    fetchOpportunities()
    fetchSkills()
  }, [])

  useEffect(() => {
    if (debouncedSearch) {
      handleSearch()
    } else {
      fetchOpportunities()
      fetchSkills()
    }
  }, [debouncedSearch])

  const fetchOpportunities = async () => {
    try {
      setLoading((prev) => ({ ...prev, opportunities: true }))
      const response = await fetch("/api/opportunities?limit=6")
      if (!response.ok) throw new Error("Failed to fetch opportunities")
      const data = await response.json()
      setOpportunities(data.opportunities || [])
    } catch (error) {
      console.error("Error fetching opportunities:", error)
      toast({
        title: "Error",
        description: "Failed to load opportunities",
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, opportunities: false }))
    }
  }

  const fetchSkills = async () => {
    try {
      setLoading((prev) => ({ ...prev, skills: true }))
      const response = await fetch("/api/skills?trending=true")
      if (!response.ok) throw new Error("Failed to fetch skills")
      const data = await response.json()
      setSkills(data.skills || [])
    } catch (error) {
      console.error("Error fetching skills:", error)
      toast({
        title: "Error",
        description: "Failed to load skills",
        variant: "destructive",
      })
    } finally {
      setLoading((prev) => ({ ...prev, skills: false }))
    }
  }

  const handleSearch = async () => {
    if (!debouncedSearch || debouncedSearch.length < 2) return

    try {
      setLoading({ opportunities: true, skills: true })
      const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedSearch)}`)
      if (!response.ok) throw new Error("Search failed")
      const data = await response.json()
      setOpportunities(data.opportunities || [])
      setSkills(data.skills || [])
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Error",
        description: "Search failed",
        variant: "destructive",
      })
    } finally {
      setLoading({ opportunities: false, skills: false })
    }
  }

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
        <Button onClick={handleSearch}>
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
          {loading.opportunities ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : opportunities.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No opportunities found</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((job) => (
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
                        {job.matchScore && <Badge variant="secondary">{job.matchScore}% match</Badge>}
                      </div>
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>{job.location}</p>
                        <p className="capitalize">{job.type}</p>
                        {job.salaryMin && job.salaryMax && (
                          <p className="font-medium text-success">
                            Le {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <Button className="w-full" size="sm">
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="skills" className="mt-6 space-y-4">
          {loading.skills ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : skills.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No skills found</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => (
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
                        {skill.trending?.growthRate && (
                          <Badge variant="outline" className="text-success">
                            +{skill.trending.growthRate}%
                          </Badge>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{skill.name}</h3>
                        {skill.trending?.demandPercentage && (
                          <p className="text-sm text-muted-foreground">{skill.trending.demandPercentage}% market demand</p>
                        )}
                      </div>
                      {skill.trending?.openPositions && (
                        <p className="text-sm text-muted-foreground">
                          {skill.trending.openPositions.toLocaleString()} open positions
                        </p>
                      )}
                      <Button className="w-full bg-transparent" variant="outline" size="sm">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
