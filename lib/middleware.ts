import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export class AuthError extends Error {
  constructor(message: string = "Unauthorized") {
    super(message)
    this.name = "AuthError"
  }
}

export async function requireAuth(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      console.error("requireAuth - No session or user found")
      throw new AuthError("Unauthorized")
    }
    
    console.log("requireAuth - Session found:", {
      userId: session.user?.id,
      email: session.user?.email,
    })
    
    return session
  } catch (error: any) {
    console.error("requireAuth - Error:", error)
    throw error instanceof AuthError ? error : new AuthError("Unauthorized")
  }
}

export function getUserId(session: any): string {
  if (!session?.user?.id) {
    throw new Error("User ID not found in session")
  }
  return session.user.id
}

