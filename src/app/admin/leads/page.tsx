'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Lead {
    id: string
    email: string
    firstName: string | null
    companyName: string | null
    source: string
    leadScore: number
    status: string
    createdAt: string
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchLeads()
    }, [])

    const fetchLeads = async () => {
        try {
            const res = await fetch('/api/admin/leads')
            if (res.ok) {
                const data = await res.json()
                setLeads(data.leads || [])
            }
        } catch (error) {
            console.error('Failed to fetch leads:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'var(--color-success)'
        if (score >= 40) return 'var(--color-warning)'
        return 'var(--color-text-muted)'
    }

    return (
        <div className="leads-page">
            <div className="page-header">
                <h1>Leads</h1>
                <Link href="/admin/leads/discovery" className="btn btn-primary">
                    Discovery Agent
                </Link>
            </div>

            {isLoading ? (
                <div className="loading">Loading leads...</div>
            ) : leads.length === 0 ? (
                <div className="empty-state">
                    <p>No leads yet. Use the Discovery Agent or wait for form submissions.</p>
                </div>
            ) : (
                <div className="leads-table-container">
                    <table className="leads-table">
                        <thead>
                            <tr>
                                <th>Contact</th>
                                <th>Company</th>
                                <th>Source</th>
                                <th>Score</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead) => (
                                <tr key={lead.id}>
                                    <td>
                                        <div className="contact-cell">
                                            <span className="name">{lead.firstName || 'Unknown'}</span>
                                            <span className="email">{lead.email}</span>
                                        </div>
                                    </td>
                                    <td>{lead.companyName || '-'}</td>
                                    <td><span className="source-badge">{lead.source}</span></td>
                                    <td>
                                        <span className="score" style={{ color: getScoreColor(lead.leadScore) }}>
                                            {lead.leadScore}
                                        </span>
                                    </td>
                                    <td><span className={`status-badge ${lead.status}`}>{lead.status}</span></td>
                                    <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <Link href={`/admin/leads/${lead.id}`} className="btn btn-xs btn-ghost">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <style jsx>{`
                .leads-page {
                    padding: 32px;
                }
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 32px;
                }
                .page-header h1 {
                    margin: 0;
                }
                .loading, .empty-state {
                    text-align: center;
                    padding: 48px;
                    color: var(--color-text-muted);
                }
                .leads-table-container {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: var(--shadow-sm);
                }
                .leads-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .leads-table th,
                .leads-table td {
                    padding: 14px 16px;
                    text-align: left;
                    border-bottom: 1px solid var(--color-border);
                }
                .leads-table th {
                    background: var(--color-background-alt);
                    font-weight: 600;
                    font-size: 0.8125rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--color-text-muted);
                }
                .contact-cell {
                    display: flex;
                    flex-direction: column;
                }
                .contact-cell .name {
                    font-weight: 500;
                }
                .contact-cell .email {
                    font-size: 0.875rem;
                    color: var(--color-text-muted);
                }
                .source-badge {
                    background: var(--color-background-alt);
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    text-transform: capitalize;
                }
                .score {
                    font-weight: 600;
                }
                .status-badge {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    text-transform: capitalize;
                }
                .status-badge.new {
                    background: #DBEAFE;
                    color: #1D4ED8;
                }
                .status-badge.contacted {
                    background: #FEF3C7;
                    color: #D97706;
                }
                .status-badge.qualified {
                    background: #D1FAE5;
                    color: #059669;
                }
                .status-badge.closed {
                    background: #E5E7EB;
                    color: #6B7280;
                }
                .btn-xs {
                    padding: 4px 12px;
                    font-size: 0.8125rem;
                }
            `}</style>
        </div>
    )
}
