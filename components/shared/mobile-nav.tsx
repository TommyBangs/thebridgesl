"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, TrendingUp, FolderKanban, Users, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/constants"

const mobileNavigation = [
  { name: "Home", href: ROUTES.HOME, icon: Home },
  { name: "Career", href: ROUTES.CAREER_NAVIGATOR, icon: TrendingUp },
  { name: "Projects", href: ROUTES.PROJECTS, icon: FolderKanban },
  { name: "Network", href: ROUTES.NETWORK, icon: Users },
  { name: "Profile", href: ROUTES.PROFILE, icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card lg:hidden">
      <div className="flex items-center justify-around">
        {mobileNavigation.map((item) => {
          const isActive = pathname === item.href
          const IconComponent = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors",
                isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <IconComponent className={cn("h-5 w-5", isActive && "fill-primary/20")} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
