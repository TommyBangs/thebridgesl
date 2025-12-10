import { notFound } from "next/navigation"
import { SkillDetailClient } from "./skill-detail-client"

export default async function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/skills/${id}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      notFound()
    }

    const data = await response.json()
    const skill = data.skill

    if (!skill) {
      notFound()
    }

    return <SkillDetailClient skill={skill} />
  } catch (error) {
    console.error("Error fetching skill:", error)
    notFound()
  }
}
