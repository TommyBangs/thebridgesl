import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const userId = getUserId(session)

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        learnerProfile: {
          select: {
            bio: true,
            location: true,
            university: true,
            major: true,
            graduationYear: true,
          },
        },
      },
    })

    // Check if profile has any data (onboarding can be considered complete if they have some info)
    const hasProfileData = user?.learnerProfile && (
      user.learnerProfile.bio ||
      user.learnerProfile.location ||
      user.learnerProfile.university ||
      user.learnerProfile.major
    )

    return NextResponse.json({ 
      completed: !!hasProfileData,
      hasProfileData: !!hasProfileData 
    })
  } catch (error: any) {
    if (error.status === 401) {
      return error
    }
    console.error("Onboarding status fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const userId = getUserId(session)
    const body = await request.json()

    // For now, we'll just ensure the learner profile exists
    // The actual onboarding completion is tracked by having profile data
    await db.learnerProfile.upsert({
      where: { userId },
      create: {
        userId,
        skillsMatchPercentage: 0,
        verificationStatus: "UNVERIFIED",
      },
      update: {},
    })

    return NextResponse.json({ completed: true })
  } catch (error: any) {
    if (error.status === 401) {
      return error
    }
    console.error("Onboarding completion error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

