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
  Image as ImageIcon,
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
import { UploadImageDialog } from "@/components/dialogs/upload-image-dialog"
import { useApi } from "@/lib/hooks/use-api"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { EmptyState } from "@/components/shared/empty-state"
import { formatDate } from "@/lib/format"
import Link from "next/link"

export default function ProfilePageClient() {
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [avatarUploadOpen, setAvatarUploadOpen] = useState(false)
  const [coverUploadOpen, setCoverUploadOpen] = useState(false)
  const { data: profileData, loading, error } = useApi<{ user: any }>("/users/profile")

  const user = profileData?.user
  const profile = user?.learnerProfile
  const skillsMatchPercentage = profile?.skillsMatchPercentage || 0
  const verificationStatus = profile?.verificationStatus?.toLowerCase() || "unverified"
  
  // Get real data from API
  const userSkills = user?.userSkills || []
  const credentials = user?.credentials || []
  const projects = user?.projects || []
  
  // Work experience can be derived from profile or be empty for now
  const workExperience: any[] = []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    console.error("Profile error:", error)
    
    // Extract error message from various error types
    let errorMessage = "Unable to load your profile. Please try again."
    const errorAny = error as any
    if (error instanceof Error) {
      errorMessage = error.message || errorMessage
    } else if (typeof error === 'string') {
      errorMessage = error
    } else if (errorAny?.message) {
      errorMessage = errorAny.message
    }
    
    // Check if it's a 404 error (user not found)
    const is404 = errorMessage.toLowerCase().includes("not found") || 
                  errorMessage.toLowerCase().includes("404") ||
                  errorAny?.status === 404
    
    // Check if it's a 401 error (unauthorized)
    const is401 = errorMessage.toLowerCase().includes("unauthorized") ||
                  errorMessage.toLowerCase().includes("authentication") ||
                  errorAny?.status === 401
    
    return (
      <EmptyState
        title={
          is401 
            ? "Authentication required" 
            : is404 
            ? "Profile not found" 
            : "Error loading profile"
        }
        description={
          is401
            ? "Please sign in to view your profile."
            : is404 
            ? "Your profile could not be found. Please try logging out and back in, or contact support if the issue persists."
            : errorMessage
        }
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

        {/* Cover Photo Section */}
        <div className="relative w-full -mx-4 md:-mx-6 lg:-mx-8 mb-0">
          {/* Cover Photo */}
          <div className="relative w-full h-[320px] md:h-[400px] bg-gradient-to-br from-primary/5 via-primary/3 to-muted/50 overflow-hidden">
            {profile?.coverImage ? (
              <img 
                src={profile.coverImage} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="p-3 rounded-full bg-primary/10 mx-auto w-fit">
                    <ImageIcon className="h-8 w-8 text-primary/50" />
                  </div>
                  <p className="text-sm text-muted-foreground">Add Cover Photo</p>
                </div>
              </div>
            )}
            {/* Edit Cover Photo Button */}
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-4 right-4 h-10 w-10 rounded-full backdrop-blur-md bg-white/90 hover:bg-white border border-border/50 shadow-lg transition-all hover:scale-105"
              onClick={() => setCoverUploadOpen(true)}
            >
              <Camera className="h-4 w-4 text-foreground" />
            </Button>
          </div>

          {/* Profile Picture - Elegant Overlap */}
          <div className="relative px-4 md:px-6 lg:px-8">
            <div className="relative -mt-20 md:-mt-24 inline-block">
              {/* Smooth white border with shadow */}
              <div className="absolute -inset-0.5 bg-white rounded-full shadow-lg"></div>
              <Avatar className="relative h-36 w-36 md:h-44 md:w-44 border-4 border-background shadow-xl ring-2 ring-primary/10">
                <AvatarImage src={user.avatar || undefined} alt={user.name} className="object-cover" />
                <AvatarFallback className="text-2xl md:text-3xl font-semibold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* Edit Profile Picture Button - Sleeker Design */}
              <Button
                size="icon"
                className="absolute bottom-1 right-1 h-10 w-10 md:h-11 md:w-11 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg border-2 border-background transition-all hover:scale-105"
                onClick={() => setAvatarUploadOpen(true)}
              >
                <Camera className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Header Card */}
        <Card className="mt-6 md:mt-8">
          <CardContent className="pt-24 md:pt-28 pb-8">
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{user.name || "User"}</h1>
                  {verificationStatus === "verified" && (
                    <Badge variant="default" className="gap-1 bg-success text-success-foreground">
                      <Check className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                {profile?.bio ? (
                  <p className="text-muted-foreground mt-2">{profile.bio}</p>
                ) : (
                  <p className="text-muted-foreground italic mt-2">No bio yet. Click Edit Profile to add one.</p>
                )}
              </div>

              <div className="flex-1 space-y-4">

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
        <section className="mt-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Work Experience</h2>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </div>
          <div className="space-y-4">
            {workExperience.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground">No work experience added yet.</p>
                </CardContent>
              </Card>
            ) : (
              workExperience.map((experience) => (
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
                          {experience.skills.map((skill: string) => (
                            <SkillBadge key={skill} name={skill} size="sm" variant="secondary" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Skills */}
        <section className="mt-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Skills</h2>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </div>
          <div className="grid gap-6">
            {/* User Skills */}
            {userSkills.length > 0 ? (
              <Card>
                <CardContent className="p-8">
                  <h3 className="mb-4 font-semibold text-foreground">Your Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {userSkills.map((userSkill: any) => (
                      <SkillBadge
                        key={userSkill.skill.id}
                        name={userSkill.skill.name}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground">No skills added yet. Click "Add Skill" to get started.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Credentials */}
        <section className="mt-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Credentials</h2>
            <Button variant="outline" size="sm">
              Add Credential
            </Button>
          </div>
          {credentials.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">No credentials added yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {credentials.map((credential: any) => (
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
                        {credential.credentialSkills && credential.credentialSkills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {credential.credentialSkills.slice(0, 3).map((cs: any) => (
                              <SkillBadge key={cs.skill.id} name={cs.skill.name} size="sm" variant="secondary" />
                            ))}
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          )}
        </section>

        {/* Projects */}
        <section className="mt-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Featured Projects</h2>
            <Button variant="outline" size="sm">
              View All Projects
            </Button>
          </div>
          {projects.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">No projects added yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {projects.slice(0, 4).map((project: any) => (
                <Card key={project.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{project.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                        </div>
                      </div>
                      {project.projectSkills && project.projectSkills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.projectSkills.map((ps: any) => (
                            <SkillBadge key={ps.skill.id} name={ps.skill.name} size="sm" variant="secondary" />
                          ))}
                        </div>
                      )}
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
          )}
        </section>
      </div>

      <DownloadProfileDialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen} user={user} profile={profile} />
      <EditProfileDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} />
      <UploadImageDialog 
        open={avatarUploadOpen} 
        onOpenChange={setAvatarUploadOpen} 
        type="avatar" 
        currentImage={user?.avatar} 
      />
      <UploadImageDialog 
        open={coverUploadOpen} 
        onOpenChange={setCoverUploadOpen} 
        type="coverImage" 
        currentImage={profile?.coverImage} 
      />
    </>
  )
}
