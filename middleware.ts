import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthPage = pathname.startsWith("/auth")
  const isApiRoute = pathname.startsWith("/api")
  const isPublicRoute = pathname === "/" || pathname.startsWith("/public")

  // Allow public routes and API routes
  if (isPublicRoute || isApiRoute) {
    return NextResponse.next()
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && req.auth) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Protect dashboard routes
  if (!isAuthPage && !req.auth) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}

