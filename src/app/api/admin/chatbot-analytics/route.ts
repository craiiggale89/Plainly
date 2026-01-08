import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    await headers()

    try {
        // Get total unique conversations
        const conversationsResult = await prisma.chatbotMessage.groupBy({
            by: ['conversationId'],
        })
        const totalConversations = conversationsResult.length

        // Get total messages
        const totalMessages = await prisma.chatbotMessage.count()

        // Get user messages only (engagement metric)
        const userMessages = await prisma.chatbotMessage.count({
            where: { role: 'user' }
        })

        // Get messages from last 7 days
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const recentMessages = await prisma.chatbotMessage.count({
            where: {
                createdAt: { gte: sevenDaysAgo }
            }
        })

        const recentConversationsResult = await prisma.chatbotMessage.groupBy({
            by: ['conversationId'],
            where: {
                createdAt: { gte: sevenDaysAgo }
            }
        })
        const recentConversations = recentConversationsResult.length

        // Get recent conversation previews (last 10 unique conversations)
        const recentConversationIds = await prisma.chatbotMessage.findMany({
            select: { conversationId: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
            distinct: ['conversationId'],
            take: 10
        })

        const conversationPreviews = await Promise.all(
            recentConversationIds.map(async ({ conversationId }) => {
                const messages = await prisma.chatbotMessage.findMany({
                    where: { conversationId },
                    orderBy: { createdAt: 'asc' },
                    take: 3
                })

                const messageCount = await prisma.chatbotMessage.count({
                    where: { conversationId }
                })

                return {
                    conversationId,
                    messageCount,
                    startedAt: messages[0]?.createdAt,
                    preview: messages[0]?.content?.slice(0, 100) + (messages[0]?.content?.length > 100 ? '...' : '')
                }
            })
        )

        return NextResponse.json({
            totalConversations,
            totalMessages,
            userMessages,
            recentConversations,
            recentMessages,
            conversationPreviews
        })
    } catch (error) {
        console.error('Failed to fetch chatbot analytics:', error)
        return NextResponse.json(
            { error: 'Failed to fetch chatbot analytics' },
            { status: 500 }
        )
    }
}
