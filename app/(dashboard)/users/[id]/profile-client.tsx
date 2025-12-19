"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import {
  MapPin,
  GraduationCap,
  Mail,
  ExternalLink,
  Briefcase,
  Phone,
  Globe,
  Linkedin,
  Github,
  Link as LinkIcon,
  Calendar,
  Award,
  MessageSquare,
  Users,
  UserPlus,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { SkillBadge } from "@/components/shared/skill-badge"
import { useApi } from "@/lib/hooks/use-api"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { EmptyState } from "@/components/shared/empty-state"
import { formatDate } from "@/lib/format"
import { ROUTES } from "@/lib/constants"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export default function PublicProfileClient() {
  const params = useParams()
  const userId = params.id as string
  const { data: profileData, loading, error, refetch } = useApi<{ user: any; connectionStatus: string }>(`/api/users/${userId}`)
  const [sendingRequest, setSendingRequest] = useState(false)

  const user = profileData?.user
  const profile = user?.learnerProfile
  const connectionStatus = profileData?.connectionStatus || "NONE"

  const handleConnect = async () => {
    try {
      setSendingRequest(true)
      const response = await fetch("/api/network/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: userId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to send connection request")
      }

      toast({
        title: "Connection request sent",
        description: "Your connection request has been sent",
      })

      // Refresh profile data to update status
      refetch()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send connection request",
        variant: "destructive",
      })
    } finally {
      setSendingRequest(false)
    }
  }

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
        title="Profile not found"
        description="This user profile could not be found or is not available."
      />
    )
  }

  if (!user) {
    return (
      <EmptyState
        title="Profile not found"
        description="This user profile could not be found."
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
    <div className="space-y-8">
      <PageHeader
        title={user.name || "User Profile"}
        description="Public profile information"
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
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    {profile?.verificationStatus === "VERIFIED" && (
                      <Badge variant="default" className="gap-1 bg-success text-success-foreground">
                        Verified
                      </Badge>
                    )}
                  </div>
                  {profile?.bio && <p className="text-muted-foreground">{profile.bio}</p>}
                </div>

                <div className="flex gap-2">
                  {connectionStatus === "CONNECTED" ? (
                    <Button variant="outline" className="gap-2" disabled>
                      <Users className="h-4 w-4" />
                      Connected
                    </Button>
                  ) : connectionStatus === "PENDING" ? (
                    <Button variant="outline" className="gap-2" disabled>
                      <Calendar className="h-4 w-4" />
                      Pending
                    </Button>
                  ) : (
                    <Button className="gap-2" onClick={handleConnect} disabled={sendingRequest}>
                      <UserPlus className="h-4 w-4" />
                      {sendingRequest ? "Sending..." : "Connect"}
                    </Button>
                  )}
                  <Link href={`${ROUTES.MESSAGES}/${user.id}`}>
                    <Button variant="outline" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {profile?.currentJobTitle && profile?.currentCompany && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>
                      {profile.currentJobTitle} at {profile.currentCompany}
                    </span>
                  </div>
                )}
                {profile?.major && (
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    <span>
                      {profile.major}{profile?.university ? ` at ${profile.university}` : ""}
                    </span>
                  </div>
                )}
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
              </div>

              {/* Social Links */}
              {(profile?.linkedinUrl || profile?.githubUrl || profile?.portfolioUrl || profile?.website) && (
                <div className="flex flex-wrap gap-3">
                  {profile?.linkedinUrl && (
                    <Link href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Badge variant="outline" className="gap-2">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </Badge>
                    </Link>
                  )}
                  {profile?.githubUrl && (
                    <Link href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Badge variant="outline" className="gap-2">
                        <Github className="h-4 w-4" />
                        GitHub
                      </Badge>
                    </Link>
                  )}
                  {profile?.portfolioUrl && (
                    <Link href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer">
                      <Badge variant="outline" className="gap-2">
                        <LinkIcon className="h-4 w-4" />
                        Portfolio
                      </Badge>
                    </Link>
                  )}
                  {profile?.website && (
                    <Link href={profile.website} target="_blank" rel="noopener noreferrer">
                      <Badge variant="outline" className="gap-2">
                        <Globe className="h-4 w-4" />
                        Website
                      </Badge>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      {user.userSkills && user.userSkills.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.userSkills.map((userSkill: any) => (
                <SkillBadge
                  key={userSkill.skill.id}
                  name={userSkill.skill.name}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects */}
      {user.projects && user.projects.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Projects</h3>
            <div className="space-y-4">
              {user.projects.map((project: any) => (
                <div key={project.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{project.title}</h4>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                  </div>
                  {project.projectSkills && project.projectSkills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.projectSkills.map((ps: any) => (
                        <Badge key={ps.skill.id} variant="secondary">
                          {ps.skill.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                    {project.startDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(project.startDate)}</span>
                      </div>
                    )}
                    {project.githubUrl && (
                      <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Badge variant="outline" className="gap-1">
                          <Github className="h-4 w-4" />
                          Code
                        </Badge>
                      </Link>
                    )}
                    {project.liveUrl && (
                      <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <Badge variant="outline" className="gap-1">
                          <ExternalLink className="h-4 w-4" />
                          Live
                        </Badge>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Credentials */}
      {user.credentials && user.credentials.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Credentials</h3>
            <div className="space-y-4">
              {user.credentials.map((credential: any) => (
                <div key={credential.id} className="flex items-start gap-4 rounded-lg border p-4">
                  <Award className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold">{credential.title}</h4>
                    <p className="text-sm text-muted-foreground">{credential.issuer}</p>
                    {credential.issueDate && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Issued {formatDate(credential.issueDate)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
