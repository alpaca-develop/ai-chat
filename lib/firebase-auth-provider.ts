import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { adminAuth } from './firebase-admin'
import { prisma } from './prisma'

export const FirebaseAuthProvider = CredentialsProvider({
  id: 'firebase',
  name: 'Firebase',
  credentials: {
    idToken: { label: 'ID Token', type: 'text' },
  },
  async authorize(credentials) {
    if (!credentials?.idToken) return null

    try {
      // Firebase ID Token を検証
      const decodedToken = await adminAuth.verifyIdToken(credentials.idToken)
      
      if (!decodedToken) return null

      // ユーザー情報を取得
      const firebaseUser = await adminAuth.getUser(decodedToken.uid)

      // データベースでユーザーを検索または作成
      let user = await prisma.user.findFirst({
        where: {
          accounts: {
            some: {
              provider: 'firebase',
              providerAccountId: firebaseUser.uid,
            },
          },
        },
      })

      if (!user) {
        // 新規ユーザーの場合は作成
        user = await prisma.user.create({
          data: {
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            image: firebaseUser.photoURL,
            accounts: {
              create: {
                type: 'oauth',
                provider: 'firebase',
                providerAccountId: firebaseUser.uid,
              },
            },
          },
        })
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      }
    } catch (error) {
      console.error('Firebase authentication error:', error)
      return null
    }
  },
})