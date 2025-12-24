'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminLayoutClient from '../../AdminLayoutClient'

export default function NewContentPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [primaryTopic, setPrimaryTopic] = useState('')
    const [locationFocus, setLocationFocus] = useState('none')
    const [status, setStatus] = useState('draft')
    const [notes, setNotes] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        try {
            const response = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    url,
                    primary_topic: primaryTopic,
                    location_focus: locationFocus,
                    status,
                    notes,
                }),
            })

            if (response.ok) {
                const data = await response.json()
                router.push(`/admin/content/${data.id}`)
            } else {
                const data = await response.json()
                setError(data.error || 'Failed to create page')
            }
        } catch (err) {
            setError('An error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AdminLayoutClient>
            <main className="admin-main">
                <div className="page-header">
                    <Link href="/admin/content" className="back-link">← Back to Content</Link>
                </div>

                <div className="form-card">
                    <h1>Add New Page</h1>
                    <p className="subtitle">Register a content page to track and analyse.</p>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="field">
                                <label htmlFor="title">Page Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. AI Training Services"
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="url">URL Path *</label>
                                <input
                                    type="text"
                                    id="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="e.g. /services or /about"
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="field full-width">
                                <label htmlFor="topic">Primary Topic</label>
                                <input
                                    type="text"
                                    id="topic"
                                    value={primaryTopic}
                                    onChange={(e) => setPrimaryTopic(e.target.value)}
                                    placeholder="Brief summary of what this page covers"
                                    className="form-input"
                                />
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

                            <div className="field full-width">
                                <label htmlFor="notes">Notes</label>
                                <textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any internal notes about this page..."
                                    className="form-textarea"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting ? 'Creating...' : 'Create Page'}
                            </button>
                            <Link href="/admin/content" className="btn btn-secondary">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </main>

            <style jsx>{`
        .admin-main {
          max-width: 800px;
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

        .form-card {
          background: white;
          border-radius: 12px;
          border: 1px solid var(--color-border);
          padding: 32px;
        }

        .form-card h1 {
          margin: 0 0 8px 0;
          font-size: 1.5rem;
        }

        .subtitle {
          color: var(--color-text-muted);
          margin: 0 0 24px 0;
        }

        .error-message {
          background: #FEE2E2;
          color: #991B1B;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .field label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 6px;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          font-size: 0.9375rem;
        }

        .form-textarea {
          resize: vertical;
        }

        .form-actions {
          display: flex;
          gap: 12px;
        }

        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </AdminLayoutClient>
    )
}
