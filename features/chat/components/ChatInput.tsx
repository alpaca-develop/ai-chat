import React, { useState, KeyboardEvent, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>
  disabled?: boolean
  enterToSend?: boolean // Enterキーで送信するかどうか
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  enterToSend = false, // デフォルトはEnterで送信禁止
}) => {
  const [inputValue, setInputValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 高さを自動調整
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`
    }
  }, [inputValue])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || disabled) return
    
    const message = inputValue.trim()
    setInputValue('')
    await onSendMessage(message)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enterキーでの送信は常に禁止
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      // 単純なEnterキーは送信せず、改行のみ
      return
    }
    
    // Ctrl+Enter(またはCmd+Enter)でのみ送信
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="border-t bg-background p-3 lg:p-4 safe-area-inset-bottom">
      <div className="flex gap-2 max-w-4xl mx-auto items-end">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled 
              ? '送信中...' 
              : 'メッセージを入力してください... (Ctrl+Enterで送信)'
          }
          disabled={disabled}
          className="flex-1 min-h-[40px] lg:min-h-[44px] max-h-24 lg:max-h-32 px-3 py-2 text-sm lg:text-base border border-input bg-background rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 touch-manipulation"
          rows={1}
        />
        <Button
          onClick={handleSendMessage}
          disabled={disabled || !inputValue.trim()}
          size="icon"
          className="h-10 w-10 lg:h-11 lg:w-11 flex-shrink-0"
        >
          <Send size={14} className="lg:w-4 lg:h-4" />
        </Button>
      </div>
      <div className="text-xs text-muted-foreground text-center mt-2 lg:hidden">
        Ctrl+Enterで送信
      </div>
    </div>
  )
}