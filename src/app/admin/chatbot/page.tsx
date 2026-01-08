'use client'

import { useEffect, useState } from 'react'

interface ChatbotAnalytics {
    totalConversations: number
    totalMessages: number
    userMessages: number
    recentConversations: number
    recentMessages: number
    conversationPreviews: {
        conversationId: string
        messageCount: number
        startedAt: string
        preview: string
    }[]
}

export default function ChatbotAnalyticsPage() {
    const [analytics, setAnalytics] = useState<ChatbotAnalytics | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const fetchAnalytics = async () => {
        try {
            const res = await fetch('/api/admin/chatbot-analytics')
            if (res.ok) {
                const data = await res.json()
                setAnalytics(data)
            }
        } catch (error) {
            console.error('Failed to fetch chatbot analytics:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <div className="loading">Loading chatbot analytics...</div>
    }

    if (!analytics) {
        return <div className="error">Failed to load analytics</div>
    }

    return (
        <div className="chatbot-analytics">
            <h1>Chatbot Analytics</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{analytics.totalConversations}</div>
                    <div className="stat-label">Total Conversations</div>
                    <div className="stat-sub">All time</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{analytics.userMessages}</div>
                    <div className="stat-label">User Messages</div>
                    <div className="stat-sub">Total engagement</div>
                </div>
                <div className="stat-card highlight">
                    <div className="stat-value">{analytics.recentConversations}</div>
                    <div className="stat-label">Conversations</div>
                    <div className="stat-sub">Last 7 days</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{analytics.recentMessages}</div>
                    <div className="stat-label">Messages</div>
                    <div className="stat-sub">Last 7 days</div>
                </div>
            </div>

            <div className="recent-section">
                <h2>Recent Conversations</h2>
                {analytics.conversationPreviews.length === 0 ? (
                    <p className="empty-state">No conversations yet</p>
                ) : (
                    <div className="conversations-list">
                        {analytics.conversationPreviews.map((conv) => (
                            <div key={conv.conversationId} className="conversation-card">
                                <div className="conv-header">
                                    <span className="conv-messages">{conv.messageCount} messages</span>
                                    <span className="conv-date">
                                        {new Date(conv.startedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="conv-preview">{conv.preview}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                .chatbot-analytics {
                    padding: 32px;
                }
                h1 {
                    margin-bottom: 32px;
                }
                h2 {
                    font-size: 1.25rem;
                    margin-bottom: 16px;
                }
                .loading, .error {
                    padding: 48px;
                    text-align: center;
                    color: var(--color-text-muted);
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                    margin-bottom: 40px;
                }
                .stat-card {
                    background: white;
                    padding: 24px;
                    border-radius: 12px;
                    box-shadow: var(--shadow-sm);
                }
                .stat-card.highlight {
                    background: var(--color-accent);
                    color: white;
                }
                .stat-value {
                    font-size: 2.5rem;
                    font-weight: 700;
                    line-height: 1;
                    margin-bottom: 8px;
                }
                .stat-label {
                    font-weight: 500;
                    margin-bottom: 4px;
                }
                .stat-sub {
                    font-size: 0.8125rem;
                    opacity: 0.7;
                }
                .recent-section {
                    background: white;
                    padding: 24px;
                    border-radius: 12px;
                    box-shadow: var(--shadow-sm);
                }
                .empty-state {
                    color: var(--color-text-muted);
                    text-align: center;
                    padding: 24px;
                }
                .conversations-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .conversation-card {
                    padding: 16px;
                    background: var(--color-background-alt);
                    border-radius: 8px;
                }
                .conv-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }
                .conv-messages {
                    font-weight: 500;
                    font-size: 0.875rem;
                }
                .conv-date {
                    color: var(--color-text-muted);
                    font-size: 0.8125rem;
                }
                .conv-preview {
                    color: var(--color-text-muted);
                    font-size: 0.9375rem;
                    margin: 0;
                    line-height: 1.5;
                }
                @media (max-width: 900px) {
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (max-width: 600px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    )
}
