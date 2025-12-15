"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { FolderPlus, CheckCircle, Compass, Award } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap = {
  "folder-plus": FolderPlus,
  "check-circle": CheckCircle,
  compass: Compass,
  award: Award,
} as const

interface QuickActionCardProps {
  icon: keyof typeof iconMap
  title: string
  description: string
  href?: string
  onClick?: () => void
  className?: string
  variant?: "default" | "primary"
}

export function QuickActionCard({
  icon,
  title,
  description,
  href,
  onClick,
  className,
  variant = "default",
}: QuickActionCardProps) {
  const Icon = iconMap[icon]

  const cardContent = (
    <CardContent className="flex flex-col items-start gap-2 p-4 sm:gap-3 sm:p-5 relative overflow-hidden group-hover:bg-gradient-to-br group-hover:from-primary/5 group-hover:to-transparent transition-all">
      {/* Decorative background gradient on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      
      <div
        className={cn(
          "rounded-xl p-3 transition-all relative z-10",
          variant === "primary" 
            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20" 
            : "bg-gradient-to-br from-muted to-muted/80 text-foreground",
        )}
      >
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>
      <div className="flex-1 space-y-1 relative z-10">
        <h3 className="text-sm font-semibold sm:text-base">{title}</h3>
        <p className="text-xs text-muted-foreground sm:text-sm leading-relaxed">{description}</p>
      </div>
    </CardContent>
  )

  if (href) {
    return (
      <Link href={href} className="block group">
        <Card
          className={cn(
            "cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-2",
            variant === "primary" && "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/50",
            !variant || variant === "default" && "hover:border-primary/20",
            className,
          )}
        >
          {cardContent}
        </Card>
      </Link>
    )
  }

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-2 group",
        variant === "primary" && "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent hover:border-primary/50",
        !variant || variant === "default" && "hover:border-primary/20",
        className,
      )}
      onClick={onClick}
    >
      {cardContent}
    </Card>
  )
}
