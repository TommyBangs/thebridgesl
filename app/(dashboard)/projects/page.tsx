import { AppProjectsPageClient } from "./client"

export const metadata = {
  title: "Projects & Skills",
  description: "Share your work—software, design, research, events, services, products, builds, community projects.",
}

export default function ProjectsPage() {
  return (
    <main>
      <AppProjectsPageClient />
    </main>
  )
}
