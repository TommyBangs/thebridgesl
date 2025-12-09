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
import { useRouter } from "next/navigation"
import { apiPost } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface AddProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddProjectDialog({ open, onOpenChange }: AddProjectDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Parse technologies into skill IDs (simplified - in production, you'd search for skills)
      const skills = formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)

      await apiPost("/api/projects", {
        title: formData.title,
        description: formData.description,
        skills: [], // TODO: Map technology names to skill IDs
        githubUrl: formData.githubUrl || undefined,
        liveUrl: formData.liveUrl || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        visibility: "PUBLIC",
      })

      toast({
        title: "Success",
        description: "Project added successfully",
      })

      onOpenChange(false)
      setFormData({
        title: "",
        description: "",
        technologies: "",
        githubUrl: "",
        liveUrl: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
      })
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>Showcase your latest work and skills to potential employers.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                placeholder="E-commerce Platform"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your project and its key features..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="technologies">Technologies Used</Label>
              <Input
                id="technologies"
                placeholder="React, Node.js, PostgreSQL"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              />
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
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
