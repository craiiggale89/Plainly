'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminLayoutClient from '../../AdminLayoutClient'

interface ContentPageData {
  id: string
  title: string
  url: string
  primary_topic: string | null
  location_focus: string | null
  status: string
  last_reviewed: string | null
  next_review_date: string | null
  review_notes: string | null
  page_views: number | null
  cta_clicks: number | null
  ai_summary: string | null
  ai_generated_at: string | null
  suggested_local_phrases: string[] | null
  suggested_keywords: string[] | null
  has_birmingham_mention: boolean
  has_west_midlands_mention: boolean
  suggested_review_date: string | null
  tags: string[] | null
  notes: string | null
  created_at: string
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function ContentDetail({ page }: { page: ContentPageData }) {
  const router = useRouter()
  const [isAnalysing, setIsAnalysing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Editable fields
  const [status, setStatus] = useState(page.status)
  const [locationFocus, setLocationFocus] = useState(page.location_focus || 'none')
  const [reviewNotes, setReviewNotes] = useState(page.review_notes || '')
  const [nextReviewDate, setNextReviewDate] = useState(page.next_review_date?.split('T')[0] || '')
  const [notes, setNotes] = useState(page.notes || '')
  // SEO Fields
  const [primaryTopic, setPrimaryTopic] = useState(page.primary_topic || '')
  const [metaDescription, setMetaDescription] = useState(page.ai_summary || '')
  const [keywords, setKeywords] = useState(page.suggested_keywords?.join(', ') || '')

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/content/${page.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          location_focus: locationFocus,
          review_notes: reviewNotes,
          next_review_date: nextReviewDate || null,
          notes,
          primary_topic: primaryTopic,
          ai_summary: metaDescription, // Using AI summary as meta description field for now
          suggested_keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
          last_reviewed: new Date().toISOString(),
        }),
      })
      if (response.ok) {
        router.refresh()
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleAnalyse = async () => {
    setIsAnalysing(true)
    try {
      const response = await fetch(`/api/content/${page.id}/analyse`, {
        method: 'POST',
      })
      if (response.ok) {
        router.refresh()
      }
    } finally {
      setIsAnalysing(false)
    }
  }

  return (
    <AdminLayoutClient>
      <main className="admin-main">
        <div className="page-header">
          <Link href="/admin/content" className="back-link">← Back to Content</Link>
        </div>

        <div className="content-header">
          <div className="title-section">
            <h1>{page.title}</h1>
            <a href={page.url} target="_blank" rel="noopener noreferrer" className="url-link">
              {page.url} ↗
            </a>
          </div>
          <span className={`badge badge-${page.status.replace('_', '-')}`}>
            {page.status.replace('_', ' ')}
          </span>
        </div>

        <div className="content-grid">
          {/* AI Generated Section */}
          <section className="card ai-section">
            <div className="card-header">
              <h3>✨ AI Analysis</h3>
              <button
                onClick={handleAnalyse}
                disabled={isAnalysing}
                className="btn btn-secondary"
              >
                {isAnalysing ? 'Analysing...' : 'Regenerate Summary'}
              </button>
            </div>

            <div className="ai-content">
              <div className="field">
                <label>Summary</label>
                <p className="ai-summary">{page.ai_summary || 'No AI summary generated yet. Click "Regenerate Summary" to analyse this page.'}</p>
                {page.ai_generated_at && (
                  <span className="ai-date">Generated {formatDate(page.ai_generated_at)}</span>
                )}
              </div>

              <div className="field">
                <label>Location Mentions Detected</label>
                <div className="location-mentions">
                  <span className={page.has_birmingham_mention ? 'detected' : 'not-detected'}>
                    {page.has_birmingham_mention ? '✓' : '✗'} Birmingham
                  </span>
                  <span className={page.has_west_midlands_mention ? 'detected' : 'not-detected'}>
                    {page.has_west_midlands_mention ? '✓' : '✗'} West Midlands
                  </span>
                </div>
              </div>

              {page.suggested_local_phrases && page.suggested_local_phrases.length > 0 && (
                <div className="field">
                  <label>Suggested Local Phrases</label>
                  <ul className="suggestions">
                    {page.suggested_local_phrases.map((phrase, i) => (
                      <li key={i}>{phrase}</li>
                    ))}
                  </ul>
                </div>
              )}

              {page.suggested_keywords && page.suggested_keywords.length > 0 && (
                <div className="field">
                  <label>Suggested Keywords</label>
                  <div className="tags">
                    {page.suggested_keywords.map((keyword, i) => (
                      <span key={i} className="tag">{keyword}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Manual Fields Section */}
          <section className="card manual-section">
            <div className="card-header">
              <h3>Page Details</h3>
            </div>

            <div className="form-grid">
              <div className="field">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-select"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="needs_review">Needs Review</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="location">Location Focus</label>
                <select
                  id="location"
                  value={locationFocus}
                  onChange={(e) => setLocationFocus(e.target.value)}
                  className="form-select"
                >
                  <option value="none">None</option>
                  <option value="birmingham">Birmingham</option>
                  <option value="west_midlands">West Midlands</option>
                  <option value="uk_wide">UK-wide</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="nextReview">Next Review Date</label>
                <input
                  type="date"
                  id="nextReview"
                  value={nextReviewDate}
                  onChange={(e) => setNextReviewDate(e.target.value)}
                  className="form-input"
                />
                {page.suggested_review_date && (
                  <span className="suggestion">AI suggests: {formatDate(page.suggested_review_date)}</span>
                )}
              </div>

              <div className="field full-width">
                <label htmlFor="reviewNotes">Review Notes</label>
                <textarea
                  id="reviewNotes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Notes from your review..."
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <div className="field full-width">
                <label htmlFor="notes">Internal Notes</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="General notes about this page..."
                  className="form-textarea"
                  rows={3}
                />
              </div>
            </div>

            <div className="card-footer">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn btn-primary"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <span className="last-reviewed">
                Last reviewed: {formatDate(page.last_reviewed)}
              </span>
            </div>
          </section>

          {/* Metrics Section */}
          <section className="card metrics-section">
            <div className="card-header">
              <h3>Metrics</h3>
            </div>
            <div className="metrics-grid">
              <div className="metric">
                <span className="metric-value">{page.page_views ?? '-'}</span>
                <span className="metric-label">Page Views</span>
              </div>
              <div className="metric">
                <span className="metric-value">{page.cta_clicks ?? '-'}</span>
                <span className="metric-label">CTA Clicks</span>
              </div>
              <div className="metric">
                <span className="metric-value">{formatDate(page.created_at)}</span>
                <span className="metric-label">Created</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <style jsx>{`
        .admin-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px;
        }

        .page-header {
          margin-bottom: 16px;
        }

        .back-link {
          color: var(--color-text-muted);
          font-size: 0.875rem;
        }

        .back-link:hover {
          color: var(--color-accent);
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          gap: 16px;
        }

        .title-section h1 {
          margin: 0 0 8px 0;
          font-size: 1.75rem;
        }

        .url-link {
          color: var(--color-accent);
          font-size: 0.875rem;
        }

        .badge {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.8125rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .badge-draft { background: #F3F4F6; color: #6B7280; }
        .badge-published { background: #DCFCE7; color: #15803D; }
        .badge-needs-review { background: #FEF3C7; color: #B45309; }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .card {
          background: white;
          border-radius: 12px;
          border: 1px solid var(--color-border);
          overflow: hidden;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: var(--color-background);
          border-bottom: 1px solid var(--color-border);
        }

        .card-header h3 {
          margin: 0;
          font-size: 1rem;
        }

        .ai-section {
          grid-column: 1 / -1;
        }

        .ai-content {
          padding: 20px;
          display: grid;
          gap: 20px;
        }

        .field label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--color-text-muted);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ai-summary {
          margin: 0;
          line-height: 1.6;
          color: var(--color-text);
        }

        .ai-date {
          display: block;
          margin-top: 8px;
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }

        .location-mentions {
          display: flex;
          gap: 16px;
        }

        .location-mentions span {
          font-size: 0.875rem;
        }

        .detected { color: #15803D; }
        .not-detected { color: #9CA3AF; }

        .suggestions {
          margin: 0;
          padding-left: 20px;
          color: var(--color-text);
        }

        .suggestions li {
          margin-bottom: 4px;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag {
          background: var(--color-background);
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.8125rem;
          color: var(--color-text-muted);
        }

        .manual-section {
          grid-column: 1;
        }

        .form-grid {
          padding: 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .form-select, .form-input, .form-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          font-size: 0.9375rem;
        }

        .form-textarea {
          resize: vertical;
        }

        .suggestion {
          display: block;
          margin-top: 4px;
          font-size: 0.75rem;
          color: var(--color-accent);
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: var(--color-background);
          border-top: 1px solid var(--color-border);
        }

        .last-reviewed {
          font-size: 0.8125rem;
          color: var(--color-text-muted);
        }

        .metrics-section {
          grid-column: 2;
        }

        .metrics-grid {
          padding: 20px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .metric {
          text-align: center;
        }

        .metric-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-primary);
        }

        .metric-label {
          display: block;
          font-size: 0.75rem;
          color: var(--color-text-muted);
          display: block;
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-top: 4px;
        }

        .seo-section {
           grid-column: 1;
        }

        .char-count {
            display: block;
            text-align: right;
            font-size: 0.75rem;
            color: var(--color-text-muted);
            margin-top: 4px;
        }

        .text-warning {
            color: #B45309;
        }

        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
          }

          .ai-section, .manual-section, .metrics-section, .seo-section {
            grid-column: 1;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AdminLayoutClient>
  )
}
