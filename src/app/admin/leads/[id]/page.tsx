// Skip static generation - requires env vars at runtime
export const dynamic = 'force-dynamic'

import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import LeadDetail from './LeadDetail'

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    // Fetch lead with related notes and events using Prisma
    const lead = await prisma.lead.findUnique({
        where: { id },
        include: {
            notes: {
                orderBy: { createdAt: 'desc' }
            },
            events: {
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!lead) {
        notFound()
    }

    // Format lead to match UI expectations
    const formattedLead = {
        id: lead.id,
        email: lead.email,
        first_name: lead.firstName,
        last_name: lead.lastName,
        company_name: lead.companyName,
        phone: lead.phone,
        team_size: lead.teamSize,
        service_interest: lead.serviceInterest,
        main_challenge: lead.mainChallenge,
        source: lead.source,
        lead_score: lead.leadScore || 0,
        status: lead.status || 'new',
        readiness_score: lead.readinessScore,
        readiness_answers: lead.readinessAnswers as Record<string, unknown> | null,
        chatbot_conversation_id: lead.chatbotConversationId,
        chatbot_summary: lead.chatbotSummary,
        created_at: lead.createdAt.toISOString(),
        updated_at: lead.updatedAt.toISOString(),
    }

    // Format notes
    const formattedNotes = lead.notes.map(note => ({
        id: note.id,
        note: note.note,
        created_at: note.createdAt.toISOString()
    }))

    // Format events
    const formattedEvents = lead.events.map(event => ({
        id: event.id,
        event_type: event.eventType,
        event_data: event.eventData as Record<string, unknown> | null,
        created_at: event.createdAt.toISOString()
    }))

    return (
        <LeadDetail
            lead={formattedLead}
            notes={formattedNotes}
            events={formattedEvents}
        />
    )
}
