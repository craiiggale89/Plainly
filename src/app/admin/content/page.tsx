// Skip static generation - requires env vars at runtime
export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import ContentDashboard from './ContentDashboard'

export default async function ContentPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    // Fetch content pages via Prisma
    const contentPages = await prisma.contentPage.findMany({
        orderBy: {
            lastReviewed: 'asc' // Show oldest first (most stale)
        }
    })

    // Map Prisma data to match the expected interface in the UI
    const formattedPages = contentPages.map(page => ({
        id: page.id,
        title: page.title,
        url: page.url,
        primary_topic: page.primaryTopic,
        location_focus: page.locationFocus,
        status: page.status || 'draft',
        last_reviewed: page.lastReviewed?.toISOString() || null,
        page_views: page.pageViews,
        cta_clicks: page.ctaClicks,
        notes: page.notes,
        has_birmingham_mention: page.hasBirminghamMention,
        has_west_midlands_mention: page.hasWestMidlandsMention,
        created_at: page.createdAt.toISOString(),
    }))

    return <ContentDashboard pages={formattedPages} />
}
