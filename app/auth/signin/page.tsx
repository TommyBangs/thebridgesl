"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Logo } from "@/components/shared/logo"

export default function SignInPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation
    if (!formData.email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    if (!formData.password.trim()) {
      toast({
        title: "Password Required",
        description: "Please enter your password",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      console.log("[SignIn] Attempting to sign in with email:", formData.email.trim())
      const result = await signIn("credentials", {
        email: formData.email.trim(),
        password: formData.password,
        redirect: false,
      })

      console.log("[SignIn] Sign in result:", { error: result?.error, ok: result?.ok, url: result?.url })

      if (result?.error) {
        // Map known server error codes/messages to user-friendly toasts
        const code = result.error
        let errorTitle = "Login Failed"
        let errorDescription = "Unable to sign in. Please try again."

        switch (code) {
          case "ACCOUNT_NOT_FOUND":
            errorTitle = "Account Not Found"
            errorDescription = "No account found with this email. Please sign up first."
            break
          case "INVALID_PASSWORD":
            errorTitle = "Incorrect Password"
            errorDescription = "The password you entered is incorrect. Please try again."
            break
          case "MISSING_EMAIL_AND_PASSWORD":
            errorTitle = "Missing Information"
            errorDescription = "Please enter both email and password."
            break
          case "MISSING_EMAIL":
            errorTitle = "Email Required"
            errorDescription = "Please enter your email address."
            break
          case "MISSING_PASSWORD":
            errorTitle = "Password Required"
            errorDescription = "Please enter your password."
            break
          case "DATABASE_ERROR":
            errorTitle = "Connection Error"
            errorDescription = "Unable to connect to the database. Please try again later."
            break
          case "Configuration":
            errorTitle = "Configuration Error"
            errorDescription = "Authentication is not properly configured. Please check that AUTH_SECRET or NEXTAUTH_SECRET is set in your environment variables."
            break
          default:
            // Fallback to the message if NextAuth passes it through
            if (code && code !== "CredentialsSignin") {
              errorDescription = code
            }
        }

        toast({
          title: errorTitle,
          description: errorDescription,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Signed in successfully",
        })

        // After signing in, check onboarding status to route appropriately
        try {
          const res = await fetch("/api/users/onboarding", { cache: "no-store" })
          if (res.ok) {
            const data = await res.json()
            if (!data.completed) {
              router.push("/onboarding")
              return
            }
          }
        } catch (err) {
          // If check fails, fall through to default home redirect
        }

        router.push("/")
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Logo variant="full" size="md" />
          </div>
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
            <p className="text-sm text-center text-muted-foreground">
              <Link href="/auth/forgot-password" className="text-primary hover:underline">
                Forgot your password?
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

