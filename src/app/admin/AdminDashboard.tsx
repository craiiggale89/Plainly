'use client'

import { useState } from 'react'
import Link from 'next/link'
import AdminLayoutClient from './AdminLayoutClient'

interface Lead {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  company_name: string | null
  phone: string | null
  team_size: string | null
  service_interest: string | null
  main_challenge: string | null
  source: string
  lead_score: number
  status: string
  created_at: string
  updated_at: string
}

const statusColors: Record<string, string> = {
  new: 'badge-new',
  contacted: 'badge-contacted',
  qualified: 'badge-qualified',
  won: 'badge-won',
  archived: 'badge-archived',
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminDashboard({ leads }: { leads: Lead[] }) {
  const [statusFilter, setStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [interestFilter, setInterestFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Lead>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
      if (field === 'created_at' || field === 'lead_score') {
        setSortDirection('desc')
      }
    }
  }

  const filteredLeads = leads
    .filter(lead => {
      if (statusFilter && lead.status !== statusFilter) return false
      if (sourceFilter && lead.source !== sourceFilter) return false
      if (interestFilter && lead.service_interest !== interestFilter) return false
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          lead.email.toLowerCase().includes(search) ||
          lead.first_name?.toLowerCase().includes(search) ||
          lead.company_name?.toLowerCase().includes(search)
        )
      }
      return true
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (aValue === bValue) return 0

      // Handle nulls
      if (aValue === null) return 1
      if (bValue === null) return -1

      const comparison = aValue > bValue ? 1 : -1
      return sortDirection === 'asc' ? comparison : -comparison
    })

  const getSortIcon = (field: keyof Lead) => {
    if (sortField !== field) return <span className="sort-icon">↕</span>
    return <span className="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <AdminLayoutClient>

      <main className="admin-main">
        <div className="page-header">
          <h2>Leads</h2>
          <span className="lead-count">{filteredLeads.length} leads</span>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search by name, email, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input search-input"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
          >
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="won">Won</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="form-select"
          >
            <option value="">All sources</option>
            <option value="form">Form</option>
            <option value="chatbot">Chatbot</option>
            <option value="readiness_check">Readiness Check</option>
          </select>

          <select
            value={interestFilter}
            onChange={(e) => setInterestFilter(e.target.value)}
            className="form-select"
          >
            <option value="">All interests</option>
            <option value="training">Training</option>
            <option value="build">Build</option>
            <option value="both">Both</option>
            <option value="exploring">Exploring</option>
          </select>
        </div>

        <div className="table-container">
          <table className="leads-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('first_name')}>Name {getSortIcon('first_name')}</th>
                <th onClick={() => handleSort('company_name')}>Company {getSortIcon('company_name')}</th>
                <th>Main Challenge</th>
                <th onClick={() => handleSort('service_interest')}>Interest {getSortIcon('service_interest')}</th>
                <th onClick={() => handleSort('status')}>Status {getSortIcon('status')}</th>
                <th onClick={() => handleSort('created_at')}>Created {getSortIcon('created_at')}</th>
                <th onClick={() => handleSort('lead_score')} className="secondary-col">Score {getSortIcon('lead_score')}</th>
                <th onClick={() => handleSort('source')} className="secondary-col">Source {getSortIcon('source')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty-state">
                    No leads found
                  </td>
                </tr>
              ) : (
                filteredLeads.map(lead => (
                  <tr key={lead.id}>
                    <td>
                      <div className="lead-name">
                        <span className="name">{lead.first_name || '-'}</span>
                        <span className="email">{lead.email}</span>
                      </div>
                    </td>
                    <td>{lead.company_name || '-'}</td>
                    <td className="challenge-cell">
                      {lead.main_challenge ? (
                        <span title={lead.main_challenge}>
                          {lead.main_challenge.length > 50
                            ? `${lead.main_challenge.substring(0, 50)}...`
                            : lead.main_challenge}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="capitalize">{lead.service_interest || '-'}</td>
                    <td>
                      <span className={`badge ${statusColors[lead.status] || ''}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="date">{formatDate(lead.created_at)}</td>
                    <td className="secondary-col">
                      <span className={`score ${lead.lead_score >= 60 ? 'hot' : lead.lead_score >= 30 ? 'warm' : 'cool'}`}>
                        {lead.lead_score}
                      </span>
                    </td>
                    <td className="capitalize secondary-col">{lead.source.replace('_', ' ')}</td>
                    <td>
                      <Link href={`/admin/leads/${lead.id}`} className="view-link">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      <style jsx>{`
        .admin-layout {
          min-height: 100vh;
          background: var(--color-background);
        }

        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          background: var(--color-primary);
          color: white;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-left h1 {
          font-size: 1.25rem;
          color: white;
          margin: 0;
        }

        .header-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .admin-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px;
        }

        .page-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .page-header h2 {
          margin: 0;
        }

        .lead-count {
          background: var(--color-border);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.875rem;
          color: var(--color-text-muted);
        }

        .filters {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .search-input {
          flex: 1;
          min-width: 200px;
        }

        .form-select {
          padding: 10px 16px;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          background: white;
          font-size: 0.9375rem;
          cursor: pointer;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          border: 1px solid var(--color-border);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .leads-table {
          width: 100%;
          border-collapse: collapse;
        }

        .leads-table th {
          text-align: left;
          padding: 12px 16px;
          background: var(--color-background);
          font-weight: 500;
          font-size: 0.8125rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--color-border);
          cursor: pointer;
          user-select: none;
          white-space: nowrap;
        }
        
        .leads-table th:hover {
          background: var(--color-border);
          color: var(--color-text);
        }

        .leads-table td {
          padding: 16px;
          border-bottom: 1px solid var(--color-border);
          font-size: 0.9375rem;
        }

        .leads-table tr:last-child td {
          border-bottom: none;
        }

        .leads-table tr:hover td {
          background: rgba(61, 139, 139, 0.03);
        }
        
        .sort-icon {
          display: inline-block;
          margin-left: 4px;
          font-size: 0.75rem;
          width: 12px;
          opacity: 0.5;
        }

        .lead-name {
          display: flex;
          flex-direction: column;
        }

        .lead-name .name {
          font-weight: 500;
        }

        .lead-name .email {
          font-size: 0.8125rem;
          color: var(--color-text-muted);
        }
        
        .challenge-cell {
          max-width: 250px;
          color: var(--color-text-muted);
          font-size: 0.875rem;
        }

        .capitalize {
          text-transform: capitalize;
        }
        
        .secondary-col {
          color: var(--color-text-muted);
          font-size: 0.875rem;
        }

        .score {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 24px;
          border-radius: 4px;
          font-size: 0.8125rem;
          font-weight: 500;
        }

        .score.hot {
          background: #DCFCE7;
          color: #15803D;
        }

        .score.warm {
          background: #FEF3C7;
          color: #B45309;
        }

        .score.cool {
          background: #F3F4F6;
          color: #6B7280;
        }

        .date {
          white-space: nowrap;
          color: var(--color-text-muted);
          font-size: 0.8125rem;
        }

        .view-link {
          color: var(--color-accent);
          font-size: 0.875rem;
          white-space: nowrap;
          font-weight: 500;
        }

        .empty-state {
          text-align: center;
          padding: 48px !important;
          color: var(--color-text-muted);
        }

        @media (max-width: 1024px) {
          .table-container {
            overflow-x: auto;
          }

          .leads-table {
            min-width: 1000px; /* Increased min-width for extra column */
          }
        }

        @media (max-width: 768px) {
          .admin-main {
            padding: 16px;
          }

          .filters {
            flex-direction: column;
          }

          .form-select {
            width: 100%;
          }
        }
      `}</style>
    </AdminLayoutClient>
  )
}
