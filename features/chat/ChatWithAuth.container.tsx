'use client'

import { ChatsProvider } from '@/contexts/ChatsContext'
import { ChatWithAuthPresentational } from './ChatWithAuth.presentational'
import { useChatWithAuth } from './ChatWithAuth.use'

const ChatWithAuthContainerInner = () => {
  const props = useChatWithAuth()
  return <ChatWithAuthPresentational {...props} />
}

export const ChatWithAuthContainer = () => {
  return (
    <ChatsProvider>
      <ChatWithAuthContainerInner />
    </ChatsProvider>
  )
}