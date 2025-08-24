'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useChatsContext } from '@/contexts/ChatsContext'
import { Message } from '@/types/chat.type'

export const useChatWithAuth = () => {
  const { data: session } = useSession()
  const { 
    currentChat, 
    sendMessage: sendChatMessage, 
    createChat
  } = useChatsContext()
  
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 現在のチャットが変更されたときにメッセージを更新
  useEffect(() => {
    console.log('useEffect triggered - currentChat:', currentChat?.id, 'messages:', currentChat?.messages?.length)
    
    if (currentChat) {
      const formattedMessages: Message[] = currentChat.messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        isUser: msg.role === 'USER',
        timestamp: msg.createdAt
      }))
      
      console.log('Setting messages from currentChat:', formattedMessages.length)
      
      // 楽観的更新メッセージがある場合の処理
      setMessages(prev => {
        const hasOptimisticMessages = prev.some(msg => msg.id.startsWith('temp-'))
        
        if (hasOptimisticMessages && formattedMessages.length > 0) {
          // 楽観的メッセージをサーバーデータに置き換え
          console.log('Replacing optimistic messages with server data')
          return formattedMessages
        } else if (!hasOptimisticMessages) {
          // 楽観的メッセージがない場合は普通に更新
          return formattedMessages
        } else {
          // 楽観的メッセージがあるがサーバーデータがない場合は保持
          return prev
        }
      })
    } else {
      console.log('No currentChat - clearing messages')
      setMessages([])
    }
  }, [currentChat])

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      if (!session?.user) {
        // 未ログイン時は一時的なメッセージとして表示
        const tempUserMessage: Message = {
          id: Date.now().toString(),
          content: messageContent,
          isUser: true,
          timestamp: new Date().toISOString()
        }

        setMessages(prev => [...prev, tempUserMessage])

        // Gemini APIを直接呼び出し
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: messageContent,
            history: messages.map(msg => ({
              role: msg.isUser ? 'user' : 'assistant',
              content: msg.content
            }))
          }),
        })

        if (!response.ok) {
          throw new Error('メッセージの送信に失敗しました')
        }

        const data = await response.json()
        
        const tempAssistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.message,
          isUser: false,
          timestamp: data.timestamp
        }

        setMessages(prev => [...prev, tempAssistantMessage])
      } else {
        // ログイン時の処理
        let chatToUse = currentChat
        
        if (!chatToUse) {
          // 新規チャット作成が必要な場合
          console.log('No currentChat - creating new chat first')
          chatToUse = await createChat(messageContent.length > 30 ? messageContent.substring(0, 30) + '...' : messageContent)
          if (!chatToUse) {
            throw new Error('チャットの作成に失敗しました')
          }
          console.log('New chat created:', chatToUse.id)
          
          // createChatによってcurrentChatも更新されているはずだが、
          // 念のため状態が反映されるまで少し待つ
          await new Promise(resolve => setTimeout(resolve, 100))
        }

        // ユーザーメッセージを即座に表示（楽観的更新）
        const optimisticUserMessage: Message = {
          id: `temp-user-${Date.now()}`,
          content: messageContent,
          isUser: true,
          timestamp: new Date().toISOString()
        }
        setMessages(prev => [...prev, optimisticUserMessage])

        // チャットが決まってからメッセージを送信
        console.log('Sending message to chat:', chatToUse.id)
        const result = await sendChatMessage(chatToUse.id, messageContent)
        if (!result) {
          throw new Error('メッセージの送信に失敗しました')
        }
        console.log('Message sent successfully')

        // sendChatMessageによってcurrentChatが更新され、
        // useEffectが発火してサーバーからの正式なメッセージに置き換わる
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
      // エラー時は楽観的更新メッセージを削除
      setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-')))
    } finally {
      console.log('Setting isLoading to false')
      setIsLoading(false)
    }
  }

  const handleClearMessages = () => {
    if (!session?.user) {
      // 未ログイン時は一時的なメッセージをクリア
      setMessages([])
    }
    // ログイン時はチャット履歴があるのでクリアは無効
  }

  return {
    messages,
    isLoading,
    error,
    onSendMessage: handleSendMessage,
    onClearMessages: handleClearMessages,
  }
}