'use client'

import React, { useRef, useEffect } from 'react'
import { Message } from '@/types/chat.type'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from './components/ChatMessage'
import { ChatInput } from './components/ChatInput'

interface ChatPresentationalProps {
  messages: Message[]
  isLoading: boolean
  error: string | null
  onSendMessage: (message: string) => Promise<void>
  onClearMessages: () => void
}

export const ChatPresentational: React.FC<ChatPresentationalProps> = ({
  messages,
  isLoading,
  error,
  onSendMessage,
  onClearMessages,
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      {/* デスクトップ用ヘッダー */}
      <div className="hidden lg:block border-b bg-background p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-xl font-semibold">alpa AI</h1>
              <p className="text-sm text-muted-foreground">何でもお聞きください</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={onClearMessages}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              履歴をクリア
            </button>
          )}
        </div>
      </div>
      
      {/* モバイル用シンプルヘッダー */}
      <div className="lg:hidden border-b bg-background px-4 py-2">
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">何でもお聞きください</p>
          {messages.length > 0 && (
            <button
              onClick={onClearMessages}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              履歴をクリア
            </button>
          )}
        </div>
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1 p-2 lg:p-4">
        <div className="space-y-3 lg:space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-sm lg:text-base">チャットを始めましょう！</p>
              <p className="text-xs lg:text-sm mt-2">下のテキストボックスにメッセージを入力してください。</p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-muted-foreground rounded-lg px-4 py-2 text-sm mr-12">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
              エラー: {error}
            </div>
          )}
        </div>
      </ScrollArea>

      <ChatInput 
        onSendMessage={onSendMessage} 
        disabled={isLoading}
      />
    </div>
  )
}