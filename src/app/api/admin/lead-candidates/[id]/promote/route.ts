import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

interface Props {
    params: Promise<{ id: string }>
}

// POST /api/admin/lead-candidates/[id]/promote
// Copies a LeadCandidate to the main Lead pipeline
export async function POST(request: Request, { params }: Props) {
    await headers()

    try {
        const { id } = await params

        // 1. Fetch the candidate
        const candidate = await prisma.leadCandidate.findUnique({
            where: { id }
        })

        if (!candidate) {
            return NextResponse.json(
                { error: 'Candidate not found' },
                { status: 404 }
            )
        }

        // 2. Create a new Lead from the candidate data
        const newLead = await prisma.lead.create({
            data: {
                email: candidate.contactEmail || `pending-${candidate.id}@placeholder.local`,
                companyName: candidate.businessName,
                source: 'Discovery Agent',
                leadScore: candidate.fitScore * 20, // Convert 1-5 to 0-100 scale
                status: 'new',
                mainChallenge: candidate.fitNotes || undefined,
            }
        })

        // 3. Update the candidate status to 'promoted'
        await prisma.leadCandidate.update({
            where: { id },
            data: { status: 'promoted' }
        })

        // 4. Create an event log for the new lead
        await prisma.leadEvent.create({
            data: {
                leadId: newLead.id,
                eventType: 'promoted_from_discovery',
                eventData: {
                    candidateId: candidate.id,
                    originalFitScore: candidate.fitScore,
                    website: candidate.website,
                    industry: candidate.industry,
                    location: candidate.location
                }
            }
        })

        return NextResponse.json({
            success: true,
            lead: newLead,
            message: 'Candidate promoted to pipeline'
        })

    } catch (error) {
        console.error('Promote candidate error:', error)
        return NextResponse.json(
            { error: 'Failed to promote candidate' },
            { status: 500 }
        )
    }
}
