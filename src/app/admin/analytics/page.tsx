// Skip static generation
export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import AnalyticsDashboard from './AnalyticsDashboard'

export default async function AnalyticsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    // Fetch all content pages
    const pages = await prisma.contentPage.findMany({
        select: {
            id: true,
            title: true,
            url: true,
            pageViews: true,
            ctaClicks: true,
        },
        orderBy: {
            pageViews: 'desc'
        }
    })

    // Fetch all leads for source breakdown
    const leads = await prisma.lead.groupBy({
        by: ['source'],
        _count: {
            source: true
        },
        orderBy: {
            _count: {
                source: 'desc'
            }
        }
    })

    const totalLeads = await prisma.lead.count()

    // Aggregate data
    const totalViews = pages.reduce((sum, page) => sum + (page.pageViews || 0), 0)
    const totalCtaClicks = pages.reduce((sum, page) => sum + (page.ctaClicks || 0), 0)
    const totalPages = pages.length
    const avgViewsPerPage = totalPages > 0 ? totalViews / totalPages : 0

    const formattedLeads = leads.map(group => ({
        source: group.source,
        count: group._count.source
    }))

    const topPages = pages
        .slice(0, 10)
        .map(page => ({
            id: page.id,
            title: page.title,
            url: page.url,
            views: page.pageViews || 0,
            clicks: page.ctaClicks || 0
        }))

    const dashboardData = {
        totalPages,
        totalViews,
        totalCtaClicks,
        avgViewsPerPage,
        topPages,
        leadSources: formattedLeads,
        recentLeadsCount: totalLeads
    }

    return <AnalyticsDashboard data={dashboardData} />
}
