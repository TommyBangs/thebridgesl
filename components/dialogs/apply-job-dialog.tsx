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
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { Upload, FileText } from "lucide-react"
import { apiPost } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

interface ApplyJobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  jobTitle?: string
  company?: string
  opportunityId?: string
}

export function ApplyJobDialog({ open, onOpenChange, jobTitle, company, opportunityId }: ApplyJobDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    agreeToTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!opportunityId) {
      toast({
        title: "Error",
        description: "Opportunity ID is required",
        variant: "destructive",
      })
      return
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Error",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await apiPost("/api/applications", {
        opportunityId,
        coverLetter: formData.coverLetter || undefined,
      })

      toast({
        title: "Success",
        description: "Application submitted successfully!",
      })

      onOpenChange(false)
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        coverLetter: "",
        agreeToTerms: false,
      })
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle || "Position"}</DialogTitle>
          <DialogDescription>
            {company ? `Submit your application to ${company}` : "Complete the form below to apply"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="Alex Chen"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="alex.chen@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="resume">Resume/CV *</Label>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" className="flex-1 bg-transparent">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Resume
                </Button>
                <Button type="button" variant="secondary" size="icon">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX (Max 5MB)</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <Textarea
                id="coverLetter"
                placeholder="Tell us why you're a great fit for this role..."
                value={formData.coverLetter}
                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                rows={5}
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to share my information with {company || "the employer"} and accept the{" "}
                <a href="#" className="text-primary underline">
                  terms and conditions
                </a>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.agreeToTerms || loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
