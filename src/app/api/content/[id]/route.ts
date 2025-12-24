import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface Props {
    params: Promise<{ id: string }>
}

// GET single content page
export async function GET(request: Request, { params }: Props) {
    try {
        const { id } = await params
        const page = await prisma.contentPage.findUnique({
            where: { id }
        })

        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 })
        }

        return NextResponse.json(page)
    } catch (error) {
        console.error('Content API error:', error)
        return NextResponse.json({ error: 'Failed to fetch content page' }, { status: 500 })
    }
}

// PUT update content page
export async function PUT(request: Request, { params }: Props) {
    try {
        const { id } = await params
        const data = await request.json()

        const page = await prisma.contentPage.update({
            where: { id },
            data: {
                ...(data.title !== undefined && { title: data.title }),
                ...(data.url !== undefined && { url: data.url }),
                ...(data.primary_topic !== undefined && { primaryTopic: data.primary_topic }),
                ...(data.location_focus !== undefined && { locationFocus: data.location_focus }),
                ...(data.status !== undefined && { status: data.status }),
                ...(data.last_reviewed !== undefined && { lastReviewed: new Date(data.last_reviewed) }),
                ...(data.next_review_date !== undefined && {
                    nextReviewDate: data.next_review_date ? new Date(data.next_review_date) : null
                }),
                ...(data.review_notes !== undefined && { reviewNotes: data.review_notes }),
                ...(data.notes !== undefined && { notes: data.notes }),
                ...(data.page_views !== undefined && { pageViews: data.page_views }),
                ...(data.cta_clicks !== undefined && { ctaClicks: data.cta_clicks }),
            }
        })

        return NextResponse.json({ success: true, page })
    } catch (error) {
        console.error('Content API error:', error)
        return NextResponse.json({ error: 'Failed to update content page' }, { status: 500 })
    }
}

// DELETE content page
export async function DELETE(request: Request, { params }: Props) {
    try {
        const { id } = await params
        await prisma.contentPage.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Content API error:', error)
        return NextResponse.json({ error: 'Failed to delete content page' }, { status: 500 })
    }
}
