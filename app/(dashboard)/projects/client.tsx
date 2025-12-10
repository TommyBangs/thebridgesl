"use client"

import { Plus, Filter, Github, ExternalLink, Search, X, Link as LinkIcon, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useApi } from "@/lib/hooks/use-api"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { EmptyState } from "@/components/shared/empty-state"
import { formatDate } from "@/lib/format"
import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AddProjectDialog } from "@/components/dialogs/add-project-dialog"
import { VerifySkillDialog } from "@/components/dialogs/verify-skill-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const PROJECT_CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "software", label: "Software" },
  { value: "design-creative", label: "Design/Creative" },
  { value: "business", label: "Business/Entrepreneurship" },
  { value: "research", label: "Research/Academic" },
  { value: "trades", label: "Trades/Crafts" },
  { value: "nonprofit", label: "Non-profit/Community" },
  { value: "education", label: "Education/Training" },
  { value: "health", label: "Health/Wellness" },
  { value: "media", label: "Media/Content" },
  { value: "product", label: "Product/Hardware" },
] as const

const getCategoryLabel = (category: string) => {
  const cat = PROJECT_CATEGORIES.find((c) => c.value === category)
  return cat?.label || category
}

const formatImpactSnippet = (impactMetrics: any) => {
  if (!impactMetrics || typeof impactMetrics !== "object") return null

  const parts: string[] = []
  if (impactMetrics.audience) parts.push(`Reached ${impactMetrics.audience.toLocaleString()} people`)
  if (impactMetrics.revenue) {
    const currency = impactMetrics.currency || "USD"
    parts.push(`${currency} ${impactMetrics.revenue.toLocaleString()}`)
  }
  if (impactMetrics.satisfaction) parts.push(`${impactMetrics.satisfaction}/5 rating`)
  if (impactMetrics.notes) parts.push(impactMetrics.notes)

  return parts.length > 0 ? parts[0] : null
}

