"use client"

import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { ProjectForm } from "@/components/projects/project-form"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProjectFormPageClient() {
    const router = useRouter()

    const handleSuccess = () => {
        router.push("/projects")
        router.refresh()
    }

    const handleCancel = () => {
        router.back()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={handleCancel}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <PageHeader
                    title="Add New Project"
                    description="Share your work—software, design, research, events, services, products, builds, community projects."
                />
            </div>

            <div className="max-w-3xl">
                <ProjectForm onSuccess={handleSuccess} onCancel={handleCancel} />
            </div>
        </div>
    )
}

