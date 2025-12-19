"use client"

import { QrCode, Shield, Download, Share2, Calendar, Award, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/shared/page-header"
import { formatDate } from "@/lib/format"
import type { Credential } from "@/types"

interface CredentialViewClientProps {
  credential: Omit<Credential, "skills"> & {
    skills: { id: string; name: string }[]
  }
  userName: string
}

export default function CredentialViewClient({ credential, userName }: CredentialViewClientProps) {
  const handleDownload = () => {
    // In production, this would generate and download a PDF
    console.log("[v0] Downloading credential:", credential.id)
  }

  const handleShare = () => {
    // In production, this would open share dialog or copy link
    console.log("[v0] Sharing credential:", credential.id)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Credential Verification"
        description="Digital certificate with blockchain verification"
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button size="sm" className="w-full sm:w-auto" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Certificate Display */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden border-2 border-primary/20">
            <CardContent className="p-0">
              {/* Certificate Design */}
              <div className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 sm:p-12">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=800')] opacity-5" />

                <div className="relative space-y-6 text-center sm:space-y-8">
                  {/* Header */}
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <div className="rounded-full bg-primary/10 p-3 sm:p-4">
                        <Award className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
                      </div>
                    </div>
                    <h1 className="text-xl font-bold text-foreground sm:text-3xl">Certificate of Achievement</h1>
                    {credential.verified && (
                      <Badge className="gap-1 bg-success text-success-foreground">
                        <Shield className="h-3 w-3" />
                        Blockchain Verified
                      </Badge>
                    )}
                  </div>

                  {/* Credential Title */}
                  <div className="space-y-3 sm:space-y-4">
                    <p className="text-base text-muted-foreground sm:text-lg">This certifies that</p>
                    <h2 className="text-2xl font-bold text-primary sm:text-4xl">{userName}</h2>
                    <p className="text-base text-muted-foreground sm:text-lg">has successfully completed</p>
                    <h3 className="text-lg font-semibold text-foreground sm:text-2xl">{credential.title}</h3>
                  </div>

                  {/* Issuer Info */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Issued by</p>
                    <p className="text-lg font-semibold text-foreground sm:text-xl">{credential.issuer}</p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(credential.issueDate)}</span>
                    </div>
                  </div>

                  {/* Decorative Border */}
                  <div className="mt-6 border-t-2 border-primary/20 pt-4 sm:mt-8">
                    <p className="text-xs text-muted-foreground">Credential ID: {credential.id.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Covered */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="mb-4 font-semibold">Skills & Competencies</h3>
              <div className="flex flex-wrap gap-2">
                {credential.skills.map((skill) => (
                  <Badge key={skill.id} variant="secondary" className="px-3 py-1">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Sidebar */}
        <div className="space-y-6">
          {/* QR Code Verification */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <QrCode className="mx-auto h-5 w-5 text-primary" />
                  <h3 className="mt-2 font-semibold">Scan to Verify</h3>
                  <p className="text-sm text-muted-foreground">Instant verification with blockchain</p>
                </div>

                {/* QR Code */}
                <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted">
                  <QrCode className="h-32 w-32 text-muted-foreground" />
                </div>

                <Button className="w-full bg-transparent" variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Verify Online
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Blockchain Details */}
          {credential.blockchainHash && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-success" />
                    <h3 className="font-semibold">Blockchain Verified</h3>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Transaction Hash</p>
                    <div className="rounded-lg bg-muted p-3">
                      <p className="break-all font-mono text-xs">{credential.blockchainHash}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Verification Status</p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                      <span className="text-sm font-medium text-success">Active & Verified</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Credential Info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-semibold">Credential Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credential ID</span>
                  <span className="font-mono">{credential.id.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issue Date</span>
                  <span>{formatDate(credential.issueDate)}</span>
                </div>
                {credential.expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expiry Date</span>
                    <span>{formatDate(credential.expiryDate)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    Valid
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
