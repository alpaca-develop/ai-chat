import { ChatPageServer } from "@/features/chat/ChatPage.server"

export default async function HomePage() {
  return (
    <main>
      <ChatPageServer />
    </main>
  )
}