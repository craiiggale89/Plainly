// Skip static generation - requires env vars at runtime
export const dynamic = 'force-dynamic'

import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import ContentDetail from './ContentDetail'

interface Props {
    params: Promise<{ id: string }>
}

export default async function ContentDetailPage({ params }: Props) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    // Fetch content page via Prisma
    const page = await prisma.contentPage.findUnique({
        where: { id }
    })

    if (!page) {
        notFound()
    }

    // Map Prisma data to match the expected interface
    const formattedPage = {
        id: page.id,
        title: page.title,
        url: page.url,
        primary_topic: page.primaryTopic,
        location_focus: page.locationFocus,
        status: page.status || 'draft',
        last_reviewed: page.lastReviewed?.toISOString() || null,
        next_review_date: page.nextReviewDate?.toISOString() || null,
        review_notes: page.reviewNotes,
        page_views: page.pageViews,
        cta_clicks: page.ctaClicks,
        ai_summary: page.aiSummary,
        ai_generated_at: page.aiGeneratedAt?.toISOString() || null,
        suggested_local_phrases: page.suggestedLocalPhrases as string[] | null,
        suggested_keywords: page.suggestedKeywords as string[] | null,
        has_birmingham_mention: page.hasBirminghamMention,
        has_west_midlands_mention: page.hasWestMidlandsMention,
        suggested_review_date: page.suggestedReviewDate?.toISOString() || null,
        tags: page.tags as string[] | null,
        notes: page.notes,
        created_at: page.createdAt.toISOString(),
    }

    return <ContentDetail page={formattedPage} />
}
