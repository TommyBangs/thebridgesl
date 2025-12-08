import db from "@/lib/db"
import { User, LearnerProfile, Prisma } from "@prisma/client"

export const userService = {
    /**
     * Create a new user with an optional learner profile
     */
    async createUser(data: {
        email: string
        name: string
        passwordHash: string
        role: "student" | "institution" | "employer"
        avatar?: string
    }) {
        return await db.user.create({
            data: {
                email: data.email,
                name: data.name,
                passwordHash: data.passwordHash,
                role: data.role,
                avatar: data.avatar,
                // Create empty learner profile if student
                learnerProfile:
                    data.role === "student"
                        ? {
                            create: {},
                        }
                        : undefined,
            },
            include: {
                learnerProfile: true,
            },
        })
    },

    /**
     * Get user by ID with profile and skills
     */
    async getUserById(userId: string) {
        return await db.user.findUnique({
            where: { id: userId },
            include: {
                learnerProfile: true,
                userSkills: {
                    include: {
                        skill: true,
                    },
                },
                credentials: true,
                projects: true,
            },
        })
    },

    /**
     * Get user by Email
     */
    async getUserByEmail(email: string) {
        return await db.user.findUnique({
            where: { email },
        })
    },

    /**
     * Update learner profile
     */
    async updateLearnerProfile(userId: string, data: Prisma.LearnerProfileUpdateInput) {
        return await db.learnerProfile.update({
            where: { userId },
            data,
        })
    },

    /**
     * Get user's feed
     */
    async getUserFeed(userId: string) {
        return await db.feedItem.findMany({
            where: { userId },
            orderBy: { timestamp: "desc" },
            take: 20,
        })
    },
}
