import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId, requireIssuerRole } from "@/lib/middleware"
import { db } from "@/lib/db"
import { z } from "zod"
import { hashCredential } from "@/lib/blockchain/hash"
import { anchorHash } from "@/lib/blockchain/solana"
import { getSolanaConfig } from "@/lib/blockchain/config"

const credentialSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  type: z.enum(["CERTIFICATION", "DEGREE", "BADGE", "COURSE_COMPLETION", "PROJECT"]),
  issueDate: z.string(),
  expiryDate: z.string().optional(),
  skills: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request)
    const userId = getUserId(session)

    const credentials = await db.credential.findMany({
      where: { userId },
      include: {
        credentialSkills: {
          include: {
            skill: true,
          },
        },
      },
      orderBy: {
        issueDate: "desc",
      },
    })

    return NextResponse.json({ credentials })
  } catch (error: any) {
    if (error.status === 401) {
      return error
    }
    console.error("Credentials fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Allow both INSTITUTION role (for issuing) and regular users (for adding their own credentials)
    const session = await requireAuth(request)
    const userId = getUserId(session)
    const body = await request.json()

    const validatedData = credentialSchema.parse(body)

    // Create credential first
    const credential = await db.credential.create({
      data: {
        userId,
        title: validatedData.title,
        issuer: validatedData.issuer,
        type: validatedData.type,
        issueDate: new Date(validatedData.issueDate),
        expiryDate: validatedData.expiryDate ? new Date(validatedData.expiryDate) : null,
        credentialSkills: validatedData.skills
          ? {
            create: validatedData.skills.map((skillId) => ({
              skillId,
            })),
          }
          : undefined,
        ...({ blockchainStatus: "pending" } as any), // Will be updated after anchoring
      },
      include: {
        credentialSkills: {
          include: {
            skill: true,
          },
        },
      },
    })

    // Compute hash and attempt to anchor on blockchain
    try {
      // Fetch credential with skills for hash computation
      const credentialWithSkills = await db.credential.findUnique({
        where: { id: credential.id },
        include: {
          credentialSkills: {
            include: {
              skill: true,
            },
          },
        },
      })

      if (!credentialWithSkills) {
        throw new Error("Credential not found after creation")
      }

      const hash = hashCredential({
        id: credentialWithSkills.id,
        userId: credentialWithSkills.userId,
        issuer: credentialWithSkills.issuer,
        title: credentialWithSkills.title,
        type: credentialWithSkills.type,
        issueDate: credentialWithSkills.issueDate,
        expiryDate: credentialWithSkills.expiryDate,
        skills: credentialWithSkills.credentialSkills.map((cs) => cs.skill.id),
        createdAt: credentialWithSkills.createdAt,
      })

      // Attempt to anchor (with retry logic built into anchorHash)
      const { signature, explorerUrl } = await anchorHash(hash)
      const config = getSolanaConfig()

      // Update credential with blockchain data
      const updatedCredential = await db.credential.update({
        where: { id: credential.id },
        data: {
          blockchainHash: hash,
          ...({
            blockchainTxId: signature,
            blockchainStatus: "anchored",
            blockchainChain: `solana-${config.cluster}`,
          } as any),
        },
        include: {
          credentialSkills: {
            include: {
              skill: true,
            },
          },
        },
      })

      return NextResponse.json(
        {
          credential: updatedCredential,
          blockchain: {
            txId: signature,
            explorerUrl,
            chain: `solana-${config.cluster}`,
          },
        },
        { status: 201 }
      )
    } catch (anchorError: any) {
      // Log error but don't block credential creation
      console.error("[Credential Creation] Blockchain anchoring failed:", anchorError)

      // Update credential with failed status
      await db.credential.update({
        where: { id: credential.id },
        data: {
          ...({ blockchainStatus: "failed" } as any),
        },
      })

      // Return credential anyway (blockchain is optional)
      return NextResponse.json(
        {
          credential,
          blockchain: {
            status: "failed",
            error: "Failed to anchor on blockchain. Credential created but not yet verified.",
          },
        },
        { status: 201 }
      )
    }
  } catch (error: any) {
    if (error.status === 401 || error.status === 403) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Credential creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