export function AppProjectsPageClient() {
  const router = useRouter()
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)
  const [isVerifySkillOpen, setIsVerifySkillOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [hasImpactFilter, setHasImpactFilter] = useState(false)
  const [hasMediaFilter, setHasMediaFilter] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { data: projectsData, loading, error, refetch } = useApi<{ projects: any[] }>("/projects")

  const projects = projectsData?.projects || []

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleAddProject = () => {
    if (isMobile) {
      router.push("/projects/new")
    } else {
      setIsAddProjectOpen(true)
    }
  }

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          project.title?.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query) ||
          project.category?.toLowerCase().includes(query) ||
          project.tags?.some((tag: string) => tag.toLowerCase().includes(query))
        if (!matchesSearch) return false
      }

      // Category filter
      if (selectedCategory !== "all" && project.category !== selectedCategory) {
        return false
      }

      // Impact filter
      if (hasImpactFilter && (!project.impactMetrics || Object.keys(project.impactMetrics || {}).length === 0)) {
        return false
      }

      // Media filter
      if (hasMediaFilter && (!project.media || project.media.length === 0)) {
        return false
      }

      return true
    })
  }, [projects, searchQuery, selectedCategory, hasImpactFilter, hasMediaFilter])

  const handleShare = (project: any) => {
    setSelectedProject(project)
    setIsShareOpen(true)
  }

  const handleEdit = (project: any) => {
    setSelectedProject(project)
    setIsAddProjectOpen(true)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Projects & Skills"
        description="Share your work—software, design, research, events, services, products, builds, community projects."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button onClick={handleAddProject}>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </div>
        }
      />

      {/* Search and Quick Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects by title, description, category, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROJECT_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <EmptyState
          title="Error loading projects"
          description={error instanceof Error ? error.message : "Unable to load projects. Please try again."}
        />
      )}

      {!loading && !error && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Projects</h2>
            <p className="text-sm text-muted-foreground">
              {filteredProjects.length} of {projects.length} project{projects.length !== 1 ? 's' : ''}
            </p>
          </div>
          {projects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              description="Share any project—films, apps, reports, events, products, courses, builds."
              action={{
                label: "Add Project",
                onClick: () => setIsAddProjectOpen(true)
              }}
            />
          ) : filteredProjects.length === 0 ? (
            <EmptyState
              title="No projects match your filters"
              description="Try adjusting your search or filter criteria"
              action={{
                label: "Clear Filters",
                onClick: () => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setHasImpactFilter(false)
                  setHasMediaFilter(false)
                }
              }}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                  {project.media && project.media[0] && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={project.media[0].url || "/placeholder.svg"}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-balance leading-tight">{project.title}</h3>
                          <div className="flex gap-1 shrink-0">
                            {project.verified && (
                              <Badge variant="default" className="bg-primary">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                        {project.category && (
                          <Badge variant="secondary" className="mb-2 text-xs">
                            {getCategoryLabel(project.category)}
                          </Badge>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                      </div>

                      {/* Impact Snippet */}
                      {project.impactMetrics && formatImpactSnippet(project.impactMetrics) && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <span className="line-clamp-1">{formatImpactSnippet(project.impactMetrics)}</span>
                        </div>
                      )}

                      {/* Evidence/Media Count */}
                      {(project.evidenceLinks?.length > 0 || project.media?.length > 0) && (
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {project.evidenceLinks?.length > 0 && (
                            <div className="flex items-center gap-1">
                              <LinkIcon className="h-3 w-3" />
                              <span>{project.evidenceLinks.length} evidence link{project.evidenceLinks.length !== 1 ? 's' : ''}</span>
                            </div>
                          )}
                          {project.media?.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span>{project.media.length} attachment{project.media.length !== 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {project.projectSkills && project.projectSkills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.projectSkills.slice(0, 4).map((ps: any) => (
                            <Badge key={ps.skill.id} variant="secondary" className="text-xs">
                              {ps.skill.name}
                            </Badge>
                          ))}
                          {project.projectSkills.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.projectSkills.length - 4}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : "Present"}
                        </span>
                        {project.collaborators && project.collaborators.length > 0 && (
                          <span>
                            {project.collaborators.length} collaborator{project.collaborators.length > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>

                      {(project.githubUrl || project.liveUrl) && (
                        <div className="flex gap-2 mt-2">
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Badge variant="outline" className="gap-1">
                                <Github className="h-3 w-3" />
                                Code
                              </Badge>
                            </a>
                          )}
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                              <Badge variant="outline" className="gap-1">
                                <ExternalLink className="h-3 w-3" />
                                Live
                              </Badge>
                            </a>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => handleEdit(project)}
                        >
                          Edit
                        </Button>
                        <Button size="sm" className="flex-1" onClick={() => handleShare(project)}>
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Skill Validation CTA */}
      <Card className="border-primary bg-primary/5">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold">Need Skill Validation?</h3>
            <p className="text-sm text-muted-foreground">
              Connect with mentors or complete coding challenges to get your skills verified
            </p>
          </div>
          <Button className="shrink-0" onClick={() => setIsVerifySkillOpen(true)}>
            Get Validated
          </Button>
        </CardContent>
      </Card>

      <AddProjectDialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen} />
      <VerifySkillDialog open={isVerifySkillOpen} onOpenChange={setIsVerifySkillOpen} />

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Projects</DialogTitle>
            <DialogDescription>Filter your projects by category, impact, media, and more</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="has-impact">Has Impact Metrics</Label>
                  <p className="text-xs text-muted-foreground">Show only projects with impact data</p>
                </div>
                <Switch
                  id="has-impact"
                  checked={hasImpactFilter}
                  onCheckedChange={setHasImpactFilter}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="has-media">Has Media/Attachments</Label>
                  <p className="text-xs text-muted-foreground">Show only projects with media or evidence</p>
                </div>
                <Switch
                  id="has-media"
                  checked={hasMediaFilter}
                  onCheckedChange={setHasMediaFilter}
                />
              </div>
            </div>

            {(selectedCategory !== "all" || hasImpactFilter || hasMediaFilter) && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedCategory("all")
                  setHasImpactFilter(false)
                  setHasMediaFilter(false)
                }}
              >
                Clear All Filters
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Project</DialogTitle>
            <DialogDescription>Share your project with others</DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="font-semibold mb-2">{selectedProject.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent">
                  Copy Link
                </Button>
                <Button className="flex-1">Share on LinkedIn</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
