import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "icon" | "full"
  href?: string
}

export function Logo({ className, size = "md", variant = "full", href = "/" }: LogoProps) {
  const imageSizes = {
    sm: { width: 70, height: 22 },
    md: { width: 100, height: 32 },
    lg: { width: 130, height: 42 },
  }

  const iconSizes = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 40, height: 40 },
  }

  const dimensions = variant === "icon" ? iconSizes[size] : imageSizes[size]

  const content = (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/bridgesl.png"
        alt="Bridge"
        width={dimensions.width}
        height={dimensions.height}
        priority
        className="object-contain"
      />
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
