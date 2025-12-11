"use client"

import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProjectForm } from "@/components/projects/project-form"

interface AddProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: any // For editing
}

export function AddProjectDialog({ open, onOpenChange, project }: AddProjectDialogProps) {
  const router = useRouter()

  const handleSuccess = () => {
    onOpenChange(false)
    router.refresh()
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[70vw] max-h-[90vh] overflow-y-auto hidden md:block">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            Share your work—software, design, research, events, services, products, builds, community projects.
          </DialogDescription>
        </DialogHeader>
        <ProjectForm onSuccess={handleSuccess} onCancel={handleCancel} project={project} />
      </DialogContent>
    </Dialog>
  )
}
