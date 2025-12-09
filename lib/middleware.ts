import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function requireAuth(request: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  return session
}

export function getUserId(session: any): string {
  if (!session?.user?.id) {
    throw new Error("User ID not found in session")
  }
  return session.user.id
}

