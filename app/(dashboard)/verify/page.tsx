"use client"

import { useState } from "react"
import { QrCode, Shield, Share2, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { mockCredentials } from "@/lib/mock-data"
import Link from "next/link"

export default function VerifyPage() {
  const [qrGenerated, setQrGenerated] = useState(false)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader title="Verify" description="Manage your verified credentials and share them securely" />

      {/* QR Code Generator */}
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
              <div
                className={`flex h-48 w-48 items-center justify-center rounded-lg border-2 ${qrGenerated ? "border-primary" : "border-dashed border-border"} bg-muted transition-all`}
              >
                <QrCode className={`h-24 w-24 ${qrGenerated ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-semibold">Share Your Credentials</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate a QR code to share your verified credentials with employers and institutions
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setQrGenerated(true)}>
                    <QrCode className="mr-2 h-4 w-4" />
                    Generate QR Code
                  </Button>
                  <Button variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Link
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Verified Credentials */}
      <section>
        <h2 className="mb-4 text-xl font-bold">Blockchain-Verified Credentials</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {mockCredentials.map((credential, index) => (
            <Link key={credential.id} href={`/credentials/${credential.id}`}>
              <Card
                className={`transition-smooth hover:shadow-md hover:border-primary cursor-pointer animate-in scale-in stagger-${(index % 4) + 1}`}
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
                        onClick={(e) => e.preventDefault()}
                      >
                        <Download className="mr-2 h-3 w-3" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={(e) => e.preventDefault()}
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
      </section>

      {/* Verification History */}
      <Card>
        <CardHeader>
          <CardTitle>Verification History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { entity: "TechCorp Inc.", credential: "AWS Certification", date: "2 days ago", status: "approved" },
              {
                entity: "University Registrar",
                credential: "Degree Verification",
                date: "1 week ago",
                status: "approved",
              },
              { entity: "StartupXYZ", credential: "All Credentials", date: "2 weeks ago", status: "approved" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-border p-4 transition-smooth hover:border-primary hover:bg-primary/5"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.entity}</p>
                  <p className="text-sm text-muted-foreground">Verified {item.credential}</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    {item.status}
                  </Badge>
                  <p className="mt-1 text-xs text-muted-foreground">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
