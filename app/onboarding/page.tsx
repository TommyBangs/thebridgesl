"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/hooks/use-session"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Camera, GraduationCap, MapPin, User, SkipForward, Briefcase, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiPut } from "@/lib/api-client"
import { Logo } from "@/components/shared/logo"

type UserStatus = "student" | "job_seeker" | "employed" | ""

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [userStatus, setUserStatus] = useState<UserStatus>("")
  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    university: "",
    major: "",
    graduationYear: "",
    currentJobTitle: "",
    currentCompany: "",
    avatar: "",
  })

  // Calculate total steps based on user status
  const getTotalSteps = () => {
    if (!userStatus) return 4 // Include status selection step
    if (userStatus === "student") return 4 // Status + Basic + Education + Review
    if (userStatus === "job_seeker") return 4 // Status + Basic + Professional + Review
    if (userStatus === "employed") return 4 // Status + Basic + Professional + Review
    return 4
  }

  const totalSteps = getTotalSteps()
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    // If on step 1 (status selection) and no status selected, don't proceed
    if (currentStep === 1 && !userStatus) {
      toast({
        title: "Please select your status",
        description: "Select your current status to continue",
        variant: "destructive",
      })
      return
    }

    // If status was just selected, move to step 2
    if (currentStep === 1 && userStatus) {
      setCurrentStep(2)
      return
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = async () => {
    // Skip onboarding and go directly to home page
    setLoading(true)
    try {
      toast({
        title: "Skipped",
        description: "You can complete your profile later from settings",
      })
      
      setTimeout(() => {
        window.location.href = "/"
      }, 500)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to proceed",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handleComplete = async (skipped = false) => {
    setLoading(true)

    try {
      // Update profile with collected data
      const profileData: any = {
        ...(formData.bio && { bio: formData.bio }),
        ...(formData.location && { location: formData.location }),
        ...(formData.avatar && { avatar: formData.avatar }),
      }

      // Add education fields if student
      if (userStatus === "student") {
        if (formData.university) profileData.university = formData.university
        if (formData.major) profileData.major = formData.major
        if (formData.graduationYear) profileData.graduationYear = parseInt(formData.graduationYear)
      }

      // For professionals, we can store job info in bio or create a note
      // For now, we'll append it to bio if provided
      if ((userStatus === "job_seeker" || userStatus === "employed") && (formData.currentJobTitle || formData.currentCompany)) {
        const jobInfo = []
        if (formData.currentJobTitle) jobInfo.push(`Current Role: ${formData.currentJobTitle}`)
        if (formData.currentCompany) jobInfo.push(`Company: ${formData.currentCompany}`)
        if (jobInfo.length > 0 && formData.bio) {
          profileData.bio = `${formData.bio}\n\n${jobInfo.join("\n")}`
        } else if (jobInfo.length > 0) {
          profileData.bio = jobInfo.join("\n")
        }
      }

      // Only save profile data if user provided any information
      if (Object.keys(profileData).length > 0) {
        await apiPut("/users/profile", profileData)
      }

      // Mark onboarding as complete (optional - just for tracking)
      try {
        await apiPut("/users/onboarding", { completed: true })
      } catch {
        // Ignore errors - onboarding completion is optional
      }

      toast({
        title: skipped ? "Skipped" : "Profile setup complete!",
        description: skipped
          ? "You can complete your profile later from settings"
          : "Welcome to Bridge! You can now access all features.",
      })

      // Use setTimeout to allow toast to show, then redirect
      setTimeout(() => {
        window.location.href = "/"
      }, 1000)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U"

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <Logo variant="full" size="md" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Welcome to Bridge!</CardTitle>
            <CardDescription className="text-base mt-2">
              Let's set up your profile to get personalized career recommendations
            </CardDescription>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Status Selection */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Tell us about yourself</h3>
                <p className="text-sm text-muted-foreground">Help us personalize your experience</p>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">What best describes your current situation?</Label>
                <RadioGroup value={userStatus} onValueChange={(value) => setUserStatus(value as UserStatus)}>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">Student</div>
                          <div className="text-sm text-muted-foreground">Currently studying or in school</div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="job_seeker" id="job_seeker" />
                    <Label htmlFor="job_seeker" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">Looking for opportunities</div>
                          <div className="text-sm text-muted-foreground">Actively seeking jobs or career opportunities</div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="employed" id="employed" />
                    <Label htmlFor="employed" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">Currently employed</div>
                          <div className="text-sm text-muted-foreground">Have a job and exploring growth opportunities</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 2: Basic Info */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={formData.avatar || user?.avatar || "/placeholder-user.jpg"} alt={user?.name || "User"} />
                      <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                      onClick={() => {
                        // TODO: Implement avatar upload
                        toast({
                          title: "Coming soon",
                          description: "Avatar upload will be available soon",
                        })
                      }}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{user?.name || "User"}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">
                    <User className="mr-2 h-4 w-4 inline" />
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your interests, and career goals..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground">{formData.bio.length}/500 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    <MapPin className="mr-2 h-4 w-4 inline" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Freetown, Sierra Leone"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Education (for students) or Professional Info (for job seekers/employed) */}
          {currentStep === 3 && userStatus === "student" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Education Information</h3>
                <p className="text-sm text-muted-foreground">Tell us about your educational background</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="university">University / Institution</Label>
                  <Input
                    id="university"
                    placeholder="e.g., Fourah Bay College"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="major">Major / Field of Study</Label>
                  <Input
                    id="major"
                    placeholder="e.g., Computer Science"
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Expected Graduation Year</Label>
                  <Input
                    id="graduationYear"
                    type="number"
                    placeholder="e.g., 2025"
                    min="2020"
                    max="2030"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Professional Info (for job seekers and employed) */}
          {currentStep === 3 && (userStatus === "job_seeker" || userStatus === "employed") && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Professional Information</h3>
                <p className="text-sm text-muted-foreground">
                  {userStatus === "job_seeker"
                    ? "Tell us about your professional background"
                    : "Tell us about your current role"}
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentJobTitle">
                    {userStatus === "job_seeker" ? "Most Recent Job Title / Desired Role" : "Current Job Title"}
                  </Label>
                  <Input
                    id="currentJobTitle"
                    placeholder={userStatus === "job_seeker" ? "e.g., Software Engineer" : "e.g., Senior Developer"}
                    value={formData.currentJobTitle}
                    onChange={(e) => setFormData({ ...formData, currentJobTitle: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentCompany">
                    {userStatus === "job_seeker" ? "Previous Company / Industry" : "Current Company"}
                  </Label>
                  <Input
                    id="currentCompany"
                    placeholder={userStatus === "job_seeker" ? "e.g., Tech Solutions" : "e.g., Tech Solutions Inc."}
                    value={formData.currentCompany}
                    onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                  />
                </div>

              </div>
            </div>
          )}

          {/* Step 4: Summary */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="rounded-full bg-success/10 p-4">
                    <User className="h-8 w-8 text-success" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Review Your Profile</h3>
                <p className="text-sm text-muted-foreground">Review the information you've provided</p>
              </div>

              <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
                {userStatus && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <p className="text-sm capitalize">{userStatus.replace("_", " ")}</p>
                  </div>
                )}
                {formData.bio && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Bio</Label>
                    <p className="text-sm">{formData.bio}</p>
                  </div>
                )}
                {formData.location && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Location</Label>
                    <p className="text-sm">{formData.location}</p>
                  </div>
                )}
                {userStatus === "student" && (
                  <>
                    {formData.university && (
                      <div>
                        <Label className="text-xs text-muted-foreground">University</Label>
                        <p className="text-sm">{formData.university}</p>
                      </div>
                    )}
                    {formData.major && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Major</Label>
                        <p className="text-sm">{formData.major}</p>
                      </div>
                    )}
                    {formData.graduationYear && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Graduation Year</Label>
                        <p className="text-sm">{formData.graduationYear}</p>
                      </div>
                    )}
                  </>
                )}
                {(userStatus === "job_seeker" || userStatus === "employed") && (
                  <>
                    {formData.currentJobTitle && (
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          {userStatus === "job_seeker" ? "Desired Role" : "Current Role"}
                        </Label>
                        <p className="text-sm">{formData.currentJobTitle}</p>
                      </div>
                    )}
                    {formData.currentCompany && (
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          {userStatus === "job_seeker" ? "Previous Company" : "Current Company"}
                        </Label>
                        <p className="text-sm">{formData.currentCompany}</p>
                      </div>
                    )}
                  </>
                )}
                {!formData.bio && !formData.location && 
                 !(userStatus === "student" && (formData.university || formData.major || formData.graduationYear)) &&
                 !((userStatus === "job_seeker" || userStatus === "employed") && (formData.currentJobTitle || formData.currentCompany)) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No information provided. You can add this later from your profile settings.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack} disabled={loading}>
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleSkip} disabled={loading}>
                <SkipForward className="mr-2 h-4 w-4" />
                Skip for now
              </Button>
              <Button onClick={handleNext} disabled={loading}>
                {currentStep === totalSteps ? (loading ? "Saving..." : "Complete Setup") : "Next"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

