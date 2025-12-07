import { AppProjectsPageClient } from "./client"

export const metadata = {
  title: "Projects & Skills",
  description: "Manage your portfolio and validate your skills",
}

export default function ProjectsPage() {
  return (
    <main>
      <AppProjectsPageClient />
    </main>
  )
}
