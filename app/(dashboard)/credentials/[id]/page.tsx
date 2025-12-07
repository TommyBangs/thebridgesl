import { notFound } from "next/navigation"
import CredentialViewClient from "./credential-client"
import { mockCredentials } from "@/lib/mock-data"

export function generateStaticParams() {
  return mockCredentials.map((credential) => ({
    id: credential.id,
  }))
}

export default async function CredentialViewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const credential = mockCredentials.find((c) => c.id === id)

  if (!credential) {
    notFound()
  }

  return <CredentialViewClient credential={credential} />
}
