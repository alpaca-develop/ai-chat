import { type NextRequest, NextResponse } from 'next/server'
import { replyWithHistory, type ChatHistory } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'メッセージが必要です' },
        { status: 400 }
      )
    }

    if (message.trim().length === 0) {
      return NextResponse.json(
        { error: '空のメッセージは送信できません' },
        { status: 400 }
      )
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: 'メッセージが長すぎます（1000文字以内）' },
        { status: 400 }
      )
    }

    if (!Array.isArray(history)) {
      return NextResponse.json(
        { error: '履歴の形式が正しくありません' },
        { status: 400 }
      )
    }

    const validatedHistory: ChatHistory[] = history.filter(
      (item): item is ChatHistory => 
        typeof item === 'object' && 
        item !== null &&
        ['user', 'assistant'].includes(item.role) &&
        typeof item.content === 'string'
    )

    const aiResponse = await replyWithHistory(validatedHistory, message)

    return NextResponse.json({
      message: aiResponse,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Chat API エラー:', error)
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : '内部サーバーエラーが発生しました'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}