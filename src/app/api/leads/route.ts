import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface LeadData {
    email: string
    first_name?: string
    last_name?: string
    company_name?: string
    phone?: string
    team_size?: string
    service_interest?: string
    main_challenge?: string
    source: 'form' | 'chatbot' | 'readiness_check'
    readiness_score?: number
    readiness_answers?: Record<string, unknown>
    chatbot_conversation_id?: string
    chatbot_summary?: string
}

function calculateLeadScore(data: LeadData): number {
    let score = 0

    // Base score by source
    if (data.source === 'readiness_check') score += 40
    if (data.source === 'chatbot') score += 30
    if (data.source === 'form') score += 20

    // Team size scoring
    if (data.team_size === '11-25') score += 15
    if (data.team_size === '26-50') score += 20
    if (data.team_size === '50+') score += 10

    // Service interest scoring
    if (data.service_interest === 'build') score += 10
    if (data.service_interest === 'both') score += 15

    // Readiness check completion
    if (data.readiness_score !== undefined) {
        score += Math.min(20, Math.floor(data.readiness_score / 5))
    }

    return score
}

export async function POST(request: Request) {
    try {
        const data: LeadData = await request.json()

        // Validate required fields
        if (!data.email || typeof data.email !== 'string') {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(data.email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
        }

        // Calculate lead score
        const leadScore = calculateLeadScore(data)

        // Check if lead already exists
        const existingLead = await prisma.lead.findFirst({
            where: { email: data.email },
            select: { id: true }
        })

        if (existingLead) {
            // Update existing lead
            await prisma.lead.update({
                where: { id: existingLead.id },
                data: {
                    firstName: data.first_name || undefined,
                    lastName: data.last_name || undefined,
                    companyName: data.company_name || undefined,
                    phone: data.phone || undefined,
                    teamSize: data.team_size || undefined,
                    serviceInterest: data.service_interest || undefined,
                    mainChallenge: data.main_challenge || undefined,
                    leadScore: leadScore,
                    updatedAt: new Date(),
                }
            })

            return NextResponse.json({ success: true, leadId: existingLead.id, updated: true })
        }

        // Create new lead
        const newLead = await prisma.lead.create({
            data: {
                email: data.email,
                firstName: data.first_name,
                lastName: data.last_name,
                companyName: data.company_name,
                phone: data.phone,
                teamSize: data.team_size,
                serviceInterest: data.service_interest,
                mainChallenge: data.main_challenge,
                source: data.source,
                leadScore: leadScore,
                status: 'new',
                readinessScore: data.readiness_score,
                readinessAnswers: data.readiness_answers as any,
                chatbotConversationId: data.chatbot_conversation_id,
                chatbotSummary: data.chatbot_summary,
            }
        })

        // Log creation event
        await prisma.leadEvent.create({
            data: {
                leadId: newLead.id,
                eventType: 'lead_created',
                eventData: { source: data.source, score: leadScore } as any,
            }
        })

        return NextResponse.json({ success: true, leadId: newLead.id })
    } catch (error) {
        console.error('Leads API error:', error)
        return NextResponse.json(
            { error: 'Failed to save lead' },
            { status: 500 }
        )
    }
}
