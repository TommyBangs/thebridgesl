import { NextRequest, NextResponse } from "next/server"
import { requireAuth, getUserId } from "@/lib/middleware"
import { db } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await requireAuth(request)
        const userId = getUserId(session)
        const { id } = await params

        const credential = await db.credential.findUnique({
            where: { id },
        })

        if (!credential) {
            return NextResponse.json(
                { error: "Credential not found" },
                { status: 404 }
            )
        }

        if (credential.userId !== userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            )
        }

        // Generate QR code data URL
        const verificationUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/verify/${id}`

        let qrCode: string | null = null

        try {
            // Use qrcode library to generate QR code
            const QRCode = await import("qrcode")
            qrCode = await QRCode.default.toDataURL(verificationUrl, {
                errorCorrectionLevel: 'M',
                type: 'image/png',
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            })
        } catch (e) {
            // If library fails, return URL for client-side generation
            console.error("QR code generation error:", e)
        }

        // Update credential with QR code if generated
        if (qrCode) {
            await db.credential.update({
                where: { id },
                data: { qrCode },
            })
        }

        return NextResponse.json({
            qrCode: qrCode || verificationUrl, // Return data URL or verification URL
            verificationUrl,
        })
    } catch (error: any) {
        console.error("QR code generation error:", error)
        if (error.status === 401) {
            return error
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

