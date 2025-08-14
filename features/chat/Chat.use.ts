import { useChatStore } from '@/store/chat.store'

export const useChat = () => {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages
  } = useChatStore()

  return {
    messages,
    isLoading,
    error,
    onSendMessage: sendMessage,
    onClearMessages: clearMessages
  }
}