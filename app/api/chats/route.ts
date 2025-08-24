import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerAuthSession, AuthSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession() as AuthSession
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    const { title } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'titleは必須です' },
        { status: 400 }
      )
    }

    const newChat = await prisma.chat.create({
      data: {
        title,
        userId: session.user.id,
      },
      include: {
        messages: true
      }
    })

    return NextResponse.json(newChat, { status: 201 })
  } catch (error) {
    console.error('チャット作成エラー:', error)
    return NextResponse.json(
      { error: 'チャットの作成に失敗しました' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession() as AuthSession
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    const chats = await prisma.chat.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    return NextResponse.json(chats)
  } catch (error) {
    console.error('チャット取得エラー:', error)
    return NextResponse.json(
      { error: 'チャットの取得に失敗しました' },
      { status: 500 }
    )
  }
}