# AI Chat - NextAuth認証とNeonデータベースを使用したチャットアプリ

NextAuth、Neonデータベース、Google Gemini APIを使用した高機能チャットアプリケーション。ユーザーごとの複数チャット管理とチャット履歴の永続化を実現します。

## 📱 アプリケーション画面

### メイン画面
![アプリケーション画面1](./public/image1.png)

### チャット機能
![アプリケーション画面2](./public/image2.png)

## 🚀 主な機能

### 🔐 認証機能
- **NextAuth**によるGoogleログイン
- セッションベースの認証管理
- ユーザー情報の表示とアクセス制御
- JWT + データベースセッション

### 💬 チャット機能
- **Google Gemini API**を使用したAI対話
- リアルタイム応答表示
- 文脈を理解した継続的な対話
- 未ログイン時の一時的なチャット

### 📊 データ管理
- **Neon PostgreSQL**による永続化
- **Prisma ORM**でのタイプセーフなデータ操作
- ユーザーごとのチャット履歴保存

### 🎨 ユーザーインターフェース
- **ChatGPT風のサイドバー**付きレイアウト
- 複数チャットの作成・選択・管理
- チャットタイトルの編集機能
- チャットの削除機能
- レスポンシブデザイン

## 🛠️ 技術スタック

### フロントエンド
- **Next.js 15** (App Router) - React フレームワーク
- **React 19** - UIライブラリ
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **Radix UI** - アクセシブルなUIコンポーネント
- **Lucide React** - アイコンライブラリ

### バックエンド・データベース
- **Next.js API Routes** - サーバーサイドAPI
- **Prisma ORM** - データベースORM
- **Neon PostgreSQL** - マネージドPostgreSQLデータベース

### 認証・API
- **NextAuth.js** - ユーザー認証・セッション管理
- **Google OAuth Provider** - Googleログイン
- **Google Gemini API** - AI チャット機能

### 開発環境
- **PostCSS** - CSS処理
- **Autoprefixer** - CSSベンダープレフィックス
- **Tailwindcss-animate** - アニメーション

## 📁 プロジェクト構成

```
ai-chat/
├── app/                      # Next.js App Router
│   ├── api/                 # API Routes
│   │   ├── chat/            # レガシーチャットAPI
│   │   ├── users/           # ユーザー管理API
│   │   └── chats/           # チャット・メッセージ管理API
│   ├── globals.css          # グローバルスタイル
│   ├── layout.tsx           # ルートレイアウト（AuthProvider含む）
│   └── page.tsx             # ホームページ
├── components/              # 共通UIコンポーネント
│   ├── ui/                  # Radix UIベースコンポーネント
│   ├── Auth.tsx             # 認証コンポーネント
│   └── ChatSidebar.tsx      # チャットサイドバー
├── context/                 # React Context
│   └── AuthContext.tsx      # NextAuth SessionProvider
├── features/                # 機能単位のコンポーネント
│   └── chat/
│       ├── Chat*.tsx        # チャット関連コンポーネント群
│       ├── ChatWithAuth*    # 認証付きチャット機能
│       └── components/      # チャット内部コンポーネント
├── hooks/                   # カスタムフック
│   ├── useUser.ts          # ユーザー管理フック
│   └── useChats.ts         # チャット管理フック
├── lib/                     # ライブラリ・ユーティリティ
│   ├── auth.ts             # NextAuth設定・ヘルパー関数
│   ├── prisma.ts           # Prismaクライアント
│   ├── gemini.ts           # Gemini API統合
│   └── utils.ts            # 汎用ユーティリティ
├── prisma/                  # Prisma設定
│   └── schema.prisma       # データベーススキーマ
├── store/                   # Zustand状態管理
│   └── chat.store.ts       # チャット状態管理
├── types/                   # 型定義
│   └── chat.type.ts        # チャット関連型
└── public/                  # 静的ファイル
    └── *.png               # 画像ファイル
```

## 🔧 セットアップ方法

### 1. プロジェクトクローン
```bash
git clone <repository-url>
cd ai-chat
npm install
```

### 2. 環境変数の設定
`.env.local`ファイルを作成し、以下を設定：

```bash
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Neon Database Configuration
DATABASE_URL=your_neon_database_url_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth Configuration (Google Cloud Console から取得)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 3. データベースセットアップ
```bash
# Prisma マイグレーション実行
npx prisma migrate dev --name init

# Prismaクライアント生成
npx prisma generate
```

### 4. アプリケーション起動
```bash
npm run dev
```

## 📋 API エンドポイント

### 認証
- `GET/POST /api/auth/[...nextauth]` - NextAuth API ルート

### ユーザー管理
- `GET /api/users?userId={userId}` - ユーザー情報取得（セッション認証）

### チャット管理
- `POST /api/chats` - チャット作成（セッション認証）
- `GET /api/chats` - ログインユーザーのチャット一覧（セッション認証）
- `GET /api/chats/[id]` - 特定チャット取得
- `DELETE /api/chats/[id]` - チャット削除
- `PATCH /api/chats/[id]` - チャットタイトル更新

### メッセージ管理
- `POST /api/chats/[id]/messages` - メッセージ送信（AI応答込み）

### レガシーAPI
- `POST /api/chat` - 一時的なチャット（ログイン不要）

## 💾 データベース構造

### Users テーブル（NextAuth管理）
- `id` (Primary Key)
- `email` (Unique)
- `name` (Optional)
- `image` (Optional)
- `emailVerified` (NextAuth)
- `createdAt`, `updatedAt`

### Accounts テーブル（NextAuth）
- OAuth プロバイダー情報
- `provider`, `providerAccountId`
- アクセストークン、リフレッシュトークン

### Sessions テーブル（NextAuth）
- セッション管理
- `sessionToken`, `expires`

### VerificationTokens テーブル（NextAuth）
- メール認証トークン

### Chats テーブル
- `id` (Primary Key)
- `title`
- `userId` (Foreign Key)
- `createdAt`, `updatedAt`

### Messages テーブル
- `id` (Primary Key)
- `content`
- `role` (USER | ASSISTANT)
- `chatId` (Foreign Key)
- `createdAt`

## 🎯 使用方法

1. **認証**: 「Googleでログイン」でサインイン
2. **チャット作成**: サイドバーの「+」ボタンで新規チャット作成
3. **メッセージ送信**: 入力エリアでメッセージ入力・送信
4. **チャット管理**: サイドバーでチャット選択・編集・削除
5. **未ログイン使用**: ログインなしでも一時的なチャット利用可能

## 🏗️ アーキテクチャパターン

### Container-Presentational パターン
- **Container** (`*.container.tsx`): データ取得・状態管理
- **Presentational** (`*.presentational.tsx`): UI表示専用
- **Custom Hooks** (`*.use.ts`): ビジネスロジック
