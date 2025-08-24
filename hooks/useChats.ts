'use client'

import { useState, useEffect } from 'react'
import { useUser } from './useUser'

interface Chat {
  id: string
  title: string
  userId: string
  createdAt: string
  updatedAt: string
  messages: Message[]
}

interface Message {
  id: string
  content: string
  role: 'USER' | 'ASSISTANT'
  createdAt: string
  chatId: string
}

export const useChats = () => {
  const { session } = useUser()
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchChats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/chats')
      
      if (response.ok) {
        const chatsData = await response.json()
        setChats(chatsData)
      }
    } catch (error) {
      console.error('チャット取得エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const createChat = async (title: string): Promise<Chat | null> => {
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
        }),
      })

      if (response.ok) {
        const newChat = await response.json()
        setChats(prev => [newChat, ...prev])
        setCurrentChat(newChat) // 新しく作成したチャットを現在のチャットに設定
        return newChat
      }
    } catch (error) {
      console.error('チャット作成エラー:', error)
    }
    return null
  }

  const deleteChat = async (chatId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setChats(prev => prev.filter(chat => chat.id !== chatId))
        if (currentChat?.id === chatId) {
          setCurrentChat(null)
        }
        return true
      }
    } catch (error) {
      console.error('チャット削除エラー:', error)
    }
    return false
  }

  const updateChatTitle = async (chatId: string, title: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      })

      if (response.ok) {
        const updatedChat = await response.json()
        setChats(prev => prev.map(chat => 
          chat.id === chatId ? updatedChat : chat
        ))
        if (currentChat?.id === chatId) {
          setCurrentChat(updatedChat)
        }
        return true
      }
    } catch (error) {
      console.error('チャットタイトル更新エラー:', error)
    }
    return false
  }

  const sendMessage = async (chatId: string, content: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          role: 'USER',
        }),
      })

      if (response.ok) {
        const result = await response.json()
        
        // メッセージ送信先のチャットが現在選択中のチャットか、新規作成したチャットの場合に更新
        // 新規作成直後の場合、currentChatがまだ更新されていない可能性があるため、chatIdで確実に更新
        const shouldUpdateCurrentChat = currentChat?.id === chatId || !currentChat
        
        if (shouldUpdateCurrentChat) {
          console.log('Updating currentChat after message send, chatId:', chatId, 'hasUpdatedChat:', !!result.updatedChat)
          // サーバーから返された完全なチャット情報を使用
          if (result.updatedChat) {
            setCurrentChat(result.updatedChat)
          } else {
            // フォールバック: チャット情報を再取得
            console.log('No updatedChat in response - refetching chat')
            const chatResponse = await fetch(`/api/chats/${chatId}`)
            if (chatResponse.ok) {
              const updatedChat = await chatResponse.json()
              setCurrentChat(updatedChat)
            }
          }
        }
        
        // チャット履歴を更新（非同期で実行）
        fetchChats()

        return result
      }
    } catch (error) {
      console.error('メッセージ送信エラー:', error)
    }
    return null
  }

  const fetchChat = async (chatId: string): Promise<Chat | null> => {
    try {
      const response = await fetch(`/api/chats/${chatId}`)
      
      if (response.ok) {
        const chat = await response.json()
        setCurrentChat(chat)
        return chat
      }
    } catch (error) {
      console.error('チャット取得エラー:', error)
    }
    return null
  }

  useEffect(() => {
    if (session?.user) {
      fetchChats()
    } else {
      setChats([])
      setCurrentChat(null)
    }
  }, [session])

  return {
    chats,
    currentChat,
    loading,
    createChat,
    deleteChat,
    updateChatTitle,
    sendMessage,
    fetchChat,
    setCurrentChat,
    refreshChats: fetchChats,
  }
}