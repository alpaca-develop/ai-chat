'use client'

import React from 'react'
import { useChat } from './Chat.use'
import { ChatPresentational } from './Chat.presentational'

export const ChatContainer: React.FC = () => {
  const props = useChat()
  
  return <ChatPresentational {...props} />
}