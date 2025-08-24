import React, { useState } from 'react'
import { ChatSidebar } from '@/components/ChatSidebar'
import { ChatPresentational } from './Chat.presentational'
import { Message } from '@/types/chat.type'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

interface ChatWithAuthPresentationalProps {
  messages: Message[]
  isLoading: boolean
  error: string | null
  onSendMessage: (message: string) => Promise<void>
  onClearMessages: () => void
}

export const ChatWithAuthPresentational: React.FC<ChatWithAuthPresentationalProps> = ({
  messages,
  isLoading,
  error,
  onSendMessage,
  onClearMessages,
}) => {
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen relative">
      {/* オーバーレイ (モバイル用) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <ChatSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col">
        {/* モバイル用ヘッダー */}
        <div className="lg:hidden flex items-center p-4 border-b bg-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="mr-3 h-8 w-8 p-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">alpa AI</h1>
        </div>
        
        <div className="flex-1">
          {session?.user ? (
            <ChatPresentational
              messages={messages}
              isLoading={isLoading}
              error={error}
              onSendMessage={onSendMessage}
              onClearMessages={onClearMessages}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-4 p-4">
              <div className="text-center max-w-md mx-auto">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-700 mb-2">
                  ようこそ！
                </h2>
                <p className="text-sm lg:text-base text-gray-500 mb-4">
                  ログインしてチャット履歴を保存し、複数のチャットを管理しましょう
                </p>
                <div className="mb-4">
                  <img src="/logo.png" alt="Logo" className="w-12 h-12 lg:w-16 lg:h-16 mx-auto" />
                </div>
                <p className="text-xs lg:text-sm text-gray-400">
                  ログインせずに一時的なチャットも利用できます
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}