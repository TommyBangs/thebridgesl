import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId, AuthError } from "@/lib/middleware"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log("Profile API - Starting request")
    
    // Get session with better error handling
    let session
    try {
      session = await requireAuth(request)
      console.log("Profile API - Session obtained:", !!session)
    } catch (authError: any) {
      console.error("Profile API - Auth error:", authError)
      if (authError instanceof AuthError) {
        return NextResponse.json(
          { error: "Unauthorized", message: "Please sign in to view your profile" },
          { status: 401 }
        )
      }
      return NextResponse.json(
        { error: "Authentication failed", message: authError.message || "Unable to verify your identity" },
        { status: 401 }
      )
    }
    
    // Get user ID with better error handling
    let userId: string
    try {
      userId = getUserId(session)
      console.log("Profile API - User ID:", userId)
    } catch (idError: any) {
      console.error("Profile API - User ID error:", idError)
      return NextResponse.json(
        { error: "Invalid session", message: "Your session is invalid. Please sign in again." },
        { status: 401 }
      )
    }

    // Fetch user with error handling
    let user
    try {
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
    } catch (dbError: any) {
      console.error("Profile API - Database error:", dbError)
      return NextResponse.json(
        { error: "Database error", message: "Unable to fetch user data. Please try again later." },
        { status: 500 }
      )
    }

    if (!user) {
      console.error("Profile API - User not found for ID:", userId)
      // Try to find user by email as fallback
      const sessionUser = session?.user
      if (sessionUser?.email) {
        console.log("Profile API - Trying to find user by email:", sessionUser.email)
        try {
          const userByEmail = await db.user.findUnique({
            where: { email: sessionUser.email },
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
          if (userByEmail) {
            console.log("Profile API - Found user by email:", userByEmail.email)
            user = userByEmail
          }
        } catch (emailError: any) {
          console.error("Profile API - Error finding user by email:", emailError)
        }
      }
      
      if (!user) {
        return NextResponse.json(
          { error: "User not found", message: "Your account could not be found. Please contact support." },
          { status: 404 }
        )
      }
    }
    
    console.log("Profile API - User found:", user.email)

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
        try {
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
        } catch (refetchError: any) {
          console.error("Profile API - Error refetching user after profile creation:", refetchError)
          // Continue with existing user object
        }
      } catch (profileError: any) {
        console.error("Profile API - Error creating learner profile:", profileError)
        // Continue even if profile creation fails - user object will still be returned
      }
    }

    // Ensure user object is returned even if profile is null
    if (!user) {
      return NextResponse.json(
        { error: "User not found", message: "Unable to load your profile. Please try again." },
        { status: 404 }
      )
    }

    // Return success response
    return NextResponse.json({ user }, { status: 200 })
  } catch (error: any) {
    // Catch-all error handler
    console.error("Profile API - Unexpected error:", error)
    console.error("Profile API - Error stack:", error?.stack)
    
    // Ensure we always return valid JSON
    const errorMessage = error?.message || "Internal server error"
    const statusCode = error?.status || 500
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: errorMessage,
        details: process.env.NODE_ENV === "development" ? error?.stack : undefined
      },
      { status: statusCode }
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
    // Handle authentication errors
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.status || 500 }
    )
  }
}

