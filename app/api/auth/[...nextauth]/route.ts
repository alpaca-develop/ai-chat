import NextAuth from 'next-auth'
import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { FirebaseAuthProvider } from '@/lib/firebase-auth-provider'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    FirebaseAuthProvider,
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub
      }
      return session
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id
      }
      return token
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }