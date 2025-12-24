import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import OpenAI from 'openai'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Lazy-load OpenAI client
let openai: OpenAI | null = null

function getOpenAI() {
    if (!openai) {
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    }
    return openai
}

interface Props {
    params: Promise<{ id: string }>
}

const ANALYSIS_PROMPT = `You are an SEO and content analyst helping a UK-based AI consultancy (Plainly AI, based in Birmingham, West Midlands) understand their web pages.

Analyse the following page content and provide:

1. **Summary** (3-5 sentences): What is this page about? Who is it for? What action does it encourage?

2. **Keywords** (5-10 items): Extract relevant SEO keywords and topics from this content. Return as a JSON array of strings.

3. **Location Mentions**: Does this page mention "Birmingham" or "West Midlands"? Return as JSON: { "birmingham": true/false, "west_midlands": true/false }

4. **Suggested Local Phrases** (3 items): If the page doesn't mention the local area, suggest 3 natural ways to add Birmingham/West Midlands references. Return as a JSON array of strings. If location is already well-covered, return an empty array.

5. **Suggested Review Date**: Based on the content type (service page, blog, landing page, etc.), suggest when this should next be reviewed. Return as ISO date string (e.g., "2025-03-15").

Return your response as valid JSON with this exact structure:
{
  "summary": "string",
  "keywords": ["string"],
  "location_mentions": { "birmingham": boolean, "west_midlands": boolean },
  "suggested_local_phrases": ["string"],
  "suggested_review_date": "YYYY-MM-DD"
}`

export async function POST(request: Request, { params }: Props) {
    await headers()
    try {
        const { id } = await params

        // Fetch the content page
        const page = await prisma.contentPage.findUnique({
            where: { id }
        })

        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 })
        }

        // For now, we'll use the primary topic and title as content
        // In a full implementation, you might fetch the actual page HTML
        const contentToAnalyse = `
Page Title: ${page.title}
URL: ${page.url}
Primary Topic: ${page.primaryTopic || 'Not specified'}
Notes: ${page.notes || 'None'}
        `.trim()

        const client = getOpenAI()

        const completion = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: ANALYSIS_PROMPT },
                { role: 'user', content: `Analyse this page:\n\n${contentToAnalyse}` }
            ],
            temperature: 0.3,
            max_tokens: 1000,
        })

        const responseText = completion.choices[0]?.message?.content

        if (!responseText) {
            throw new Error('No response from OpenAI')
        }

        // Parse the JSON response
        let analysis
        try {
            // Extract JSON from response (handle markdown code blocks)
            const jsonMatch = responseText.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                analysis = JSON.parse(jsonMatch[0])
            } else {
                throw new Error('No JSON found in response')
            }
        } catch (parseError) {
            console.error('Failed to parse OpenAI response:', responseText)
            throw new Error('Failed to parse AI analysis')
        }

        // Update the content page with AI analysis
        const updatedPage = await prisma.contentPage.update({
            where: { id },
            data: {
                aiSummary: analysis.summary,
                aiGeneratedAt: new Date(),
                suggestedKeywords: analysis.keywords,
                hasBirminghamMention: analysis.location_mentions?.birmingham || false,
                hasWestMidlandsMention: analysis.location_mentions?.west_midlands || false,
                suggestedLocalPhrases: analysis.suggested_local_phrases,
                suggestedReviewDate: analysis.suggested_review_date
                    ? new Date(analysis.suggested_review_date)
                    : null,
            }
        })

        return NextResponse.json({
            success: true,
            analysis,
            page: updatedPage
        })
    } catch (error) {
        console.error('Content analysis error:', error)
        return NextResponse.json(
            { error: 'Failed to analyse content' },
            { status: 500 }
        )
    }
}
