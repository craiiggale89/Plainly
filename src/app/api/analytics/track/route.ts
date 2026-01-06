import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    await headers()

    try {
        const { url } = await request.json()

        if (!url) {
            return NextResponse.json({ error: 'URL required' }, { status: 400 })
        }

        // Normalize URL (remove trailing slash, query params for matching)
        const normalizedUrl = url.split('?')[0].replace(/\/$/, '') || '/'

        // Try to find existing page record
        const page = await prisma.contentPage.findFirst({
            where: {
                OR: [
                    { url: normalizedUrl },
                    { url: normalizedUrl + '/' },
                    { url: { contains: normalizedUrl } }
                ]
            }
        })

        if (page) {
            // Increment pageViews
            await prisma.contentPage.update({
                where: { id: page.id },
                data: { pageViews: (page.pageViews || 0) + 1 }
            })
        } else {
            // Auto-create page record for new pages
            await prisma.contentPage.create({
                data: {
                    url: normalizedUrl,
                    title: 'Auto-tracked page',
                    status: 'published',
                    pageViews: 1
                }
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Analytics tracking error:', error)
        // Don't fail the request - analytics should be non-blocking
        return NextResponse.json({ success: true })
    }
}

