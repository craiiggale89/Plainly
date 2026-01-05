import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { GoogleGenerativeAI } from '@google/generative-ai'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Lazy-load Gemini client
let genAI: GoogleGenerativeAI | null = null

function getGemini() {
    if (!genAI) {
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not set')
        }
        genAI = new GoogleGenerativeAI(apiKey)
    }
    return genAI
}

interface Props {
    params: Promise<{ id: string }>
}

const ANALYSIS_PROMPT = `You are an expert SEO auditor helping "Enablr", a UK-based AI consultancy in Birmingham, West Midlands, optimize their website pages.

Perform a comprehensive SEO audit of the following page and provide actionable recommendations.

**SCORING CRITERIA:**
- Overall SEO Score (0-100): Based on technical SEO, content quality, and optimization level
- Local SEO Score (0-100): How well the page targets Birmingham/West Midlands audience
- Content Quality Score (0-100): Clarity, depth, and conversion potential

**AUDIT CHECKLIST:**
1. Title tag optimization (length, keywords, uniqueness)
2. Meta description quality
3. Header structure (H1, H2s)
4. Keyword density and placement
5. Internal/external linking opportunities
6. Local SEO signals (location mentions, local schema potential)
7. Call-to-action clarity
8. Mobile-friendliness indicators
9. Content length and depth

**Return your response as valid JSON with this exact structure:**
{
  "overall_seo_score": 75,
  "local_seo_score": 60,
  "content_quality_score": 80,
  "summary": "Brief 2-sentence description of what this page does",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "critical_issues": ["issues that must be fixed"],
  "recommendations": [
    { "priority": "high", "category": "title", "action": "specific action to take" }
  ],
  "keywords": {
    "primary": "main target keyword",
    "secondary": ["supporting keywords"],
    "missing": ["keywords you should add"]
  },
  "local_seo": {
    "birmingham_mentions": 0,
    "west_midlands_mentions": 0,
    "suggested_local_phrases": ["natural ways to add local references"]
  },
  "technical_notes": ["any technical SEO observations"],
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

        const contentToAnalyse = `
Page Title: ${page.title}
URL: ${page.url}
Primary Topic: ${page.primaryTopic || 'Not specified'}
Notes: ${page.notes || 'None'}
        `.trim()

        const client = getGemini()
        const model = client.getGenerativeModel({ model: "gemini-2.0-flash" })

        const result = await model.generateContent([
            ANALYSIS_PROMPT,
            `Analyse this page:\n\n${contentToAnalyse}`
        ])

        const responseText = result.response.text()

        if (!responseText) {
            throw new Error('No response from Gemini')
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
            console.error('Failed to parse Gemini response:', responseText)
            throw new Error('Failed to parse AI analysis')
        }

        // Update the content page with AI analysis (adapted for new structure)
        const updatedPage = await prisma.contentPage.update({
            where: { id },
            data: {
                aiSummary: JSON.stringify({
                    summary: analysis.summary,
                    overall_score: analysis.overall_seo_score,
                    local_score: analysis.local_seo_score,
                    content_score: analysis.content_quality_score,
                    strengths: analysis.strengths,
                    critical_issues: analysis.critical_issues,
                    recommendations: analysis.recommendations,
                    technical_notes: analysis.technical_notes
                }),
                aiGeneratedAt: new Date(),
                suggestedKeywords: analysis.keywords?.secondary || [],
                hasBirminghamMention: (analysis.local_seo?.birmingham_mentions || 0) > 0,
                hasWestMidlandsMention: (analysis.local_seo?.west_midlands_mentions || 0) > 0,
                suggestedLocalPhrases: analysis.local_seo?.suggested_local_phrases || [],
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
