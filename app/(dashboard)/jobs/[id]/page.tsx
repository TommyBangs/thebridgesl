import { notFound } from "next/navigation"
import { mockAllJobs } from "@/lib/mock-data"
import { JobDetailClient } from "./job-detail-client"

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = mockAllJobs.find((j) => j.id === id)

  if (!job) {
    notFound()
  }

  return <JobDetailClient job={job} />
}
