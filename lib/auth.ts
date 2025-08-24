import { NextAuthOptions, getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export { authOptions }

export const getServerAuthSession = () => getServerSession(authOptions)

export type AuthSession = {
  user?: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}