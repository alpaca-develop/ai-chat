import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: chatId } = await params

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        },
        user: true
      }
    })

    if (!chat) {
      return NextResponse.json(
        { error: 'チャットが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(chat)
  } catch (error) {
    console.error('チャット取得エラー:', error)
    return NextResponse.json(
      { error: 'チャットの取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: chatId } = await params

    const chat = await prisma.chat.findUnique({
      where: { id: chatId }
    })

    if (!chat) {
      return NextResponse.json(
        { error: 'チャットが見つかりません' },
        { status: 404 }
      )
    }

    await prisma.chat.delete({
      where: { id: chatId }
    })

    return NextResponse.json({ message: 'チャットが削除されました' })
  } catch (error) {
    console.error('チャット削除エラー:', error)
    return NextResponse.json(
      { error: 'チャットの削除に失敗しました' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: chatId } = await params
    const { title } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'titleは必須です' },
        { status: 400 }
      )
    }

    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: { title },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    return NextResponse.json(updatedChat)
  } catch (error) {
    console.error('チャット更新エラー:', error)
    return NextResponse.json(
      { error: 'チャットの更新に失敗しました' },
      { status: 500 }
    )
  }
}