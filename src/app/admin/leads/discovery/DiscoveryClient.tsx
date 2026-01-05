'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LeadCandidate {
    id: string
    businessName: string
    website: string | null
    location: string | null
    industry: string | null
    contactEmail: string | null
    emailIsGuessed: boolean
    fitScore: number
    fitNotes: string | null
    status: string
}

export default function DiscoveryClient() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState<LeadCandidate[]>([])
    const [industry, setIndustry] = useState('Professional Services')
    const [location, setLocation] = useState('Birmingham')
    const [error, setError] = useState<string | null>(null)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setResults([])

        try {
            const res = await fetch('/api/admin/lead-discovery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ industry, location })
            })

            const data = await res.json()
            if (data.success) {
                setResults(data.leads)
            } else {
                setError(data.error || 'Unknown error occurred')
            }
        } catch (err) {
            console.error(err)
            setError('Failed to connect to discovery agent. Please check console.')
        } finally {
            setIsLoading(false)
        }
    }

    const handlePromote = async (candidateId: string) => {
        try {
            const res = await fetch(`/api/admin/lead-candidates/${candidateId}/promote`, {
                method: 'POST'
            })
            const data = await res.json()
            if (data.success) {
                // Update local state to show promoted status
                setResults(prev => prev.map(lead =>
                    lead.id === candidateId
                        ? { ...lead, status: 'promoted' }
                        : lead
                ))
                // Navigate to the new lead
                router.push(`/admin/leads/${data.lead.id}`)
            } else {
                setError(data.error || 'Failed to promote candidate')
            }
        } catch (err) {
            console.error(err)
            setError('Failed to promote candidate')
        }
    }

    return (
        <div className="discovery-container">
            <div className="discovery-header">
                <h1>Lead Discovery Agent</h1>
                <p className="subtitle">AI-powered research to identify local SMEs suitable for outreach.</p>
            </div>

            <div className="search-panel">
                {error && (
                    <div className="error-message">
                        <span><strong>Error:</strong> {error}</span>
                        <button onClick={() => setError(null)} className="close-error" type="button">×</button>
                    </div>
                )}
                <form onSubmit={handleSearch} className="search-form">
                    <div className="form-group">
                        <label>Industry</label>
                        <select
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            className="form-select"
                        >
                            <option value="Professional Services">Professional Services</option>
                            <option value="Logistics">Logistics</option>
                            <option value="Trades">Trades</option>
                            <option value="Agencies">Agencies</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="General SME">General SME</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="form-input"
                            placeholder="e.g. Birmingham"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Researching...' : 'Run Discovery'}
                    </button>
                </form>
            </div>

            {results.length > 0 ? (
                <div className="results-panel">
                    <h2>Discovered Candidates ({results.length})</h2>
                    <div className="candidates-list">
                        {results.map((lead) => (
                            <div key={lead.id} className={`candidate-card score-${lead.fitScore}`}>
                                <div className="candidate-header">
                                    <h3>
                                        {lead.businessName}
                                        {lead.website && <a href={lead.website} target="_blank" rel="noreferrer" className="website-link">↗</a>}
                                    </h3>
                                    <span className="fit-badge">Fit Score: {lead.fitScore}/5</span>
                                </div>
                                <div className="candidate-meta">
                                    <span className="meta-item">{lead.industry}</span>
                                    <span className="meta-item">{lead.location}</span>
                                </div>
                                {lead.contactEmail && (
                                    <div className="email-row">
                                        <a href={`mailto:${lead.contactEmail}`} className="meta-email">
                                            ✉ {lead.contactEmail}
                                        </a>
                                        <span className={`email-badge ${lead.emailIsGuessed ? 'guessed' : 'verified'}`}>
                                            {lead.emailIsGuessed ? '⚠ Guessed' : '✓ Extracted'}
                                        </span>
                                    </div>
                                )}
                                <p className="fit-notes">{lead.fitNotes}</p>
                                <div className="candidate-actions">
                                    {lead.status === 'promoted' ? (
                                        <span className="promoted-badge">✓ Added to Pipeline</span>
                                    ) : (
                                        <button
                                            className="btn btn-xs btn-primary"
                                            onClick={() => handlePromote(lead.id)}
                                        >
                                            Add to Pipeline
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                !isLoading && results.length === 0 && (
                    <div className="empty-state">
                        <p>No suitable candidates found. Try adjusting your search or location.</p>
                    </div>
                )
            )}

            <style jsx>{`
        .discovery-container {
            max-width: 800px;
        }
        .discovery-header {
            margin-bottom: 32px;
        }
        .subtitle {
            color: var(--color-text-muted);
        }
        .search-panel {
            background: var(--color-background-alt);
            padding: 24px;
            border-radius: 12px;
            border: 1px solid var(--color-border);
            margin-bottom: 32px;
        }
        .search-form {
            display: grid;
            gap: 16px;
            grid-template-columns: 1fr 1fr auto;
            align-items: end;
        }
        .checkbox-group {
            display: flex;
            align-items: center;
            padding-bottom: 12px;
        }
        .checkbox-label {
            font-size: 0.875rem;
            color: var(--color-text-muted);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .candidates-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .candidate-card {
            background: var(--color-background-alt);
            border: 1px solid var(--color-border);
            padding: 20px;
            border-radius: 8px;
            transition: all 0.2s;
        }
        .candidate-card:hover {
            border-color: var(--color-accent);
        }
        /* Color coding for scores */
        .score-5 { border-left: 4px solid var(--color-success); }
        .score-4 { border-left: 4px solid var(--color-success); }
        .score-3 { border-left: 4px solid var(--color-warning); }
        .score-2 { border-left: 4px solid var(--color-error); }
        .score-1 { border-left: 4px solid var(--color-error); }

        .candidate-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        .candidate-header h3 {
            margin: 0;
            font-size: 1.125rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .website-link {
            font-size: 0.875rem;
            color: var(--color-accent);
            text-decoration: none;
        }
        .fit-badge {
            background: var(--color-background);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.875rem;
            font-weight: 600;
        }
        .candidate-meta {
            display: flex;
            gap: 12px;
            margin-bottom: 12px;
            font-size: 0.875rem;
            color: var(--color-text-muted);
            flex-wrap: wrap;
        }
        .meta-email {
            color: var(--color-accent);
            text-decoration: none;
        }
        .meta-email:hover {
            text-decoration: underline;
        }
        .email-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
            font-size: 0.875rem;
        }
        .email-badge {
            font-size: 0.6875rem;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 500;
        }
        .email-badge.verified {
            background: rgba(0, 128, 0, 0.1);
            color: var(--color-success);
        }
        .email-badge.guessed {
            background: rgba(255, 165, 0, 0.1);
            color: var(--color-warning);
        }
        .fit-notes {
            font-size: 0.9375rem;
            line-height: 1.5;
            margin-bottom: 16px;
            background: rgba(0,0,0,0.02);
            padding: 8px 12px;
            border-radius: 6px;
        }
        .btn-xs {
            padding: 4px 12px;
            font-size: 0.8125rem;
        }
        .error-message {
            background: rgba(255, 0, 0, 0.1);
            border: 1px solid var(--color-error);
            color: var(--color-error);
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 16px;
            font-size: 0.9375rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .close-error {
            background: none;
            border: none;
            color: var(--color-error);
            font-size: 1.25rem;
            cursor: pointer;
            padding: 0 4px;
            line-height: 1;
        }
        .promoted-badge {
            color: var(--color-success);
            font-size: 0.875rem;
            font-weight: 500;
        }
        .empty-state {
            text-align: center;
            padding: 48px;
            color: var(--color-text-muted);
            background: var(--color-background-alt);
            border-radius: 12px;
            border: 1px dashed var(--color-border);
        }
      `}</style>
        </div>
    )
}
