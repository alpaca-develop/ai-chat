'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChatsContext } from '@/contexts/ChatsContext'
import { useSession } from 'next-auth/react'
import { Auth } from './Auth'
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Edit3,
  Check,
  X,
  Menu
} from 'lucide-react'

interface ChatSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ isOpen = true, onClose }) => {
  const { data: session } = useSession()
  const { 
    chats, 
    currentChat, 
    createChat, 
    deleteChat, 
    updateChatTitle,
    setCurrentChat,
    fetchChat
  } = useChatsContext()
  
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateChat = async () => {
    setIsCreating(true)
    const newChat = await createChat('新しいチャット')
    if (newChat) {
      setCurrentChat(newChat)
    }
    setIsCreating(false)
  }

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('このチャットを削除しますか？')) {
      await deleteChat(chatId)
    }
  }

  const handleEditStart = (chat: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingChatId(chat.id)
    setEditTitle(chat.title)
  }

  const handleEditSave = async (chatId: string) => {
    if (editTitle.trim()) {
      await updateChatTitle(chatId, editTitle.trim())
    }
    setEditingChatId(null)
    setEditTitle('')
  }

  const handleEditCancel = () => {
    setEditingChatId(null)
    setEditTitle('')
  }

  if (!session?.user) {
    return (
      <div className={`flex h-full w-80 lg:w-80 md:w-72 sm:w-64 flex-col border-r bg-gray-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed lg:relative z-30 lg:z-auto lg:translate-x-0`}>
        {/* モバイル用クローズボタン */}
        <div className="lg:hidden flex justify-end p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* ロゴ */}
        <div className="flex flex-col items-center p-4 lg:p-6 border-b">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-12 h-12 lg:w-16 lg:h-16 mb-2 lg:mb-4 object-contain"
          />
          <h1 className="text-lg lg:text-xl font-bold text-gray-800 mb-2 lg:mb-4">alpa AI</h1>
          <p className="text-xs lg:text-sm text-gray-600 text-center mb-2 lg:mb-4 px-2">
            ログインしてチャット履歴を保存
          </p>
        </div>

        {/* 空のスペース */}
        <div className="flex-1"></div>

        {/* ユーザー情報 */}
        <div className="border-t p-4">
          <Auth />
        </div>
      </div>
    )
  }

  return (
    <div className={`flex h-full w-80 lg:w-80 md:w-72 sm:w-64 flex-col border-r bg-gray-50 transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } fixed lg:relative z-30 lg:z-auto lg:translate-x-0`}>
      {/* モバイル用クローズボタン */}
      <div className="lg:hidden flex justify-end p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* ロゴ */}
      <div className="flex flex-col items-center p-3 lg:p-4 border-b">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="w-10 h-10 lg:w-12 lg:h-12 mb-2 object-contain"
        />
        <h1 className="text-base lg:text-lg font-bold text-gray-800">alpa AI</h1>
      </div>

      {/* チャットリスト */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {/* 新しいチャット項目 */}
          <div
            onClick={handleCreateChat}
            className={`group flex items-center rounded-lg p-3 cursor-pointer transition-colors ${
              isCreating
                ? 'bg-gray-200 cursor-not-allowed'
                : 'hover:bg-gray-100 border-2 border-dashed border-gray-300'
            }`}
          >
            <Plus className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600">
                {isCreating ? '作成中...' : '新しいチャット'}
              </p>
            </div>
          </div>

          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => fetchChat(chat.id)}
              className={`group flex items-center rounded-lg p-3 cursor-pointer transition-colors ${
                currentChat?.id === chat.id
                  ? 'bg-blue-100 border border-blue-200'
                  : 'hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                {editingChatId === chat.id ? (
                  <div className="flex items-center space-x-1">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleEditSave(chat.id)
                        } else if (e.key === 'Escape') {
                          handleEditCancel()
                        }
                      }}
                      className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditSave(chat.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleEditCancel}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {chat.messages.length > 0 
                        ? `${chat.messages.length}件のメッセージ` 
                        : '新しいチャット'
                      }
                    </p>
                  </>
                )}
              </div>

              {editingChatId !== chat.id && (
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleEditStart(chat, e)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* ユーザー情報 */}
      <div className="border-t p-4">
        <Auth />
      </div>
    </div>
  )
}