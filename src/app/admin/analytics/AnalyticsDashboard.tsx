'use client'

import { useState } from 'react'
import AdminLayoutClient from '../AdminLayoutClient'

interface AnalyticsData {
    totalPages: number
    totalViews: number
    totalCtaClicks: number
    avgViewsPerPage: number
    topPages: {
        id: string
        title: string
        url: string
        views: number
        clicks: number
    }[]
    leadSources: {
        source: string
        count: number
    }[]
    recentLeadsCount: number
}

export default function AnalyticsDashboard({ data }: { data: AnalyticsData }) {
    return (
        <AdminLayoutClient>
            <main className="admin-main">
                <div className="page-header">
                    <h2>Analytics</h2>
                    <span className="last-updated">Last updated: Just now</span>
                </div>

                {/* Key Metrics Grid */}
                <div className="metrics-grid">
                    <div className="metric-card">
                        <h3>Total Page Views</h3>
                        <div className="value">{data.totalViews.toLocaleString()}</div>
                        <div className="sub-value">Across {data.totalPages} pages</div>
                    </div>
                    <div className="metric-card">
                        <h3>Total CTA Clicks</h3>
                        <div className="value">{data.totalCtaClicks.toLocaleString()}</div>
                        <div className="sub-value">{(data.totalViews > 0 ? (data.totalCtaClicks / data.totalViews * 100).toFixed(1) : 0)}% conversion rate</div>
                    </div>
                    <div className="metric-card">
                        <h3>Total Leads</h3>
                        <div className="value">{data.recentLeadsCount.toLocaleString()}</div>
                        <div className="sub-value">All time</div>
                    </div>
                    <div className="metric-card">
                        <h3>Avg. Views / Page</h3>
                        <div className="value">{Math.round(data.avgViewsPerPage).toLocaleString()}</div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    {/* Top Performing Content */}
                    <div className="card content-card">
                        <div className="card-header">
                            <h3>Top Performing Content</h3>
                        </div>
                        <table className="analytics-table">
                            <thead>
                                <tr>
                                    <th>Page Title</th>
                                    <th className="text-right">Views</th>
                                    <th className="text-right">CTA Clicks</th>
                                    <th className="text-right">Conv.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.topPages.length > 0 ? (
                                    data.topPages.map(page => (
                                        <tr key={page.id}>
                                            <td className="title-cell">
                                                <div className="page-info">
                                                    <span className="title">{page.title}</span>
                                                    <a href={page.url} target="_blank" rel="noopener noreferrer" className="url">{page.url}</a>
                                                </div>
                                            </td>
                                            <td className="text-right">{page.views.toLocaleString()}</td>
                                            <td className="text-right">{page.clicks.toLocaleString()}</td>
                                            <td className="text-right">
                                                {page.views > 0 ? ((page.clicks / page.views) * 100).toFixed(1) : '0.0'}%
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="empty-state">No data available yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Lead Sources */}
                    <div className="card sources-card">
                        <div className="card-header">
                            <h3>Lead Sources</h3>
                        </div>
                        <div className="sources-list">
                            {data.leadSources.map((source, index) => {
                                const total = data.leadSources.reduce((acc, curr) => acc + curr.count, 0)
                                const percentage = total > 0 ? (source.count / total) * 100 : 0

                                return (
                                    <div key={index} className="source-item">
                                        <div className="source-info">
                                            <span className="source-name">{source.source.replace(/_/g, ' ')}</span>
                                            <span className="source-count">{source.count} leads</span>
                                        </div>
                                        <div className="progress-bar-bg">
                                            <div
                                                className="progress-bar-fill"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                            {data.leadSources.length === 0 && (
                                <div className="empty-state">No leads recorded yet</div>
                            )}
                        </div>
                    </div>
                </div>

            </main>

            <style jsx>{`
                .admin-main {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 32px;
                }

                .page-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 32px;
                }

                .page-header h2 {
                    margin: 0;
                    font-size: 1.75rem;
                }

                .last-updated {
                    color: var(--color-text-muted);
                    font-size: 0.875rem;
                }

                .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 24px;
                    margin-bottom: 32px;
                }

                .metric-card {
                    background: white;
                    padding: 24px;
                    border-radius: 12px;
                    border: 1px solid var(--color-border);
                    box-shadow: var(--shadow-sm);
                }

                .metric-card h3 {
                    margin: 0 0 12px 0;
                    font-size: 0.875rem;
                    color: var(--color-text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .metric-card .value {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--color-primary);
                    margin-bottom: 4px;
                }

                .metric-card .sub-value {
                    font-size: 0.875rem;
                    color: var(--color-text-muted);
                }

                .dashboard-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 24px;
                }

                .card {
                    background: white;
                    border-radius: 12px;
                    border: 1px solid var(--color-border);
                    overflow: hidden;
                    box-shadow: var(--shadow-sm);
                }

                .card-header {
                    padding: 20px;
                    border-bottom: 1px solid var(--color-border);
                    background: var(--color-background);
                }

                .card-header h3 {
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 600;
                }

                .analytics-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .analytics-table th {
                    text-align: left;
                    padding: 12px 20px;
                    background: var(--color-background);
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    color: var(--color-text-muted);
                    font-weight: 600;
                    border-bottom: 1px solid var(--color-border);
                }

                .analytics-table td {
                    padding: 16px 20px;
                    border-bottom: 1px solid var(--color-border);
                    font-size: 0.9375rem;
                }

                .analytics-table tr:last-child td {
                    border-bottom: none;
                }

                .text-right {
                    text-align: right;
                }

                .title-cell {
                    max-width: 300px;
                }

                .page-info {
                    display: flex;
                    flex-direction: column;
                }

                .page-info .title {
                    font-weight: 500;
                }

                .page-info .url {
                    font-size: 0.75rem;
                    color: var(--color-text-muted);
                    margin-top: 2px;
                    text-decoration: none;
                }

                .page-info .url:hover {
                    text-decoration: underline;
                    color: var(--color-accent);
                }

                .sources-list {
                    padding: 24px;
                }

                .source-item {
                    margin-bottom: 20px;
                }

                .source-item:last-child {
                    margin-bottom: 0;
                }

                .source-info {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    font-size: 0.9375rem;
                }

                .source-name {
                    text-transform: capitalize;
                    font-weight: 500;
                }

                .source-count {
                    color: var(--color-text-muted);
                }

                .progress-bar-bg {
                    height: 8px;
                    background: var(--color-background);
                    border-radius: 4px;
                    overflow: hidden;
                }

                .progress-bar-fill {
                    height: 100%;
                    background: var(--color-accent);
                    border-radius: 4px;
                }

                .empty-state {
                    text-align: center;
                    padding: 32px !important;
                    color: var(--color-text-muted);
                    font-style: italic;
                }

                @media (max-width: 1024px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </AdminLayoutClient>
    )
}
