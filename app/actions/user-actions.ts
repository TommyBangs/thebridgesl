'use server'

import { userService } from "@/lib/services/user-service"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createUserAction(formData: FormData) {
    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as "student" | "institution" | "employer"

    if (!email || !name || !password || !role) {
        return { error: "Missing required fields" }
    }

    try {
        // In a real app, hash the password here
        const passwordHash = password

        await userService.createUser({
            email,
            name,
            passwordHash,
            role,
        })
    } catch (error) {
        console.error("Failed to create user:", error)
        return { error: "Failed to create user" }
    }

    redirect("/dashboard")
}

export async function updateUserProfileAction(userId: string, data: { bio?: string; location?: string }) {
    try {
        await userService.updateLearnerProfile(userId, data)
        revalidatePath("/profile")
        return { success: true }
    } catch (error) {
        console.error("Failed to update profile:", error)
        return { error: "Failed to update profile" }
    }
}
