"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, TrendingUp, Briefcase, Users, Eye, FolderKanban, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const navigation = [
  { name: "Home", href: ROUTES.HOME, icon: Home },
  { name: "My Profile", href: ROUTES.PROFILE, icon: User },
  { name: "Career Navigator", href: ROUTES.CAREER_NAVIGATOR, icon: TrendingUp },
  { name: "Projects & Skills", href: ROUTES.PROJECTS, icon: FolderKanban },
  { name: "Network", href: ROUTES.NETWORK, icon: Users },
  { name: "Discover", href: ROUTES.DISCOVER, icon: Eye },
  { name: "Verify", href: ROUTES.VERIFY, icon: Briefcase },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden border-r border-border bg-card lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col lg:pt-16">
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const IconComponent = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn("w-full justify-start gap-3", isActive && "bg-primary/10 text-primary font-semibold")}
                >
                  <IconComponent className={cn("h-5 w-5", isActive && "fill-primary/20")} />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-border p-3">
        <Link href={ROUTES.SETTINGS}>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Settings className="h-5 w-5" />
            Settings
          </Button>
        </Link>
      </div>
    </aside>
  )
}
