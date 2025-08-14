import { create } from 'zustand'
import { Message, ChatState, ChatActions } from '@/types/chat.type'

interface ChatStore extends ChatState, ChatActions {}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  sendMessage: async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: content.trim(),
      isUser: true,
      timestamp: new Date(),
    }

    set(state => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null,
    }))

    try {
      const currentMessages = get().messages
      const history = currentMessages.map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.content,
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: content.trim(),
          history: history 
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: data.message,
        isUser: false,
        timestamp: new Date(data.timestamp),
      }

      set(state => ({
        messages: [...state.messages, aiMessage],
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '予期しないエラーが発生しました'
      
      const errorAiMessage: Message = {
        id: `error-${Date.now()}`,
        content: `申し訳ございません。エラーが発生しました: ${errorMessage}`,
        isUser: false,
        timestamp: new Date(),
      }

      set(state => ({
        messages: [...state.messages, errorAiMessage],
        error: errorMessage,
      }))
    } finally {
      set({ isLoading: false })
    }
  },

  clearMessages: () => {
    set({
      messages: [],
      error: null,
    })
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading })
  },

  setError: (error: string | null) => {
    set({ error })
  },
}))