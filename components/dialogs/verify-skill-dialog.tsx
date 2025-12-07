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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface VerifySkillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VerifySkillDialog({ open, onOpenChange }: VerifySkillDialogProps) {
  const router = useRouter()
  const [skillName, setSkillName] = useState("")
  const [proficiency, setProficiency] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Navigate to verify page after submission
    onOpenChange(false)
    router.push("/verify")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Verify Your Skill</DialogTitle>
          <DialogDescription>Submit your skill for verification through blockchain technology.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="skill">Skill Name</Label>
              <Input
                id="skill"
                placeholder="React Development"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="proficiency">Proficiency Level</Label>
              <Select value={proficiency} onValueChange={setProficiency} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select proficiency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit for Verification</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
