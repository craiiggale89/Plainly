import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import OpenAI from 'openai'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Lazy-load OpenAI client to avoid build-time errors
let openai: OpenAI | null = null

function getOpenAI() {
    if (!openai) {
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    }
    return openai
}

const SYSTEM_PROMPT = `You are the AI assistant for Enablr, a UK-based company that helps small businesses use AI practically and confidently.

Your role is to:
1. Answer questions about Enablr's services (team upskilling on everyday AI tools, and custom automations/apps)
2. Help visitors understand whether AI training, a custom build, or both might suit them
3. Qualify interest by asking about their team size, current AI use, and goals
4. Encourage qualified visitors to request a discovery call via the form on our homepage or start the AI readiness check

Your tone:
- Calm, professional, and practical.
- Supportive, grounded, and forward-looking.
- START ANSWERS DIRECTLY. DO NOT WAVE. DO NOT SAY "HELLO".
- STRICTLY NO EMOJIS.
- Do not act like a "friendly assistant". Act like a sensible business advisor.
- Never use hype or dramatic language.
- Plain English only, no jargon (don't say "LLM", "neural network", "NLP" etc.)
- Be honest if something is outside your knowledge; suggest a discovery call (via the homepage form) for complex questions

Guardrails:
- Do not provide legal, financial, HR, or medical advice
- Do not ask for or store sensitive personal data (passwords, payment info, health info)
- Keep responses concise (under 100 words unless asked to elaborate)
- If asked about pricing, say "Training typically starts from £500 and builds vary by scope, so you can request a discovery call on our homepage for a proper quote"

When to transition:
- After 3-4 qualifying exchanges, encourage requesting a discovery call via our homepage form
- If they seem interested, ask for their name, email, and company to have someone follow up
- Always offer the AI readiness check as a self-serve alternative

Services offered:
1. AI Readiness & Team Upskilling: Training teams on ChatGPT, Microsoft Copilot, Google Workspace AI. Focus on practical skills, safe use, and ongoing support.
2. Custom Automations & Apps: Building internal tools, dashboards, and automations tailored to the client's workflows.

Based in Birmingham, UK. No lock-in contracts. Clear, upfront pricing.`

interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
}

export async function POST(request: Request) {
    // Explicitly call headers() to ensure Next.js treats this as dynamic
    await headers()

    try {
        const { message, conversationId, history } = await request.json()

        if (!process.env.OPENAI_API_KEY) {
            console.error('OPENAI_API_KEY is not defined')
            return NextResponse.json(
                { error: 'Service configuration error' },
                { status: 500 }
            )
        }

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        // Limit message length
        if (message.length > 1000) {
            return NextResponse.json({ error: 'Message too long' }, { status: 400 })
        }

        // Limit conversation history
        const limitedHistory = (history as ChatMessage[]).slice(-10)

        // Check message count limit (50 per conversation)
        if (limitedHistory.length >= 50) {
            return NextResponse.json({
                message: "We've been chatting for a while! For more detailed help, I'd recommend booking a discovery call where you can speak with someone from the team directly."
            })
        }

        // Build messages for OpenAI
        const messages: OpenAI.ChatCompletionMessageParam[] = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...limitedHistory.map(msg => ({
                role: msg.role as 'user' | 'assistant',
                content: msg.content,
            })),
            { role: 'user', content: message },
        ]

        // Call OpenAI
        const completion = await getOpenAI().chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
            max_tokens: 300,
            temperature: 0.3,
        })

        const assistantMessage = completion.choices[0]?.message?.content ||
            "I'm having trouble responding right now. Please try again or book a discovery call."

        // Store messages in Prisma (non-blocking)
        storeMessages(conversationId, message, assistantMessage).catch(console.error)

        return NextResponse.json({ message: assistantMessage })
    } catch (error) {
        console.error('Chat API error:', error)
        return NextResponse.json(
            { error: 'Failed to process message' },
            { status: 500 }
        )
    }
}

async function storeMessages(
    conversationId: string,
    userMessage: string,
    assistantMessage: string
) {
    const data = [
        {
            conversationId: conversationId,
            role: 'user',
            content: userMessage,
        },
        {
            conversationId: conversationId,
            role: 'assistant',
            content: assistantMessage,
        },
    ]

    await prisma.chatbotMessage.createMany({
        data,
    })
}
