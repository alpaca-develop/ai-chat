'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AuthSession } from '@/lib/auth'

interface User {
  id: string
  email: string
  name?: string
  image?: string
  chats: Chat[]
}

interface Chat {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: Message[]
}

interface Message {
  id: string
  content: string
  role: 'USER' | 'ASSISTANT'
  createdAt: string
}

export const useUser = () => {
  const { data: session, status } = useSession() as { data: AuthSession | null, status: string }
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchUser = async (userId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users?userId=${userId}`)
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error('ユーザー取得エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchUser(session.user.id)
    } else {
      setUser(null)
    }
  }, [session])

  const refreshUser = () => {
    if (session?.user?.id) {
      fetchUser(session.user.id)
    }
  }

  return {
    user,
    loading: loading || status === 'loading',
    refreshUser,
    session,
  }
}