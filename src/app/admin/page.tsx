// Skip static generation - requires env vars at runtime
export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    // Fetch leads via Prisma
    const leads = await prisma.lead.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    // Map Prisma leads to match the expected Lead interface in the UI
    const formattedLeads = leads.map(lead => ({
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
        created_at: lead.createdAt.toISOString(),
        updated_at: lead.updatedAt.toISOString(),
    }))

    return <AdminDashboard leads={formattedLeads} />
}
