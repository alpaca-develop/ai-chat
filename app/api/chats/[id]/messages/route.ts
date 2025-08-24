import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { replyWithHistory } from '@/lib/gemini'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: chatId } = await params
    const { content, role } = await request.json()

    if (!content || !role) {
      return NextResponse.json(
        { error: 'contentとroleは必須です' },
        { status: 400 }
      )
    }

    if (!['USER', 'ASSISTANT'].includes(role)) {
      return NextResponse.json(
        { error: '無効なroleです' },
        { status: 400 }
      )
    }

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!chat) {
      return NextResponse.json(
        { error: 'チャットが見つかりません' },
        { status: 404 }
      )
    }

    const userMessage = await prisma.message.create({
      data: {
        content,
        role,
        chatId,
      }
    })

    if (role === 'USER') {
      const history = chat.messages.map(msg => ({
        role: msg.role === 'USER' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }))

      const aiResponse = await replyWithHistory(history, content)

      const assistantMessage = await prisma.message.create({
        data: {
          content: aiResponse,
          role: 'ASSISTANT',
          chatId,
        }
      })

      // これが最初のメッセージの場合、チャットタイトルを更新
      const isFirstMessage = chat.messages.length === 0
      const updateData: any = { updatedAt: new Date() }
      
      if (isFirstMessage) {
        // ユーザーの最初のメッセージをタイトルにする（最大30文字）
        const title = content.length > 30 ? content.substring(0, 30) + '...' : content
        updateData.title = title
      }

      const updatedChat = await prisma.chat.update({
        where: { id: chatId },
        data: updateData,
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          }
        }
      })

      return NextResponse.json({
        userMessage,
        assistantMessage,
        updatedChat,
        timestamp: new Date().toISOString()
      }, { status: 201 })
    }

    return NextResponse.json(userMessage, { status: 201 })
  } catch (error) {
    console.error('メッセージ作成エラー:', error)
    return NextResponse.json(
      { error: 'メッセージの作成に失敗しました' },
      { status: 500 }
    )
  }
}