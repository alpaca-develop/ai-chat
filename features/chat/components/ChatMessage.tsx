import React from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

interface ChatMessageProps {
  message: string
  isUser: boolean
  timestamp: string
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isUser,
  timestamp,
}) => {
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      if (isNaN(date.getTime())) {
        return '--:--'
      }
      return new Intl.DateTimeFormat('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    } catch (error) {
      return '--:--'
    }
  }

  return (
    <div
      className={cn(
        'flex gap-2 lg:gap-3 max-w-full lg:max-w-4xl',
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
    >
      <Avatar className="h-6 w-6 lg:h-8 lg:w-8 mt-1 flex-shrink-0">
        <AvatarFallback className={cn(
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-secondary text-secondary-foreground'
        )}>
          {isUser ? <User size={12} className="lg:w-4 lg:h-4" /> : <Bot size={12} className="lg:w-4 lg:h-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn('flex flex-col gap-1 min-w-0', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-lg px-3 lg:px-4 py-2 text-sm lg:text-sm leading-relaxed max-w-full break-words',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap break-words">{message}</div>
          ) : (
            <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0">
              <ReactMarkdown 
                components={{
                  // リスト項目のスタイルをカスタマイズ
                  ul: ({children}) => <ul className="list-disc list-inside space-y-0">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal list-inside space-y-0">{children}</ol>,
                  li: ({children}) => <li className="ml-0">{children}</li>,
                  // 段落のマージンを調整
                  p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                  // 見出しのスタイル
                  h1: ({children}) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                  h2: ({children}) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                  h3: ({children}) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                  // 強調のスタイル
                  strong: ({children}) => <strong className="font-bold">{children}</strong>,
                  em: ({children}) => <em className="italic">{children}</em>,
                  // コードのスタイル
                  code: ({children}) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                  pre: ({children}) => <pre className="bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto">{children}</pre>,
                }}
              >
                {message}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {formatTime(timestamp)}
        </span>
      </div>
    </div>
  )
}