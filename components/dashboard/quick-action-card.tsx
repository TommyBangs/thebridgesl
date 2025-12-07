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
    <CardContent className="flex items-start gap-4 p-6">
      <div
        className={cn(
          "rounded-lg p-3 transition-colors",
          variant === "primary" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 space-y-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </CardContent>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        <Card
          className={cn(
            "cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
            variant === "primary" && "border-primary bg-primary/5",
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
        "cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
        variant === "primary" && "border-primary bg-primary/5",
        className,
      )}
      onClick={onClick}
    >
      {cardContent}
    </Card>
  )
}
