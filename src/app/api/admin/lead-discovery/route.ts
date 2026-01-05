import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { GoogleGenerativeAI } from '@google/generative-ai'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Lazy-load Gemini client
let genAI: GoogleGenerativeAI | null = null

function getGemini() {
    if (!genAI) {
        // Use GEMINI_API_KEY (from AI Studio) as primary, fallback to GOOGLE_SEARCH_API_KEY
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_SEARCH_API_KEY
        if (!apiKey) {
            throw new Error('No Google API Key found (GOOGLE_SEARCH_API_KEY or GEMINI_API_KEY)')
        }
        console.log(`[DEBUG] Initializing Gemini with Key starting: ${apiKey.substring(0, 5)}...`)
        genAI = new GoogleGenerativeAI(apiKey)
    }
    return genAI
}

// Interface for search results
interface SearchResult {
    title: string
    link: string
    snippet: string
}

// ---------------------------------------------------------
// REAL GOOGLE SEARCH (If keys exist)
// ---------------------------------------------------------
async function searchGoogle(query: string, location?: string): Promise<SearchResult[]> {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY
    const cx = process.env.GOOGLE_SEARCH_CX // Search Engine ID

    if (!apiKey || !cx) {
        throw new Error("Missing Google Search configuration (API Key or CX)")
    }

    try {
        // Use gl=uk for UK-focused results, and add location to refine
        const url = new URL('https://www.googleapis.com/customsearch/v1')
        url.searchParams.set('key', apiKey)
        url.searchParams.set('cx', cx)
        url.searchParams.set('q', query)
        url.searchParams.set('num', '10')
        url.searchParams.set('gl', 'uk') // Geographic location: UK
        url.searchParams.set('cr', 'countryUK') // Country restrict

        const res = await fetch(url.toString())
        if (!res.ok) {
            console.error("Google Search API Error:", await res.text())
            throw new Error("Google Search API failed")
        }
        const data = await res.json()
        return (data.items || []).map((item: any) => ({
            title: item.title,
            link: item.link,
            snippet: item.snippet
        }))
    } catch (error) {
        console.error("Google Search fetch failed:", error)
        throw error
    }
}

const SCORING_PROMPT = `You are a Lead Qualification Researcher for "Enablr", an AI consultancy for non-technical SMEs.
Your goal is to score a business lead based on fit for our services AND find their contact information.

**Our Ideal Profile:**
- Location: Birmingham / West Midlands (Bonus points)
- Size: Small-to-Medium (5-50 staff)
- Type: Non-technical (e.g., Law, Finance, Logistics, Trades, Agencies). NOT tech startups.
- Pain: Admin-heavy, likely paper-based or messy Excel workflows.
- AI Maturity: Low. If they mention "AI Powered" or "Tech First", they are BAD fit.

**Scoring Criteria (1-5):**
5: Perfect fit. Local, non-technical, clearly "human" service business, no AI mentioned.
4: Good fit. Likely non-technical, but maybe outside core location or slightly vague.
3: Unsure. Could be a fit, but snippet is generic.
2: Poor fit. Too large, too corporate, or seemingly tech-savvy.
1: Bad fit. Tech company, software agency, or massive enterprise.

**Input:**
Search Result Snippet: {SNIPPET}
Title: {TITLE}
URL: {URL}

**Task:**
Analyze the input.
1. Extract/Guess Industry.
2. Determine Fit Score (1-5).
3. Write a short "Fit Note" (1 sentence justification).
4. Find a contact email:
   - If an email is visible in the snippet, extract it and set email_is_guessed to false.
   - If no email is visible, guess one based on common patterns (info@, hello@, contact@) using the domain from the URL, and set email_is_guessed to true.
   - If you cannot determine an email at all, set contact_email to null.

Return JSON:
{
  "business_name": "string (extract from title)",
  "industry": "string",
  "fit_score": number,
  "fit_note": "string",
  "location_guess": "string (e.g. Birmingham or Unknown)",
  "contact_email": "string or null",
  "email_is_guessed": boolean
}`


export async function POST(request: Request) {
    await headers()
    try {
        const { location = 'Birmingham', industry = 'General' } = await request.json()

        // Build a location-focused query - search for businesses LOCATED in the area, not just mentioning it
        const query = `"${industry}" small business near ${location} UK`

        // 1. Get Results - use Google's geographical parameters for UK-focused results
        const results = await searchGoogle(query, location)
        console.log(`[DEBUG] Google Search found ${results.length} results for: ${query}`)

        if (!results || results.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'No results found or search API not configured.'
            })
        }

        const client = getGemini()
        const model = client.getGenerativeModel({ model: "gemini-2.0-flash" })

        // 2. Process each result with Gemini (in parallel for speed, capped at 5 for demo safety)
        const processedLeads = await Promise.all(results.slice(0, 5).map(async (result) => {
            try {
                const prompt = SCORING_PROMPT
                    .replace('{SNIPPET}', result.snippet)
                    .replace('{TITLE}', result.title)
                    .replace('{URL}', result.link)

                const aiRes = await model.generateContent(prompt)
                const text = aiRes.response.text()
                console.log(`[DEBUG] Gemini Response for ${result.title.substring(0, 20)}...:`, text.substring(0, 100))

                // Parse JSON
                const jsonMatch = text.match(/\{[\s\S]*\}/)
                if (!jsonMatch) {
                    console.error(`[DEBUG] No JSON found in response: ${text}`)
                    return null
                }
                const data = JSON.parse(jsonMatch[0])

                return {
                    businessName: data.business_name,
                    website: result.link,
                    location: data.location_guess,
                    industry: data.industry,
                    contactEmail: data.contact_email || null,
                    emailIsGuessed: data.email_is_guessed || false,
                    fitScore: data.fit_score,
                    fitNotes: data.fit_note,
                    source: 'Google Search',
                    status: 'new'
                }
            } catch (e) {
                console.error("[DEBUG] AI Qualification failed for item", e)
                return null
            }
        }))

        // Filter nulls
        const validLeads = processedLeads.filter(l => l !== null)

        // 3. Save to Database
        if (validLeads.length > 0) {
            await prisma.leadCandidate.createMany({
                data: validLeads as any
            })
        }

        return NextResponse.json({
            success: true,
            count: validLeads.length,
            leads: validLeads
        })

    } catch (error) {
        console.error('Lead discovery error:', error)
        return NextResponse.json(
            { error: 'Failed to discover leads' },
            { status: 500 }
        )
    }
}
