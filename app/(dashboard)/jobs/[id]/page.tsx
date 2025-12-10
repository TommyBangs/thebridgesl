import { notFound } from "next/navigation"
import { JobDetailClient } from "./job-detail-client"

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/opportunities/${id}`,
      {
        cache: "no-store",
      }
    )

    if (!response.ok) {
      notFound()
    }

    const data = await response.json()
    const job = data.opportunity

    if (!job) {
      notFound()
    }

    return <JobDetailClient job={job} />
  } catch (error) {
    console.error("Error fetching job:", error)
    notFound()
  }
}
