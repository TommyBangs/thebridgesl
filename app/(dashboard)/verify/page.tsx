"use client"

import { useState, useEffect } from "react"
import { QrCode, Shield, Share2, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function VerifyPage() {
  const [credentials, setCredentials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCredential, setSelectedCredential] = useState<any>(null)
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchCredentials()
  }, [])

  const fetchCredentials = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/credentials")
      if (!response.ok) throw new Error("Failed to fetch credentials")
      const data = await response.json()
      setCredentials(data.credentials || [])
    } catch (error) {
      console.error("Error fetching credentials:", error)
      toast({
        title: "Error",
        description: "Failed to load credentials",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateQR = async (credential: any) => {
    try {
      setGenerating(true)
      setSelectedCredential(credential)
      const response = await fetch(`/api/credentials/${credential.id}/qr`)
      if (!response.ok) throw new Error("Failed to generate QR code")
      const data = await response.json()
      setQrCode(data.qrCode)
      setQrDialogOpen(true)
    } catch (error) {
      console.error("Error generating QR code:", error)
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleShareLink = (credential: any) => {
    const verificationUrl = `${window.location.origin}/verify/${credential.id}`
    navigator.clipboard.writeText(verificationUrl)
    toast({
      title: "Link copied",
      description: "Verification link copied to clipboard",
    })
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <PageHeader title="Verify" description="Manage your verified credentials and share them securely" />
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  const verifiedCredentials = credentials.filter((c) => c.verified)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader title="Verify" description="Manage your verified credentials and share them securely" />

      {/* QR Code Generator */}
      {verifiedCredentials.length > 0 && (
        <section className="animate-in slide-in-from-bottom-4">
          <h2 className="mb-4 text-xl font-bold">My Verifiable Credentials</h2>
          <Card className="transition-smooth hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                Generate QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-6 md:flex-row">
                <div className="flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted transition-all">
                  {qrCode && qrCode.startsWith("data:image") ? (
                    <img src={qrCode} alt="QR Code" className="h-full w-full object-contain" />
                  ) : (
                    <QrCode className="h-24 w-24 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="font-semibold">Share Your Credentials</h3>
                    <p className="text-sm text-muted-foreground">
                      Generate a QR code to share your verified credentials with employers and institutions
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => verifiedCredentials[0] && handleGenerateQR(verifiedCredentials[0])}
                      disabled={generating}
                    >
                      <QrCode className="mr-2 h-4 w-4" />
                      {generating ? "Generating..." : "Generate QR Code"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => verifiedCredentials[0] && handleShareLink(verifiedCredentials[0])}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Link
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Verified Credentials */}
      <section>
        <h2 className="mb-4 text-xl font-bold">Blockchain-Verified Credentials</h2>
        {verifiedCredentials.length === 0 ? (
          <Card className="p-12 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No verified credentials</h3>
            <p className="text-sm text-muted-foreground">Your verified credentials will appear here</p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {verifiedCredentials.map((credential, index) => (
              <Link key={credential.id} href={`/credentials/${credential.id}`}>
                <Card
                  className={`transition-smooth hover:shadow-md hover:border-primary cursor-pointer animate-in scale-in`}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{credential.title}</h3>
                          <p className="text-sm text-muted-foreground">{credential.issuer}</p>
                        </div>
                        {credential.verified && (
                          <Badge className="gap-1 bg-success text-success-foreground">
                            <Shield className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      {credential.blockchainHash && (
                        <div className="rounded-lg bg-muted p-3">
                          <p className="text-xs text-muted-foreground">Blockchain Hash</p>
                          <p className="font-mono text-xs truncate">{credential.blockchainHash}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={(e) => {
                            e.preventDefault()
                            handleGenerateQR(credential)
                          }}
                        >
                          <QrCode className="mr-2 h-3 w-3" />
                          QR Code
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={(e) => {
                            e.preventDefault()
                            handleShareLink(credential)
                          }}
                        >
                          <Share2 className="mr-2 h-3 w-3" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code for {selectedCredential?.title}</DialogTitle>
            <DialogDescription>Scan this QR code to verify the credential</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {qrCode && qrCode.startsWith("data:image") ? (
              <img src={qrCode} alt="QR Code" className="h-64 w-64" />
            ) : (
              <div className="flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed bg-muted">
                <QrCode className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
            {qrCode && !qrCode.startsWith("data:image") && (
              <p className="text-sm text-muted-foreground break-all text-center">{qrCode}</p>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (qrCode && qrCode.startsWith("data:image")) {
                    const link = document.createElement("a")
                    link.href = qrCode
                    link.download = `qr-${selectedCredential?.id}.png`
                    link.click()
                  }
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const url = qrCode?.startsWith("data:image") ? qrCode : `${window.location.origin}/verify/${selectedCredential?.id}`
                  navigator.clipboard.writeText(url)
                  toast({
                    title: "Copied",
                    description: "QR code data copied to clipboard",
                  })
                }}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
