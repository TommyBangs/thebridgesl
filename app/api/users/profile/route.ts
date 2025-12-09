import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const userId = getUserId(session)

    let user = await db.user.findUnique({
      where: { id: userId },
      include: {
        learnerProfile: true,
        userSkills: {
          include: {
            skill: true,
          },
        },
        credentials: {
          include: {
            credentialSkills: {
              include: {
                skill: true,
              },
            },
          },
        },
        projects: {
          include: {
            projectSkills: {
              include: {
                skill: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If learner profile doesn't exist, create it
    if (!user.learnerProfile) {
      try {
        await db.learnerProfile.create({
          data: {
            userId: user.id,
            skillsMatchPercentage: 0,
            verificationStatus: "UNVERIFIED",
          },
        })

        // Fetch user again with the newly created profile
        user = await db.user.findUnique({
          where: { id: userId },
          include: {
            learnerProfile: true,
            userSkills: {
              include: {
                skill: true,
              },
            },
            credentials: {
              include: {
                credentialSkills: {
                  include: {
                    skill: true,
                  },
                },
              },
            },
            projects: {
              include: {
                projectSkills: {
                  include: {
                    skill: true,
                  },
                },
              },
            },
          },
        })
      } catch (profileError: any) {
        console.error("Error creating learner profile:", profileError)
        // Continue even if profile creation fails - user object will still be returned
      }
    }

    // Ensure user object is returned even if profile is null
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    if (error.status === 401) {
      return error
    }
    console.error("Profile fetch error:", error)
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

    const { 
      name, 
      bio, 
      location, 
      phone,
      website,
      university, 
      major, 
      graduationYear, 
      currentJobTitle,
      currentCompany,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      avatar 
    } = body

    const user = await db.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(avatar !== undefined && { avatar }),
        learnerProfile: {
          upsert: {
            create: {
              ...(bio !== undefined && { bio }),
              ...(location !== undefined && { location }),
              ...(phone !== undefined && { phone }),
              ...(website !== undefined && { website }),
              ...(university !== undefined && { university }),
              ...(major !== undefined && { major }),
              ...(graduationYear !== undefined && { graduationYear }),
              ...(currentJobTitle !== undefined && { currentJobTitle }),
              ...(currentCompany !== undefined && { currentCompany }),
              ...(linkedinUrl !== undefined && { linkedinUrl }),
              ...(githubUrl !== undefined && { githubUrl }),
              ...(portfolioUrl !== undefined && { portfolioUrl }),
              skillsMatchPercentage: 0,
              verificationStatus: "UNVERIFIED",
            },
            update: {
              ...(bio !== undefined && { bio }),
              ...(location !== undefined && { location }),
              ...(phone !== undefined && { phone }),
              ...(website !== undefined && { website }),
              ...(university !== undefined && { university }),
              ...(major !== undefined && { major }),
              ...(graduationYear !== undefined && { graduationYear }),
              ...(currentJobTitle !== undefined && { currentJobTitle }),
              ...(currentCompany !== undefined && { currentCompany }),
              ...(linkedinUrl !== undefined && { linkedinUrl }),
              ...(githubUrl !== undefined && { githubUrl }),
              ...(portfolioUrl !== undefined && { portfolioUrl }),
            },
          },
        },
      },
      include: {
        learnerProfile: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error: any) {
    if (error.status === 401) {
      return error
    }
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

