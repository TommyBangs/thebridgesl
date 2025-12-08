import db from "@/lib/db"
import { SkillLevel } from "@prisma/client"

export const skillService = {
    /**
     * Get all skills with optional search
     */
    async getSkills(search?: string) {
        return await db.skill.findMany({
            where: search
                ? {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                }
                : undefined,
            orderBy: {
                name: "asc",
            },
            take: 50,
        })
    },

    /**
     * Get trending skills
     */
    async getTrendingSkills() {
        return await db.trendingSkill.findMany({
            include: {
                skill: true,
            },
            orderBy: {
                growthRate: "desc",
            },
            take: 10,
        })
    },

    /**
     * Add skill to user profile
     */
    async addUserSkill(userId: string, skillId: string, level: SkillLevel) {
        return await db.userSkill.create({
            data: {
                userId,
                skillId,
                level,
            },
        })
    },

    /**
     * Verify a user's skill (e.g. via endorsement or assessment)
     */
    async verifyUserSkill(userId: string, skillId: string) {
        return await db.userSkill.update({
            where: {
                userId_skillId: {
                    userId,
                    skillId,
                },
            },
            data: {
                verified: true,
            },
        })
    },
}
