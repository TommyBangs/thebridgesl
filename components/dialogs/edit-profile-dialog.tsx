"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { apiPut } from "@/lib/api-client"
import { useApi } from "@/lib/hooks/use-api"
import { Loader2, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SIERRA_LEONE_CITIES = [
  "Freetown",
  "Bo",
  "Kenema",
  "Makeni",
  "Koidu",
  "Lunsar",
  "Port Loko",
  "Waterloo",
  "Kabala",
  "Segbwema",
  "Magburaka",
  "Kailahun",
  "Bonthe",
  "Mattru Jong",
  "Kambia",
  "Pujehun",
  "Moyamba",
]

const MAJORS = [
  "Computer Science",
  "Information Technology",
  "Software Engineering",
  "Business Administration",
  "Accounting",
  "Economics",
  "Law",
  "Medicine",
  "Nursing",
  "Public Health",
  "Engineering (Civil)",
  "Engineering (Electrical)",
  "Engineering (Mechanical)",
  "Agriculture",
  "Education",
  "Mass Communication",
  "Political Science",
  "Sociology",
  "Other",
]

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { data: profileData, refetch } = useApi<{ user: any }>("/api/users/profile")
  const [loading, setLoading] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const [majorSelectValue, setMajorSelectValue] = useState("")
  const [showOtherMajor, setShowOtherMajor] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    phone: "",
    website: "",
    university: "",
    major: "",
    graduationYear: "",
    currentJobTitle: "",
    currentCompany: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    avatar: "",
  })

  const user = profileData?.user

  // Populate form when profile data loads
  // Populate form when profile data loads
  useEffect(() => {
    if (user) {
      const currentMajor = user.learnerProfile?.major || ""
      const isStandardMajor = MAJORS.includes(currentMajor)

      setMajorSelectValue(isStandardMajor ? currentMajor : (currentMajor ? "Other" : ""))
      setShowOtherMajor(!isStandardMajor && !!currentMajor)

      setFormData({
        name: user.name || "",
        bio: user.learnerProfile?.bio || "",
        location: user.learnerProfile?.location || "",
        phone: user.learnerProfile?.phone || "",
        website: user.learnerProfile?.website || "",
        university: user.learnerProfile?.university || "",
        major: currentMajor,
        graduationYear: user.learnerProfile?.graduationYear?.toString() || "",
        currentJobTitle: user.learnerProfile?.currentJobTitle || "",
        currentCompany: user.learnerProfile?.currentCompany || "",
        linkedinUrl: user.learnerProfile?.linkedinUrl || "",
        githubUrl: user.learnerProfile?.githubUrl || "",
        portfolioUrl: user.learnerProfile?.portfolioUrl || "",
        avatar: user.avatar || "",
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await apiPut("/api/users/profile", {
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        phone: formData.phone || null,
        website: formData.website || null,
        university: formData.university || null,
        major: formData.major || null,
        graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : null,
        currentJobTitle: formData.currentJobTitle || null,
        currentCompany: formData.currentCompany || null,
        linkedinUrl: formData.linkedinUrl || null,
        githubUrl: formData.githubUrl || null,
        portfolioUrl: formData.portfolioUrl || null,
        avatar: formData.avatar || null,
      })

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })

      refetch()
      router.refresh()
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                maxLength={500}
                disabled={loading}
                placeholder="Tell us about yourself..."
              />
              <p className="text-xs text-muted-foreground">{formData.bio.length}/500 characters</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="location">Location</Label>
                <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={locationOpen}
                      className="w-full justify-between"
                      disabled={loading}
                    >
                      {formData.location
                        ? formData.location
                        : "Select city..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search city..." />
                      <CommandList>
                        <CommandEmpty>No city found.</CommandEmpty>
                        <CommandGroup>
                          {SIERRA_LEONE_CITIES.map((city) => (
                            <CommandItem
                              key={city}
                              value={city}
                              onSelect={(currentValue) => {
                                setFormData({ ...formData, location: `${currentValue}, Sierra Leone` })
                                setLocationOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.location === `${city}, Sierra Leone` ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {city}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={loading}
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                disabled={loading}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          {/* Education */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Education</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="university">University / Institution</Label>
                <Input
                  id="university"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  disabled={loading}
                  placeholder="University name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="major">Major / Field of Study</Label>
                <Select
                  value={majorSelectValue}
                  onValueChange={(value) => {
                    setMajorSelectValue(value)
                    if (value === "Other") {
                      setShowOtherMajor(true)
                      setFormData({ ...formData, major: "" })
                    } else {
                      setShowOtherMajor(false)
                      setFormData({ ...formData, major: value })
                    }
                  }}
                  disabled={loading}
                >
                  <SelectTrigger id="major">
                    <SelectValue placeholder="Select Major" />
                  </SelectTrigger>
                  <SelectContent>
                    {MAJORS.map((major) => (
                      <SelectItem key={major} value={major}>
                        {major}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {showOtherMajor && (
                  <Input
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    placeholder="Enter your major"
                    className="mt-2"
                    disabled={loading}
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input
                id="graduationYear"
                type="number"
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                disabled={loading}
                placeholder="2025"
                min="1950"
                max="2100"
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Professional Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentJobTitle">Current Job Title</Label>
                <Input
                  id="currentJobTitle"
                  value={formData.currentJobTitle}
                  onChange={(e) => setFormData({ ...formData, currentJobTitle: e.target.value })}
                  disabled={loading}
                  placeholder="Job title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentCompany">Current Company</Label>
                <Input
                  id="currentCompany"
                  value={formData.currentCompany}
                  onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                  disabled={loading}
                  placeholder="Company name"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social Links</h3>

            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                disabled={loading}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                disabled={loading}
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolioUrl">Portfolio URL</Label>
              <Input
                id="portfolioUrl"
                type="url"
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                disabled={loading}
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

