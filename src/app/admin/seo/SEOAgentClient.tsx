'use client'

import { useState, useEffect } from 'react'

interface ContentPage {
    id: string
    title: string
    url: string
    status: string
    aiSummary: string | null
    aiGeneratedAt: string | null
    hasBirminghamMention: boolean
    hasWestMidlandsMention: boolean
}

interface SEOAnalysis {
    summary: string
    overall_score: number
    local_score: number
    content_score: number
    strengths: string[]
    critical_issues: string[]
    recommendations: { priority: string; category: string; action: string }[]
    technical_notes: string[]
}

export default function SEOAgentClient() {
    const [pages, setPages] = useState<ContentPage[]>([])
    const [selectedPage, setSelectedPage] = useState<ContentPage | null>(null)
    const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchPages()
    }, [])

    const fetchPages = async () => {
        try {
            const res = await fetch('/api/content')
            const data = await res.json()
            setPages(data)
        } catch (err) {
            console.error(err)
            setError('Failed to load pages')
        } finally {
            setIsLoading(false)
        }
    }

    const runAnalysis = async (pageId: string) => {
        setIsAnalyzing(true)
        setError(null)
        setAnalysis(null)

        try {
            const res = await fetch(`/api/content/${pageId}/analyse`, {
                method: 'POST'
            })
            const data = await res.json()

            if (data.success) {
                setAnalysis(data.analysis)
                // Refresh pages list to show updated data
                fetchPages()
            } else {
                setError(data.error || 'Analysis failed')
            }
        } catch (err) {
            console.error(err)
            setError('Failed to run SEO analysis')
        } finally {
            setIsAnalyzing(false)
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'var(--color-success)'
        if (score >= 60) return 'var(--color-warning)'
        return 'var(--color-error)'
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'var(--color-error)'
            case 'medium': return 'var(--color-warning)'
            default: return 'var(--color-text-muted)'
        }
    }

    return (
        <div className="seo-container">
            <div className="seo-header">
                <h1>SEO Agent</h1>
                <p className="subtitle">AI-powered SEO audits with actionable optimization recommendations.</p>
            </div>

            <div className="seo-layout">
                {/* Page Selector */}
                <div className="page-list">
                    <h2>Select Page to Audit</h2>
                    {isLoading ? (
                        <p>Loading pages...</p>
                    ) : (
                        <div className="pages">
                            {pages.map(page => (
                                <button
                                    key={page.id}
                                    className={`page-item ${selectedPage?.id === page.id ? 'selected' : ''}`}
                                    onClick={() => {
                                        setSelectedPage(page)
                                        setAnalysis(null)
                                        // Try to parse existing analysis if available
                                        if (page.aiSummary) {
                                            try {
                                                setAnalysis(JSON.parse(page.aiSummary))
                                            } catch {
                                                // Old format, ignore
                                            }
                                        }
                                    }}
                                >
                                    <span className="page-title">{page.title}</span>
                                    <span className="page-url">{page.url}</span>
                                    <div className="page-badges">
                                        {page.hasBirminghamMention && <span className="badge local">📍 Local</span>}
                                        {page.aiGeneratedAt && <span className="badge analyzed">✓ Analyzed</span>}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Analysis Panel */}
                <div className="analysis-panel">
                    {selectedPage ? (
                        <>
                            <div className="analysis-header">
                                <div>
                                    <h2>{selectedPage.title}</h2>
                                    <a href={selectedPage.url} target="_blank" rel="noreferrer" className="page-link">{selectedPage.url} ↗</a>
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => runAnalysis(selectedPage.id)}
                                    disabled={isAnalyzing}
                                >
                                    {isAnalyzing ? 'Analyzing...' : 'Run SEO Audit'}
                                </button>
                            </div>

                            {error && (
                                <div className="error-message">
                                    <strong>Error:</strong> {error}
                                </div>
                            )}

                            {analysis && (
                                <div className="analysis-results">
                                    {/* Scores */}
                                    <div className="scores-grid">
                                        <div className="score-card">
                                            <div className="score-value" style={{ color: getScoreColor(analysis.overall_score) }}>
                                                {analysis.overall_score}
                                            </div>
                                            <div className="score-label">Overall SEO</div>
                                        </div>
                                        <div className="score-card">
                                            <div className="score-value" style={{ color: getScoreColor(analysis.local_score) }}>
                                                {analysis.local_score}
                                            </div>
                                            <div className="score-label">Local SEO</div>
                                        </div>
                                        <div className="score-card">
                                            <div className="score-value" style={{ color: getScoreColor(analysis.content_score) }}>
                                                {analysis.content_score}
                                            </div>
                                            <div className="score-label">Content Quality</div>
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    <div className="section">
                                        <h3>Summary</h3>
                                        <p>{analysis.summary}</p>
                                    </div>

                                    {/* Strengths */}
                                    {analysis.strengths?.length > 0 && (
                                        <div className="section strengths">
                                            <h3>✓ Strengths</h3>
                                            <ul>
                                                {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Critical Issues */}
                                    {analysis.critical_issues?.length > 0 && (
                                        <div className="section issues">
                                            <h3>⚠️ Critical Issues</h3>
                                            <ul>
                                                {analysis.critical_issues.map((s, i) => <li key={i}>{s}</li>)}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Recommendations */}
                                    {analysis.recommendations?.length > 0 && (
                                        <div className="section">
                                            <h3>Recommendations</h3>
                                            <div className="recommendations-list">
                                                {analysis.recommendations.map((rec, i) => (
                                                    <div key={i} className="recommendation">
                                                        <span
                                                            className="priority-badge"
                                                            style={{ background: getPriorityColor(rec.priority) }}
                                                        >
                                                            {rec.priority}
                                                        </span>
                                                        <span className="category-badge">{rec.category}</span>
                                                        <span className="action">{rec.action}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Technical Notes */}
                                    {analysis.technical_notes?.length > 0 && (
                                        <div className="section technical">
                                            <h3>Technical Notes</h3>
                                            <ul>
                                                {analysis.technical_notes.map((n, i) => <li key={i}>{n}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {!analysis && !isAnalyzing && (
                                <div className="empty-state">
                                    <p>Click "Run SEO Audit" to analyze this page</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="empty-state">
                            <p>Select a page from the list to run an SEO audit</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .seo-container { max-width: 1200px; }
                .seo-header { margin-bottom: 32px; }
                .subtitle { color: var(--color-text-muted); }
                
                .seo-layout {
                    display: grid;
                    grid-template-columns: 300px 1fr;
                    gap: 32px;
                }
                
                .page-list {
                    background: var(--color-background-alt);
                    border: 1px solid var(--color-border);
                    border-radius: 12px;
                    padding: 20px;
                }
                .page-list h2 { font-size: 1rem; margin-bottom: 16px; }
                .pages { display: flex; flex-direction: column; gap: 8px; }
                
                .page-item {
                    text-align: left;
                    background: var(--color-background);
                    border: 1px solid var(--color-border);
                    border-radius: 8px;
                    padding: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .page-item:hover { border-color: var(--color-accent); }
                .page-item.selected { border-color: var(--color-primary); background: rgba(var(--color-primary-rgb), 0.05); }
                .page-title { display: block; font-weight: 500; margin-bottom: 4px; }
                .page-url { display: block; font-size: 0.75rem; color: var(--color-text-muted); }
                .page-badges { margin-top: 8px; display: flex; gap: 8px; }
                .badge { font-size: 0.6875rem; padding: 2px 6px; border-radius: 4px; background: var(--color-background-alt); }
                .badge.local { background: rgba(0, 128, 0, 0.1); color: var(--color-success); }
                .badge.analyzed { background: rgba(0, 0, 255, 0.1); color: var(--color-accent); }
                
                .analysis-panel {
                    background: var(--color-background-alt);
                    border: 1px solid var(--color-border);
                    border-radius: 12px;
                    padding: 24px;
                }
                .analysis-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 24px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid var(--color-border);
                }
                .analysis-header h2 { margin: 0 0 4px 0; }
                .page-link { font-size: 0.875rem; color: var(--color-accent); }
                
                .scores-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                    margin-bottom: 24px;
                }
                .score-card {
                    text-align: center;
                    padding: 20px;
                    background: var(--color-background);
                    border-radius: 8px;
                }
                .score-value { font-size: 2.5rem; font-weight: 700; }
                .score-label { font-size: 0.875rem; color: var(--color-text-muted); margin-top: 4px; }
                
                .section { margin-bottom: 24px; }
                .section h3 { font-size: 1rem; margin-bottom: 12px; }
                .section ul { margin: 0; padding-left: 20px; }
                .section li { margin-bottom: 6px; }
                .strengths { color: var(--color-success); }
                .issues { color: var(--color-error); }
                .technical { color: var(--color-text-muted); font-size: 0.875rem; }
                
                .recommendations-list { display: flex; flex-direction: column; gap: 12px; }
                .recommendation {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px;
                    background: var(--color-background);
                    border-radius: 6px;
                }
                .priority-badge {
                    font-size: 0.6875rem;
                    padding: 2px 8px;
                    border-radius: 4px;
                    color: white;
                    text-transform: uppercase;
                    font-weight: 600;
                }
                .category-badge {
                    font-size: 0.75rem;
                    padding: 2px 8px;
                    border-radius: 4px;
                    background: var(--color-background-alt);
                    color: var(--color-text-muted);
                }
                .action { flex: 1; }
                
                .empty-state {
                    text-align: center;
                    padding: 48px;
                    color: var(--color-text-muted);
                }
                .error-message {
                    background: rgba(255, 0, 0, 0.1);
                    border: 1px solid var(--color-error);
                    color: var(--color-error);
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 16px;
                }
            `}</style>
        </div>
    )
}
