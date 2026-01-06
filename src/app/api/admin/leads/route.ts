import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    await headers()

    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
        })

        return NextResponse.json({ leads })
    } catch (error) {
        console.error('Failed to fetch leads:', error)
        return NextResponse.json(
            { error: 'Failed to fetch leads' },
            { status: 500 }
        )
    }
}
