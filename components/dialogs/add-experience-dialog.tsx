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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { apiPost } from "@/lib/api-client"
import { useApi } from "@/lib/hooks/use-api"
import { Loader2, Briefcase } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"

interface AddExperienceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddExperienceDialog({ open, onOpenChange }: AddExperienceDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [skillsOpen, setSkillsOpen] = useState(false)
  const { data: skillsData } = useApi<{ skills: any[] }>("/api/skills")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    startDate: "",
    endDate: "",
    current: false,
  })

  const skills = skillsData?.skills || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await apiPost("/api/experiences", {
        title: formData.title,
        company: formData.company,
        location: formData.location || undefined,
        description: formData.description || undefined,
        startDate: formData.startDate,
        endDate: formData.current ? undefined : (formData.endDate || undefined),
        current: formData.current,
        skills: selectedSkills.length > 0 ? selectedSkills : undefined,
      })

      toast({
        title: "Success",
        description: "Experience added successfully",
      })

      onOpenChange(false)
      router.refresh()

      // Reset form
      setFormData({
        title: "",
        company: "",
        location: "",
        description: "",
        startDate: "",
        endDate: "",
        current: false,
      })
      setSelectedSkills([])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add experience. Please try again.",
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
            <Briefcase className="h-5 w-5" />
            Add Experience
          </DialogTitle>
          <DialogDescription>
            Add your work experience to showcase your professional background
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Software Engineer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                placeholder="e.g., Tech Corp"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Freetown, Sierra Leone"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  disabled={loading || formData.current}
                  min={formData.startDate}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="current"
                checked={formData.current}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, current: checked === true })
                }
                disabled={loading}
              />
              <Label
                htmlFor="current"
                className="text-sm font-normal cursor-pointer"
              >
                I currently work here
              </Label>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your responsibilities and achievements..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label>Skills Used</Label>
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
              Add Experience
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

