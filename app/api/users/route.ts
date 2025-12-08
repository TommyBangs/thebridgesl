import { NextResponse } from "next/server"
import { userService } from "@/lib/services/user-service"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        // Basic validation (in a real app, use Zod)
        if (!body.email || !body.name || !body.password || !body.role) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Hash password (placeholder - in real app use bcrypt/argon2)
        const passwordHash = body.password // TODO: Hash this!

        const user = await userService.createUser({
            email: body.email,
            name: body.name,
            passwordHash,
            role: body.role,
            avatar: body.avatar,
        })

        return NextResponse.json(user, { status: 201 })
    } catch (error) {
        console.error("Error creating user:", error)
        return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
        )
    }
}
