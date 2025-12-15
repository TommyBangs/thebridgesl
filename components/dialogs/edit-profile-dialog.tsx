"use client"

import { useState, useEffect, useRef } from "react"
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
import { Loader2, Check, ChevronsUpDown, Camera, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/lib/constants"
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
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const coverImageInputRef = useRef<HTMLInputElement | null>(null)
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
    coverImage: "",
  })

  const user = profileData?.user
  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: "Unsupported file type",
        description: "Please upload a JPG, PNG, or WebP image.",
        variant: "destructive",
      })
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result
      if (typeof result === "string") {
        setFormData((prev) => ({
          ...prev,
          avatar: result,
        }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: "Unsupported file type",
        description: "Please upload a JPG, PNG, or WebP image.",
        variant: "destructive",
      })
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result
      if (typeof result === "string") {
        setFormData((prev) => ({
          ...prev,
          coverImage: result,
        }))
      }
    }
    reader.readAsDataURL(file)
  }

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
        coverImage: user.coverImage || "",
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
        coverImage: formData.coverImage || null,
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
          {/* Profile Photo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Profile Photo</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.avatar || user?.avatar || "/placeholder-user.jpg"} alt={user?.name || "User"} />
                  <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="font-medium flex items-center gap-1">
                  <ImageIcon className="h-4 w-4" />
                  Upload a new profile picture
                </p>
                <p>JPG, PNG, or WebP up to 10MB.</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              className="hidden"
              onChange={handleAvatarChange}
              disabled={loading}
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cover Image</h3>
            <div className="space-y-3">
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border bg-gradient-to-br from-muted/50 to-muted/30">
                {formData.coverImage ? (
                  <img 
                    src={formData.coverImage} 
                    alt="Cover preview" 
                    className="w-full h-full object-cover"
                  />
                ) : user?.coverImage ? (
                  <img 
                    src={user.coverImage} 
                    alt="Current cover" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                    <div className="text-center space-y-2">
                      <ImageIcon className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                      <p className="text-sm text-muted-foreground">No cover image</p>
                    </div>
                  </div>
                )}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="absolute top-3 right-3"
                  onClick={() => coverImageInputRef.current?.click()}
                  disabled={loading}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {formData.coverImage || user?.coverImage ? "Change" : "Upload"}
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium flex items-center gap-1 mb-1">
                  <ImageIcon className="h-4 w-4" />
                  Upload a cover image
                </p>
                <p>JPG, PNG, or WebP up to 10MB. Recommended size: 1920x640px</p>
              </div>
            </div>
            <input
              ref={coverImageInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              className="hidden"
              onChange={handleCoverImageChange}
              disabled={loading}
            />
          </div>

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

