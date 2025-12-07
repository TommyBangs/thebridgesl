"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendIndicator } from "@/components/shared/trend-indicator"
import { formatCurrency, formatNumber } from "@/lib/format"
import { useRouter } from "next/navigation"
import type { Skill } from "@/types"

interface TrendingSkillCardProps {
  skill: Skill
  onClick?: () => void
}

export function TrendingSkillCard({ skill, onClick }: TrendingSkillCardProps) {
  const router = useRouter()
  const { name, category, trending } = skill

  if (!trending) return null

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
    router.push(`/skills/${skill.id}`)
  }

  return (
    <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50" onClick={handleClick}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="font-semibold">{name}</h4>
              <Badge variant="secondary" className="text-xs">
                {category}
              </Badge>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-2xl font-bold text-success">{trending.demandPercentage}%</span>
              <TrendIndicator value={trending.growthRate} size="sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-muted-foreground">Avg. Salary</p>
              <p className="font-medium">{formatCurrency(trending.averageSalary)} / month</p>
            </div>
            <div>
              <p className="text-muted-foreground">Positions</p>
              <p className="font-medium">{formatNumber(trending.openPositions)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
