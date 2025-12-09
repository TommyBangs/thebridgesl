"use client"

import { useState } from "react"
import {
  Camera,
  Check,
  MapPin,
  GraduationCap,
  Mail,
  ExternalLink,
  Edit,
  Plus,
  Download,
  Briefcase,
  Calendar,
  Award,
  Phone,
  Globe,
  Linkedin,
  Github,
  Link as LinkIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/shared/page-header"
import { SkillBadge } from "@/components/shared/skill-badge"
import { CircularProgress } from "@/components/shared/circular-progress"
import { DownloadProfileDialog } from "@/components/dialogs/download-profile-dialog"
import { EditProfileDialog } from "@/components/dialogs/edit-profile-dialog"
import { useApi } from "@/lib/hooks/use-api"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { EmptyState } from "@/components/shared/empty-state"
import { formatDate } from "@/lib/format"
import Link from "next/link"

export default function ProfilePageClient() {
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const { data: profileData, loading, error } = useApi<{ user: any }>("/api/users/profile")

  const user = profileData?.user
  const profile = user?.learnerProfile
  const skillsMatchPercentage = profile?.skillsMatchPercentage || 0
  const verificationStatus = profile?.verificationStatus?.toLowerCase() || "unverified"

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading profile"
        description={error.message || "Unable to load your profile. Please try again."}
      />
    )
  }

  if (!user) {
    return (
      <EmptyState
        title="Profile not found"
        description="Unable to load your profile. Please try again."
      />
    )
  }

  const initials = user.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U"

  return (
    <>
      <div className="space-y-8">
        <PageHeader
          title="My Profile"
          description="Manage your credentials, projects, and professional information"
          action={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDownloadDialogOpen(true)}>
                <Download className="mr-2 h-4 w-4" />
                Download Profile
              </Button>
              <Button onClick={() => setEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          }
        />

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  onClick={() => setEditDialogOpen(true)}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{user.name || "User"}</h2>
                    {verificationStatus === "verified" && (
                      <Badge variant="default" className="gap-1 bg-success text-success-foreground">
                        <Check className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  {profile?.bio ? (
                    <p className="text-muted-foreground">{profile.bio}</p>
                  ) : (
                    <p className="text-muted-foreground italic">No bio yet. Click Edit Profile to add one.</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {profile?.currentJobTitle && profile?.currentCompany ? (
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span>
                        {profile.currentJobTitle} at {profile.currentCompany}
                      </span>
                    </div>
                  ) : profile?.currentJobTitle ? (
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{profile.currentJobTitle}</span>
                    </div>
                  ) : null}
                  {profile?.major ? (
                    <div className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      <span>
                        {profile.major}{profile?.university ? ` at ${profile.university}` : ""}
                      </span>
                    </div>
                  ) : profile?.university ? (
                    <div className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      <span>{profile.university}</span>
                    </div>
                  ) : null}
                  {profile?.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {user.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                  )}
                  {profile?.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>

                {/* Show message if no profile info */}
                {!profile?.bio && !profile?.location && !profile?.currentJobTitle && !profile?.major && !profile?.university && (
                  <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Your profile is empty. Click <strong>Edit Profile</strong> to add your information.
                    </p>
                  </div>
                )}

                {/* Social Links */}
                {(profile?.linkedinUrl || profile?.githubUrl || profile?.portfolioUrl || profile?.website) && (
                  <div className="flex flex-wrap gap-3">
                    {profile?.linkedinUrl && (
                      <Link href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Linkedin className="h-4 w-4" />
                          LinkedIn
                        </Button>
                      </Link>
                    )}
                    {profile?.githubUrl && (
                      <Link href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Github className="h-4 w-4" />
                          GitHub
                        </Button>
                      </Link>
                    )}
                    {profile?.portfolioUrl && (
                      <Link href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-2">
                          <LinkIcon className="h-4 w-4" />
                          Portfolio
                        </Button>
                      </Link>
                    )}
                    {profile?.website && (
                      <Link href={profile.website} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Globe className="h-4 w-4" />
                          Website
                        </Button>
                      </Link>
                    )}
                  </div>
                )}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Skills Match</span>
                    <span className="text-sm font-bold text-primary">{skillsMatchPercentage}%</span>
                  </div>
                  <Progress value={skillsMatchPercentage} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Work Experience</h2>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </div>
          <div className="space-y-4">
            {workExperience.map((experience) => (
              <Card
                key={experience.id}
                className="animate-fade-in"
                style={{ animationDelay: `${(experience.id - 1) * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{experience.title}</h3>
                          <p className="text-sm text-muted-foreground">{experience.company}</p>
                        </div>
                        {experience.endDate === "Present" && <Badge variant="secondary">Current</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {experience.startDate} - {experience.endDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{experience.location}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{experience.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {experience.skills.map((skill) => (
                          <SkillBadge key={skill} name={skill} size="sm" variant="secondary" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Skills</h2>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </div>
          <div className="grid gap-6">
            {/* Technical Skills */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold text-foreground">Technical Skills</h3>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                  <div className="flex flex-col items-center space-y-2">
                    <CircularProgress value={95} size="md" />
                    <div className="text-center">
                      <span className="text-sm font-medium">React</span>
                      <p className="text-xs text-muted-foreground">Expert</p>
                      <p className="text-xs text-muted-foreground">12 endorsements</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <CircularProgress value={88} size="md" />
                    <div className="text-center">
                      <span className="text-sm font-medium">Python</span>
                      <p className="text-xs text-muted-foreground">Advanced</p>
                      <p className="text-xs text-muted-foreground">8 endorsements</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <CircularProgress value={85} size="md" />
                    <div className="text-center">
                      <span className="text-sm font-medium">TypeScript</span>
                      <p className="text-xs text-muted-foreground">Advanced</p>
                      <p className="text-xs text-muted-foreground">10 endorsements</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <CircularProgress value={72} size="md" />
                    <div className="text-center">
                      <span className="text-sm font-medium">Node.js</span>
                      <p className="text-xs text-muted-foreground">Intermediate</p>
                      <p className="text-xs text-muted-foreground">5 endorsements</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI & Machine Learning */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold text-foreground">AI & Machine Learning</h3>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                  <div className="flex flex-col items-center space-y-2">
                    <CircularProgress value={75} size="md" />
                    <div className="text-center">
                      <span className="text-sm font-medium">TensorFlow</span>
                      <p className="text-xs text-muted-foreground">Intermediate</p>
                      <p className="text-xs text-muted-foreground">6 endorsements</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <CircularProgress value={82} size="md" />
                    <div className="text-center">
                      <span className="text-sm font-medium">Machine Learning</span>
                      <p className="text-xs text-muted-foreground">Advanced</p>
                      <p className="text-xs text-muted-foreground">9 endorsements</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <CircularProgress value={68} size="md" />
                    <div className="text-center">
                      <span className="text-sm font-medium">PyTorch</span>
                      <p className="text-xs text-muted-foreground">Intermediate</p>
                      <p className="text-xs text-muted-foreground">4 endorsements</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cloud & DevOps */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold text-foreground">Cloud & DevOps</h3>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                  <div className="flex flex-col items-center space-y-2">
                    <CircularProgress value={80} size="md" />
                    <div className="text-center">
                      <span className="text-sm font-medium">AWS</span>
                      <p className="text-xs text-muted-foreground">Advanced</p>
                      <p className="text-xs text-muted-foreground">7 endorsements</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <CircularProgress value={70} size="md" />
                    <div className="text-center">
                      <span className="text-sm font-medium">Docker</span>
                      <p className="text-xs text-muted-foreground">Intermediate</p>
                      <p className="text-xs text-muted-foreground">5 endorsements</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <CircularProgress value={45} size="md" />
                    <div className="text-center">
                      <span className="text-sm font-medium">Kubernetes</span>
                      <p className="text-xs text-muted-foreground">Beginner</p>
                      <p className="text-xs text-muted-foreground">2 endorsements</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Soft Skills */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold text-foreground">Professional Skills</h3>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                  <div className="flex flex-col items-center space-y-2">
                    <CircularProgress value={90} size="md" />
                    <div className="text-center">
                      <span className="text-sm font-medium">Leadership</span>
                      <p className="text-xs text-muted-foreground">15 endorsements</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <CircularProgress value={88} size="md" />
                    <div className="text-center">
                      <span className="text-sm font-medium">Communication</span>
                      <p className="text-xs text-muted-foreground">12 endorsements</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <CircularProgress value={92} size="md" />
                    <div className="text-center">
                      <span className="text-sm font-medium">Problem Solving</span>
                      <p className="text-xs text-muted-foreground">18 endorsements</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <CircularProgress value={85} size="md" />
                    <div className="text-center">
                      <span className="text-sm font-medium">Teamwork</span>
                      <p className="text-xs text-muted-foreground">14 endorsements</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Credentials */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Credentials</h2>
            <Button variant="outline" size="sm">
              Add Credential
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {mockCredentials.map((credential) => (
              <Link key={credential.id} href={`/credentials/${credential.id}`}>
                <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-shrink-0 rounded-full bg-primary/10 p-3">
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{credential.title}</h3>
                          <p className="text-sm text-muted-foreground">{credential.issuer}</p>
                        </div>
                        {credential.verified && (
                          <Badge variant="default" className="gap-1 bg-success text-success-foreground">
                            <Check className="h-3 w-3" />
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Issued {formatDate(credential.issueDate)}</p>
                      <div className="flex flex-wrap gap-2">
                        {credential.skills.slice(0, 3).map((skill) => (
                          <SkillBadge key={skill} name={skill} size="sm" variant="secondary" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Featured Projects</h2>
            <Button variant="outline" size="sm">
              View All Projects
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {mockProjects.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                      {project.verified && (
                        <Badge variant="default" className="gap-1 bg-success text-success-foreground">
                          <Check className="h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill) => (
                        <SkillBadge key={skill} name={skill} size="sm" variant="secondary" />
                      ))}
                    </div>
                    {(project.githubUrl || project.liveUrl) && (
                      <div className="flex gap-2">
                        {project.githubUrl && (
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-3 w-3" />
                              GitHub
                            </a>
                          </Button>
                        )}
                        {project.liveUrl && (
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-3 w-3" />
                              Live Demo
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <DownloadProfileDialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen} />
      <EditProfileDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} />
    </>
  )
}
