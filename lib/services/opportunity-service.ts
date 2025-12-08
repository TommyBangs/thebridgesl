import db from "@/lib/db"
import { OpportunityType, ApplicationStatus } from "@prisma/client"

export const opportunityService = {
    /**
     * Get opportunities with filtering
     */
    async getOpportunities(filters?: {
        type?: OpportunityType
        remote?: boolean
        search?: string
    }) {
        return await db.opportunity.findMany({
            where: {
                type: filters?.type,
                remote: filters?.remote,
                OR: filters?.search
                    ? [
                        { title: { contains: filters.search, mode: "insensitive" } },
                        { company: { contains: filters.search, mode: "insensitive" } },
                    ]
                    : undefined,
            },
            include: {
                skills: {
                    include: {
                        skill: true,
                    },
                },
            },
            orderBy: {
                postedDate: "desc",
            },
        })
    },

    /**
     * Get opportunity by ID
     */
    async getOpportunityById(id: string) {
        return await db.opportunity.findUnique({
            where: { id },
            include: {
                skills: {
                    include: {
                        skill: true,
                    },
                },
                requirements: true,
            },
        })
    },

    /**
     * Apply to an opportunity
     */
    async applyToOpportunity(userId: string, opportunityId: string, coverLetter?: string) {
        return await db.application.create({
            data: {
                userId,
                opportunityId,
                status: ApplicationStatus.applied,
                coverLetter,
            },
        })
    },

    /**
     * Get user's applications
     */
    async getUserApplications(userId: string) {
        return await db.application.findMany({
            where: { userId },
            include: {
                opportunity: true,
            },
            orderBy: {
                appliedAt: "desc",
            },
        })
    },
}
