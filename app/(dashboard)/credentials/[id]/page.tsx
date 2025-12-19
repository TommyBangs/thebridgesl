import { notFound } from "next/navigation"
import CredentialViewClient from "./credential-client"

export default async function CredentialViewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/credentials/${id}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      notFound()
    }

    const data = await response.json()
    const credential = data.credential

    if (!credential) {
      notFound()
    }

    return <CredentialViewClient credential={credential} userName={credential.user.name} />
  } catch (error) {
    console.error("Error fetching credential:", error)
    notFound()
  }
}
