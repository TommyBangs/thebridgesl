import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const credential = await db.credential.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                credentialSkills: {
                    include: {
                        skill: true,
                    },
                },
            },
        })

        if (!credential) {
            return NextResponse.json(
                { error: "Credential not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            credential: {
                id: credential.id,
                title: credential.title,
                issuer: credential.issuer,
                type: credential.type.toLowerCase().replace("_", "-"),
                issueDate: credential.issueDate.toISOString(),
                expiryDate: credential.expiryDate?.toISOString(),
                verified: credential.verified,
                blockchainHash: credential.blockchainHash,
                qrCode: credential.qrCode,
                user: {
                    id: credential.user.id,
                    name: credential.user.name,
                    email: credential.user.email,
                    avatar: credential.user.avatar,
                },
                skills: credential.credentialSkills.map((cs: any) => ({
                    id: cs.skill.id,
                    name: cs.skill.name,
                })),
            },
        })
    } catch (error: any) {
        console.error("Credential fetch error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

