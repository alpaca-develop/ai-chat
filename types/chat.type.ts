export interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: string
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
}

export interface ChatActions {
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}