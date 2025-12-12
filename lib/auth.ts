import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "./db"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Normalize inputs
        const email = credentials?.email?.toString().trim().toLowerCase() || ""
        const password = credentials?.password?.toString() || ""

        // Basic presence checks with explicit error codes
        if (!email && !password) {
          // NextAuth surfaces this string in `result.error`
          throw new Error("MISSING_EMAIL_AND_PASSWORD")
        }
        if (!email) {
          throw new Error("MISSING_EMAIL")
        }
        if (!password) {
          throw new Error("MISSING_PASSWORD")
        }

        const user = await db.user.findUnique({
          where: { email },
          include: { learnerProfile: true },
        })

        if (!user) {
          // Explicit code so the client can show “account not registered”
          throw new Error("ACCOUNT_NOT_FOUND")
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
        if (!isPasswordValid) {
          // Explicit code for wrong password
          throw new Error("INVALID_PASSWORD")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

