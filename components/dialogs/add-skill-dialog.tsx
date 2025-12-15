"use client"

import { useState, useEffect } from "react"
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
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { apiPost } from "@/lib/api-client"
import { useApi } from "@/lib/hooks/use-api"
import { Loader2, Code, ChevronsUpDown } from "lucide-react"
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

interface AddSkillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddSkillDialog({ open, onOpenChange }: AddSkillDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [skillsOpen, setSkillsOpen] = useState(false)
  const [selectedSkillId, setSelectedSkillId] = useState<string>("")
  const [level, setLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT">("INTERMEDIATE")
  const { data: skillsData } = useApi<{ skills: any[] }>("/api/skills")

  const skills = skillsData?.skills || []
  const selectedSkill = skills.find((s) => s.id === selectedSkillId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedSkillId) {
      toast({
        title: "Error",
        description: "Please select a skill",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await apiPost("/api/user-skills", {
        skillId: selectedSkillId,
        level,
      })

      toast({
        title: "Success",
        description: "Skill added successfully",
      })

      onOpenChange(false)
      router.refresh()

      // Reset form
      setSelectedSkillId("")
      setLevel("INTERMEDIATE")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add skill. Please try again.",
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
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Add Skill
          </DialogTitle>
          <DialogDescription>
            Add a skill to your profile to showcase your expertise
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="skill">Skill *</Label>
              <Popover open={skillsOpen} onOpenChange={setSkillsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={skillsOpen}
                    className="w-full justify-between"
                    disabled={loading}
                  >
                    {selectedSkill ? selectedSkill.name : "Select a skill..."}
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
                              setSelectedSkillId(skill.id)
                              setSkillsOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedSkillId === skill.id ? "opacity-100" : "opacity-0"
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

            <div className="grid gap-2">
              <Label htmlFor="level">Proficiency Level *</Label>
              <Select
                value={level}
                onValueChange={(value: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT") =>
                  setLevel(value)
                }
                disabled={loading}
              >
                <SelectTrigger id="level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                  <SelectItem value="EXPERT">Expert</SelectItem>
                </SelectContent>
              </Select>
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
            <Button type="submit" disabled={loading || !selectedSkillId}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Skill
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

