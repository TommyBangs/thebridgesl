"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { useToast } from "@/hooks/use-toast"
import { apiPost } from "@/lib/api-client"
import { useApi } from "@/lib/hooks/use-api"
import { Loader2, Award, ChevronsUpDown } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface AddCredentialDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCredentialDialog({ open, onOpenChange }: AddCredentialDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [skillsOpen, setSkillsOpen] = useState(false)
  const { data: skillsData } = useApi<{ skills: any[] }>("/api/skills")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    type: "CERTIFICATION" as "CERTIFICATION" | "DEGREE" | "BADGE" | "COURSE_COMPLETION" | "PROJECT",
    issueDate: "",
    expiryDate: "",
  })

  const skills = skillsData?.skills || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await apiPost("/api/credentials", {
        title: formData.title,
        issuer: formData.issuer,
        type: formData.type,
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate || undefined,
        skills: selectedSkills.length > 0 ? selectedSkills : undefined,
      })

      toast({
        title: "Success",
        description: "Credential added successfully",
      })

      onOpenChange(false)
      router.refresh()

      // Reset form
      setFormData({
        title: "",
        issuer: "",
        type: "CERTIFICATION",
        issueDate: "",
        expiryDate: "",
      })
      setSelectedSkills([])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add credential. Please try again.",
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
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Add Credential
          </DialogTitle>
          <DialogDescription>
            Add a certification, degree, or credential to your profile
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., AWS Certified Solutions Architect"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="issuer">Issuer *</Label>
              <Input
                id="issuer"
                placeholder="e.g., Amazon Web Services"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "CERTIFICATION" | "DEGREE" | "BADGE" | "COURSE_COMPLETION" | "PROJECT") =>
                  setFormData({ ...formData, type: value })
                }
                disabled={loading}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CERTIFICATION">Certification</SelectItem>
                  <SelectItem value="DEGREE">Degree</SelectItem>
                  <SelectItem value="BADGE">Badge</SelectItem>
                  <SelectItem value="COURSE_COMPLETION">Course Completion</SelectItem>
                  <SelectItem value="PROJECT">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="issueDate">Issue Date *</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  disabled={loading}
                  min={formData.issueDate}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Related Skills</Label>
              <Popover open={skillsOpen} onOpenChange={setSkillsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={skillsOpen}
                    className="w-full justify-between"
                    disabled={loading}
                  >
                    {selectedSkills.length > 0
                      ? `${selectedSkills.length} skill(s) selected`
                      : "Select skills..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search skills..." />
                    <CommandList>
                      <CommandEmpty>No skills found.</CommandEmpty>
                      <CommandGroup>
                        {skills.map((skill) => (
                          <CommandItem
                            key={skill.id}
                            value={skill.id}
                            onSelect={() => {
                              if (selectedSkills.includes(skill.id)) {
                                setSelectedSkills(selectedSkills.filter((id) => id !== skill.id))
                              } else {
                                setSelectedSkills([...selectedSkills, skill.id])
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedSkills.includes(skill.id) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {skill.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Credential
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

