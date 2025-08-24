'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { signIn, signOut, useSession } from 'next-auth/react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getIdToken } from 'firebase/auth'
import { auth } from '@/lib/firebase-client'
import { User, LogOut, Mail } from 'lucide-react'

// 環境変数から新規登録機能の有効/無効を取得
const ENABLE_USER_REGISTRATION = process.env.NEXT_PUBLIC_ENABLE_USER_REGISTRATION === 'true'

export const Auth = () => {
  const { data: session, status } = useSession()
  const [showForm, setShowForm] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFirebaseAuth = async (email: string, password: string, isSignUp: boolean) => {
    try {
      setLoading(true)
      
      let userCredential
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password)
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password)
      }
      
      const user = userCredential.user
      const idToken = await getIdToken(user)
      
      // NextAuthにFirebase ID Tokenを渡してログイン
      await signIn('firebase', { idToken, redirect: false })
      
      setShowForm(false)
      setEmail('')
      setPassword('')
    } catch (error: any) {
      console.error('認証エラー:', error)
      let errorMessage = '認証に失敗しました'
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'このメールアドレスは既に使用されています'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'パスワードは6文字以上で設定してください'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = '有効なメールアドレスを入力してください'
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'メールアドレスまたはパスワードが正しくありません'
      }
      
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      handleFirebaseAuth(email, password, isSignUp)
    }
  }

  const handleSignOut = () => {
    signOut()
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
    )
  }

  if (session?.user) {
    return (
      <div className="flex flex-col space-y-2 lg:space-y-3">
        <div className="flex items-center space-x-2">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || ''}
              className="h-6 w-6 lg:h-8 lg:w-8 rounded-full flex-shrink-0"
            />
          ) : (
            <div className="flex h-6 w-6 lg:h-8 lg:w-8 items-center justify-center rounded-full bg-gray-200 flex-shrink-0">
              <User className="h-3 w-3 lg:h-4 lg:w-4" />
            </div>
          )}
          <span className="text-xs lg:text-sm font-medium truncate min-w-0">
            {session.user.name || session.user.email}
          </span>
        </div>
        <Button onClick={handleSignOut} variant="outline" size="sm" className="w-full text-xs lg:text-sm">
          <LogOut className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
          ログアウト
        </Button>
      </div>
    )
  }

  if (showForm) {
    return (
      <div className="w-full">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
              required
            />
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
              required
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              size="sm" 
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs lg:text-sm"
            >
              {loading ? '処理中...' : isSignUp ? '登録' : 'ログイン'}
            </Button>
            {ENABLE_USER_REGISTRATION && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                className="flex-1 text-xs lg:text-sm"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'ログイン' : '新規登録'}
              </Button>
            )}
          </div>
          
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            className="w-full text-xs lg:text-sm"
            onClick={() => setShowForm(false)}
          >
            キャンセル
          </Button>
        </form>
      </div>
    )
  }

  return (
    <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 w-full text-xs lg:text-sm">
      <Mail className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
      メール/パスワードでログイン
    </Button>
  )
}