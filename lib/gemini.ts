import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY環境変数が設定されていません')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const MODEL = 'gemini-1.5-flash'

export interface ChatHistory {
  role: 'user' | 'assistant'
  content: string
}

export async function replyWithHistory(
  history: ChatHistory[],
  userInput: string,
  systemInstruction?: string
): Promise<string> {
  try {
    const contents = [
      ...history.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      { 
        role: 'user' as const, 
        parts: [{ text: userInput }] 
      },
    ]

    const model = genAI.getGenerativeModel({
      model: MODEL,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.8,
        maxOutputTokens: 1000,
      },
      systemInstruction: systemInstruction || 'あなたは親切で知識豊富なAIアシスタントです。日本語で自然に会話してください。',
    })

    const result = await model.generateContent({
      contents,
    })

    const response = result.response
    const text = response.text()
    
    if (!text || text.trim() === '') {
      throw new Error('空の応答が返されました')
    }
    
    return text.trim()
  } catch (error) {
    console.error('Gemini API エラー:', error)
    throw new Error('AI応答の生成中にエラーが発生しました')
  }
}

export async function generateResponse(message: string): Promise<string> {
  return replyWithHistory([], message)
}