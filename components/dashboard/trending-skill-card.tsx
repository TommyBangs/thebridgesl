"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendIndicator } from "@/components/shared/trend-indicator"
import { SkillBadge } from "@/components/shared/skill-badge"
import { formatCurrency, formatNumber } from "@/lib/format"
import { useRouter } from "next/navigation"
import { TrendingUp, DollarSign, Briefcase } from "lucide-react"
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
    <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 hover:scale-[1.02] group" onClick={handleClick}>
      <CardContent className="p-5">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-semibold text-base">{name}</h4>
              </div>
              <SkillBadge name={category} category={category as any} variant="secondary" size="sm" />
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-2xl font-bold text-success">{trending.demandPercentage}%</span>
              <TrendIndicator value={trending.growthRate} size="sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-success/10">
                <DollarSign className="h-3.5 w-3.5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg. Salary</p>
                <p className="text-sm font-medium">{formatCurrency(trending.averageSalary)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Briefcase className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Openings</p>
                <p className="text-sm font-medium">{formatNumber(trending.openPositions)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
