'use client'

import React, { createContext, useContext } from 'react'
import { useChats } from '@/hooks/useChats'

const ChatsContext = createContext<ReturnType<typeof useChats> | null>(null)

export const ChatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const chatsState = useChats()
  return <ChatsContext.Provider value={chatsState}>{children}</ChatsContext.Provider>
}

export const useChatsContext = () => {
  const context = useContext(ChatsContext)
  if (!context) {
    throw new Error('useChatsContext must be used within a ChatsProvider')
  }
  return context
}