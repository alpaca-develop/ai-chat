import React from 'react'
import { ChatWithAuthContainer } from './ChatWithAuth.container'

interface ChatPageServerProps {
  initialMessages?: Array<{
    id: string
    content: string
    isUser: boolean
    timestamp: string
  }>
}

export async function ChatPageServer({ initialMessages = [] }: ChatPageServerProps) {
  const serverInfo = {
    timestamp: new Date().toISOString(),
    userAgent: 'Server',
  }

  return (
    <div className="h-screen">
      <div className="hidden" data-server-info={JSON.stringify(serverInfo)} />
      <ChatWithAuthContainer />
    </div>
  )
}