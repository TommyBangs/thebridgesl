import { notFound } from "next/navigation"
import { mockAllSkills } from "@/lib/mock-data"
import { SkillDetailClient } from "./skill-detail-client"

export default async function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const skill = mockAllSkills.find((s) => s.id === id)

  if (!skill) {
    notFound()
  }

  return <SkillDetailClient skill={skill} />
}
