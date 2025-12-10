<<<<<<< HEAD
import { userService } from "@/lib/services/user-service"
import { skillService } from "@/lib/services/skill-service"
import { opportunityService } from "@/lib/services/opportunity-service"
import DashboardClient from "./dashboard-client"

export default async function DashboardPage() {
  // In a real app, we would get the session user ID here
  // For now, we'll use a hardcoded ID matching the seed data
  const userId = "1"

  const [trendingSkills, opportunities] = await Promise.all([
    skillService.getTrendingSkills(),
    opportunityService.getOpportunities({ remote: true }), // Example filter
  ])

  // Transform data to match UI components if necessary
  // The services return Prisma objects, which might need mapping to the UI types
  // For this prototype, we'll pass them directly and handle types in the client component

  return (
    <DashboardClient
      trendingSkills={trendingSkills}
      opportunities={opportunities}
    />
  )
=======
import HomePageClient from "./page-client"

export default function HomePage() {
  return <HomePageClient />
>>>>>>> main
}
