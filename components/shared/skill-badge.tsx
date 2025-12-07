import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SkillBadgeProps {
  name: string
  verified?: boolean
  variant?: "default" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function SkillBadge({ name, verified = false, variant = "default", size = "md", className }: SkillBadgeProps) {
  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  }

  return (
    <Badge variant={variant} className={cn("gap-1.5", sizes[size], className)}>
      {name}
      {verified && <Check className="h-3 w-3" />}
    </Badge>
  )
}
