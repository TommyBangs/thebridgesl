import type React from "react"
import { redirect } from "next/navigation"
import { Header } from "@/components/shared/header"
import { Sidebar } from "@/components/shared/sidebar"
import { MobileNav } from "@/components/shared/mobile-nav"
import { ScrollToTop } from "@/components/shared/scroll-to-top"
import { auth } from "@/lib/auth"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  return (
    <div className="relative min-h-screen">
      <ScrollToTop />
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto px-4 py-6 pb-20 lg:pb-6">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
