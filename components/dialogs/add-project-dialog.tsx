"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { X, ChevronDown, ChevronUp, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { apiPost } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { VALIDATION } from "@/lib/constants"

interface AddProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: any // For editing
}

const PROJECT_CATEGORIES = [
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

const CATEGORY_TEMPLATES: Record<string, { title: string; fields: string[] }> = {
  research: {
    title: "Research Project Template",
    fields: ["Problem/Hypothesis", "Method", "Results", "Citation/DOI"],
  },
  nonprofit: {
    title: "Non-profit/Community Template",
    fields: ["Problem", "Intervention", "Beneficiaries", "Outcomes"],
  },
  "design-creative": {
    title: "Design/Creative Template",
    fields: ["Brief", "Process", "Deliverable", "Audience"],
  },
  business: {
    title: "Business Template",
    fields: ["Goal", "Market", "Traction/Revenue", "KPIs"],
  },
  trades: {
    title: "Trades/Crafts Template",
    fields: ["Materials", "Safety/Compliance", "Before/After"],
  },
}

export function AddProjectDialog({ open, onOpenChange, project }: AddProjectDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showImpact, setShowImpact] = useState(false)
  const [showEvidence, setShowEvidence] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [evidenceLinkInput, setEvidenceLinkInput] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    location: "",
    role: "",
    organization: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    visibility: "PUBLIC" as "PUBLIC" | "PRIVATE" | "CONNECTIONS",
    tags: [] as string[],
    evidenceLinks: [] as string[],
    impactMetrics: {
      audience: "",
      revenue: "",
      satisfaction: "",
      currency: "USD",
      notes: "",
    },
  })

  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (tag && formData.tags.length < 15 && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] })
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tagToRemove) })
  }

  const handleAddEvidenceLink = () => {
    const link = evidenceLinkInput.trim()
    if (link && formData.evidenceLinks.length < 10) {
      try {
        new URL(link) // Validate URL
        if (!formData.evidenceLinks.includes(link)) {
          setFormData({ ...formData, evidenceLinks: [...formData.evidenceLinks, link] })
          setEvidenceLinkInput("")
        }
      } catch {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid URL",
          variant: "destructive",
        })
      }
    }
  }

  const handleRemoveEvidenceLink = (linkToRemove: string) => {
    setFormData({ ...formData, evidenceLinks: formData.evidenceLinks.filter((l) => l !== linkToRemove) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (!formData.title || formData.title.length > VALIDATION.PROJECT_TITLE_MAX_LENGTH) {
      toast({
        title: "Validation Error",
        description: `Title is required and must be ${VALIDATION.PROJECT_TITLE_MAX_LENGTH} characters or less`,
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    if (!formData.description || formData.description.length > VALIDATION.PROJECT_DESC_MAX_LENGTH) {
      toast({
        title: "Validation Error",
        description: `Description is required and must be ${VALIDATION.PROJECT_DESC_MAX_LENGTH} characters or less`,
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    if (!formData.category) {
      toast({
        title: "Validation Error",
        description: "Category is required",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      // Build impact metrics object (only include non-empty values)
      const impactMetrics: any = {}
      if (formData.impactMetrics.audience) impactMetrics.audience = Number(formData.impactMetrics.audience)
      if (formData.impactMetrics.revenue) impactMetrics.revenue = Number(formData.impactMetrics.revenue)
      if (formData.impactMetrics.satisfaction) impactMetrics.satisfaction = Number(formData.impactMetrics.satisfaction)
      if (formData.impactMetrics.currency) impactMetrics.currency = formData.impactMetrics.currency
      if (formData.impactMetrics.notes) impactMetrics.notes = formData.impactMetrics.notes

      // Parse technologies into skill IDs (simplified - in production, you'd search for skills)
      const skills = formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)

      const payload: any = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        skills: [], // TODO: Map technology names to skill IDs
        githubUrl: formData.githubUrl || undefined,
        liveUrl: formData.liveUrl || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        visibility: formData.visibility,
        tags: formData.tags,
        evidenceLinks: formData.evidenceLinks,
        location: formData.location || undefined,
        role: formData.role || undefined,
        organization: formData.organization || undefined,
      }

      // Only include impactMetrics if it has at least one value
      if (Object.keys(impactMetrics).length > 0) {
        payload.impactMetrics = impactMetrics
      }

      await apiPost("/api/projects", payload)

      toast({
        title: "Success",
        description: "Project added successfully",
      })

      onOpenChange(false)
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        technologies: "",
        githubUrl: "",
        liveUrl: "",
        location: "",
        role: "",
        organization: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        visibility: "PUBLIC",
        tags: [],
        evidenceLinks: [],
        impactMetrics: {
          audience: "",
          revenue: "",
          satisfaction: "",
          currency: "USD",
          notes: "",
        },
      })
      setTagInput("")
      setEvidenceLinkInput("")
      setShowImpact(false)
      setShowEvidence(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add project",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedCategoryTemplate = formData.category ? CATEGORY_TEMPLATES[formData.category] : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            Share your work—software, design, research, events, services, products, builds, community projects.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Required Fields */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">
                  Project Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="E-commerce Platform"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  maxLength={VALIDATION.PROJECT_TITLE_MAX_LENGTH}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {formData.title.length}/{VALIDATION.PROJECT_TITLE_MAX_LENGTH} characters
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
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

              {selectedCategoryTemplate && (
                <Card className="bg-muted/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{selectedCategoryTemplate.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Consider including: {selectedCategoryTemplate.fields.join(", ")}
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project and its key features..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  maxLength={VALIDATION.PROJECT_DESC_MAX_LENGTH}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {formData.description.length}/{VALIDATION.PROJECT_DESC_MAX_LENGTH} characters
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">
                    Start Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date (optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Optional Fields */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="technologies">Technologies/Skills Used</Label>
                <Input
                  id="technologies"
                  placeholder="React, Node.js, PostgreSQL"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="role">Your Role (optional)</Label>
                  <Input
                    id="role"
                    placeholder="Lead Developer"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="organization">Organization/Client (optional)</Label>
                  <Input
                    id="organization"
                    placeholder="Company Name"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Location (optional)</Label>
                <Input
                  id="location"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select
                  value={formData.visibility}
                  onValueChange={(value: "PUBLIC" | "PRIVATE" | "CONNECTIONS") =>
                    setFormData({ ...formData, visibility: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLIC">Public</SelectItem>
                    <SelectItem value="CONNECTIONS">Connections Only</SelectItem>
                    <SelectItem value="PRIVATE">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="githubUrl">GitHub URL (optional)</Label>
                <Input
                  id="githubUrl"
                  type="url"
                  placeholder="https://github.com/username/repo"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="liveUrl">Live URL (optional)</Label>
                <Input
                  id="liveUrl"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                />
              </div>
            </div>

            <Separator />

            {/* Tags Section */}
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Add a tag (max 15)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                  disabled={formData.tags.length >= 15}
                />
                <Button type="button" variant="outline" onClick={handleAddTag} disabled={formData.tags.length >= 15}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">{formData.tags.length}/15 tags</p>
            </div>

            {/* Impact Metrics Section (Collapsible) */}
            <div className="border rounded-lg">
              <button
                type="button"
                onClick={() => setShowImpact(!showImpact)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="text-left">
                  <Label className="text-base font-medium">Impact Metrics (optional)</Label>
                  <p className="text-xs text-muted-foreground">Show the impact of your project</p>
                </div>
                {showImpact ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {showImpact && (
                <div className="p-4 pt-0 space-y-4 border-t">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor="audience">Audience Reached</Label>
                      <Input
                        id="audience"
                        type="number"
                        placeholder="2000"
                        value={formData.impactMetrics.audience}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            impactMetrics: { ...formData.impactMetrics, audience: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="revenue">Revenue/Value</Label>
                      <div className="flex gap-2">
                        <Input
                          id="revenue"
                          type="number"
                          placeholder="12000"
                          value={formData.impactMetrics.revenue}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              impactMetrics: { ...formData.impactMetrics, revenue: e.target.value },
                            })
                          }
                        />
                        <Select
                          value={formData.impactMetrics.currency}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              impactMetrics: { ...formData.impactMetrics, currency: value },
                            })
                          }
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="CAD">CAD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="satisfaction">Satisfaction Rating (1-5)</Label>
                    <Input
                      id="satisfaction"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      placeholder="4.6"
                      value={formData.impactMetrics.satisfaction}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          impactMetrics: { ...formData.impactMetrics, satisfaction: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="impactNotes">Impact Notes</Label>
                    <Textarea
                      id="impactNotes"
                      placeholder="e.g., Reduced downtime 15%, Improved user satisfaction..."
                      value={formData.impactMetrics.notes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          impactMetrics: { ...formData.impactMetrics, notes: e.target.value },
                        })
                      }
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Evidence Links Section (Collapsible) */}
            <div className="border rounded-lg">
              <button
                type="button"
                onClick={() => setShowEvidence(!showEvidence)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="text-left">
                  <Label className="text-base font-medium">Evidence Links (optional)</Label>
                  <p className="text-xs text-muted-foreground">Add links to videos, reports, press, papers</p>
                </div>
                {showEvidence ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {showEvidence && (
                <div className="p-4 pt-0 space-y-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://example.com/evidence"
                      value={evidenceLinkInput}
                      onChange={(e) => setEvidenceLinkInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddEvidenceLink()
                        }
                      }}
                      disabled={formData.evidenceLinks.length >= 10}
                    />
                    <Button type="button" variant="outline" onClick={handleAddEvidenceLink} disabled={formData.evidenceLinks.length >= 10}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.evidenceLinks.length > 0 && (
                    <div className="space-y-2">
                      {formData.evidenceLinks.map((link, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                          <a href={link} target="_blank" rel="noopener noreferrer" className="flex-1 text-sm text-primary hover:underline truncate">
                            {link}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleRemoveEvidenceLink(link)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">{formData.evidenceLinks.length}/10 links</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : project ? "Update Project" : "Add Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
