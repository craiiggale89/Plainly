import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET all content pages
export async function GET() {
    try {
        const pages = await prisma.contentPage.findMany({
            orderBy: { lastReviewed: 'asc' }
        })
        return NextResponse.json(pages)
    } catch (error) {
        console.error('Content API error:', error)
        return NextResponse.json({ error: 'Failed to fetch content pages' }, { status: 500 })
    }
}

// POST create new content page
export async function POST(request: Request) {
    try {
        const data = await request.json()

        // Validate required fields
        if (!data.title || !data.url) {
            return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 })
        }

        // Check if URL already exists
        const existing = await prisma.contentPage.findUnique({
            where: { url: data.url }
        })

        if (existing) {
            return NextResponse.json({ error: 'A page with this URL already exists' }, { status: 400 })
        }

        const page = await prisma.contentPage.create({
            data: {
                title: data.title,
                url: data.url,
                primaryTopic: data.primary_topic,
                locationFocus: data.location_focus || 'none',
                status: data.status || 'draft',
                notes: data.notes,
            }
        })

        return NextResponse.json({ id: page.id, success: true })
    } catch (error) {
        console.error('Content API error:', error)
        return NextResponse.json({ error: 'Failed to create content page' }, { status: 500 })
    }
}
