"use client"

import { Plus, Filter, Github, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useApi } from "@/lib/hooks/use-api"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { EmptyState } from "@/components/shared/empty-state"
import { formatDate } from "@/lib/format"
import { useState } from "react"
import { AddProjectDialog } from "@/components/dialogs/add-project-dialog"
import { VerifySkillDialog } from "@/components/dialogs/verify-skill-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function AppProjectsPageClient() {
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)
  const [isVerifySkillOpen, setIsVerifySkillOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const { data: projectsData, loading, error, refetch } = useApi<{ projects: any[] }>("/projects")
  
  const projects = projectsData?.projects || []

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
        description="Showcase your work and get skills validated"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button onClick={() => setIsAddProjectOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </div>
        }
      />

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
            <p className="text-sm text-muted-foreground">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
          </div>
          {projects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              description="Start showcasing your work by adding your first project"
              action={{
                label: "Add Project",
                onClick: () => setIsAddProjectOpen(true)
              }}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden transition-shadow hover:shadow-lg">
              {project.media[0] && (
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
                      {project.verified && (
                        <Badge variant="default" className="shrink-0 bg-primary">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  </div>

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
            <DialogDescription>Filter your projects by skills, date, or verification status</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Skills</label>
              <div className="flex flex-wrap gap-2">
                {["React", "Python", "TypeScript", "Node.js"].map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                  Verified
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                  Unverified
                </Badge>
              </div>
            </div>
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
