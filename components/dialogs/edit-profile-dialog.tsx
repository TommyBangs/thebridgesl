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
import { useToast } from "@/hooks/use-toast"
import { apiPut } from "@/lib/api-client"
import { useApi } from "@/lib/hooks/use-api"
import { Loader2 } from "lucide-react"

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { data: profileData, refetch } = useApi<{ user: any }>("/api/users/profile")
  const [loading, setLoading] = useState(false)
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
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.learnerProfile?.bio || "",
        location: user.learnerProfile?.location || "",
        phone: user.learnerProfile?.phone || "",
        website: user.learnerProfile?.website || "",
        university: user.learnerProfile?.university || "",
        major: user.learnerProfile?.major || "",
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
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  disabled={loading}
                  placeholder="City, Country"
                />
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
                <Input
                  id="major"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  disabled={loading}
                  placeholder="Field of study"
                />
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

