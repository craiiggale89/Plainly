'use client'

import { useState } from 'react'
import Link from 'next/link'
import AdminLayoutClient from '../AdminLayoutClient'

interface ContentPage {
    id: string
    title: string
    url: string
    primary_topic: string | null
    location_focus: string | null
    status: string
    last_reviewed: string | null
    page_views: number | null
    cta_clicks: number | null
    notes: string | null
    has_birmingham_mention: boolean
    has_west_midlands_mention: boolean
    created_at: string
}

const statusColors: Record<string, string> = {
    draft: 'badge-draft',
    published: 'badge-published',
    needs_review: 'badge-review',
}

const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

export default function ContentDashboard({ pages }: { pages: ContentPage[] }) {
    const [statusFilter, setStatusFilter] = useState('')
    const [locationFilter, setLocationFilter] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [sortField, setSortField] = useState<keyof ContentPage>('last_reviewed')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

    const handleSort = (field: keyof ContentPage) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
            if (field === 'created_at' || field === 'page_views') {
                setSortDirection('desc')
            }
        }
    }

    const filteredPages = pages
        .filter(page => {
            if (statusFilter && page.status !== statusFilter) return false
            if (locationFilter && page.location_focus !== locationFilter) return false
            if (searchTerm) {
                const search = searchTerm.toLowerCase()
                return (
                    page.title.toLowerCase().includes(search) ||
                    page.url.toLowerCase().includes(search) ||
                    page.primary_topic?.toLowerCase().includes(search)
                )
            }
            return true
        })
        .sort((a, b) => {
            const aValue = a[sortField]
            const bValue = b[sortField]

            if (aValue === bValue) return 0
            if (aValue === null) return 1
            if (bValue === null) return -1

            const comparison = aValue > bValue ? 1 : -1
            return sortDirection === 'asc' ? comparison : -comparison
        })

    const getSortIcon = (field: keyof ContentPage) => {
        if (sortField !== field) return <span className="sort-icon">↕</span>
        return <span className="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
    }

    return (
        <AdminLayoutClient>
            <main className="admin-main">
                <div className="page-header">
                    <h2>Content & Coverage</h2>
                    <span className="page-count">{filteredPages.length} pages</span>
                    <Link href="/admin/content/new" className="btn btn-primary add-btn">
                        + Add Page
                    </Link>
                </div>

                <div className="filters">
                    <input
                        type="text"
                        placeholder="Search by title, URL, topic..."
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
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="needs_review">Needs Review</option>
                    </select>

                    <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="form-select"
                    >
                        <option value="">All locations</option>
                        <option value="birmingham">Birmingham</option>
                        <option value="west_midlands">West Midlands</option>
                        <option value="uk_wide">UK-wide</option>
                        <option value="none">None</option>
                    </select>
                </div>

                <div className="table-container">
                    <table className="content-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('title')}>Page Title {getSortIcon('title')}</th>
                                <th onClick={() => handleSort('url')}>URL {getSortIcon('url')}</th>
                                <th>Primary Topic</th>
                                <th onClick={() => handleSort('location_focus')}>Location {getSortIcon('location_focus')}</th>
                                <th onClick={() => handleSort('status')}>Status {getSortIcon('status')}</th>
                                <th onClick={() => handleSort('last_reviewed')}>Last Reviewed {getSortIcon('last_reviewed')}</th>
                                <th className="location-icons">📍</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPages.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="empty-state">
                                        No content pages found. <Link href="/admin/content/new">Add your first page</Link> to get started.
                                    </td>
                                </tr>
                            ) : (
                                filteredPages.map(page => (
                                    <tr key={page.id}>
                                        <td>
                                            <div className="page-title">
                                                <span className="title">{page.title}</span>
                                            </div>
                                        </td>
                                        <td className="url-cell">
                                            <a href={page.url} target="_blank" rel="noopener noreferrer" className="url-link">
                                                {page.url}
                                            </a>
                                        </td>
                                        <td className="topic-cell">
                                            {page.primary_topic ? (
                                                <span title={page.primary_topic}>
                                                    {page.primary_topic.length > 40
                                                        ? `${page.primary_topic.substring(0, 40)}...`
                                                        : page.primary_topic}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="capitalize">{page.location_focus?.replace('_', ' ') || '-'}</td>
                                        <td>
                                            <span className={`badge ${statusColors[page.status] || ''}`}>
                                                {page.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="date">{formatDate(page.last_reviewed)}</td>
                                        <td className="location-icons">
                                            {page.has_birmingham_mention && <span title="Birmingham mentioned">B</span>}
                                            {page.has_west_midlands_mention && <span title="West Midlands mentioned">WM</span>}
                                            {!page.has_birmingham_mention && !page.has_west_midlands_mention && <span className="no-location">-</span>}
                                        </td>
                                        <td>
                                            <Link href={`/admin/content/${page.id}`} className="view-link">
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

        .page-count {
          background: var(--color-border);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.875rem;
          color: var(--color-text-muted);
        }

        .add-btn {
          margin-left: auto;
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

        .content-table {
          width: 100%;
          border-collapse: collapse;
        }

        .content-table th {
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

        .content-table th:hover {
          background: var(--color-border);
          color: var(--color-text);
        }

        .content-table td {
          padding: 16px;
          border-bottom: 1px solid var(--color-border);
          font-size: 0.9375rem;
        }

        .content-table tr:last-child td {
          border-bottom: none;
        }

        .content-table tr:hover td {
          background: rgba(61, 139, 139, 0.03);
        }

        .sort-icon {
          display: inline-block;
          margin-left: 4px;
          font-size: 0.75rem;
          width: 12px;
          opacity: 0.5;
        }

        .page-title .title {
          font-weight: 500;
        }

        .url-cell {
          max-width: 200px;
        }

        .url-link {
          color: var(--color-accent);
          font-size: 0.875rem;
          text-decoration: none;
        }

        .url-link:hover {
          text-decoration: underline;
        }

        .topic-cell {
          max-width: 250px;
          color: var(--color-text-muted);
          font-size: 0.875rem;
        }

        .capitalize {
          text-transform: capitalize;
        }

        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .badge-draft {
          background: #F3F4F6;
          color: #6B7280;
        }

        .badge-published {
          background: #DCFCE7;
          color: #15803D;
        }

        .badge-review {
          background: #FEF3C7;
          color: #B45309;
        }

        .date {
          white-space: nowrap;
          color: var(--color-text-muted);
          font-size: 0.8125rem;
        }

        .location-icons {
          text-align: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-accent);
        }

        .location-icons .no-location {
          color: var(--color-text-muted);
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

        .empty-state a {
          color: var(--color-accent);
        }

        @media (max-width: 1024px) {
          .table-container {
            overflow-x: auto;
          }

          .content-table {
            min-width: 900px;
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
