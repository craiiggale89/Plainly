'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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
  readiness_score: number | null
  readiness_answers: Record<string, unknown> | null
  chatbot_conversation_id: string | null
  chatbot_summary: string | null
  created_at: string
  updated_at: string
}

interface Note {
  id: string
  note: string
  created_at: string
}

interface Event {
  id: string
  event_type: string
  event_data: Record<string, unknown> | null
  created_at: string
}

const statusOptions = ['new', 'contacted', 'qualified', 'won', 'archived']

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

export default function LeadDetail({
  lead,
  notes,
  events
}: {
  lead: Lead
  notes: Note[]
  events: Event[]
}) {
  const [status, setStatus] = useState(lead.status)
  const [newNote, setNewNote] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isSavingNote, setIsSavingNote] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    setStatus(newStatus)

    try {
      await supabase
        .from('leads')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', lead.id)

      await supabase.from('lead_events').insert({
        lead_id: lead.id,
        event_type: 'status_change',
        event_data: { from: lead.status, to: newStatus },
      })

      router.refresh()
    } catch (error) {
      console.error('Error updating status:', error)
      setStatus(lead.status)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return

    setIsSavingNote(true)

    try {
      await supabase.from('lead_notes').insert({
        lead_id: lead.id,
        note: newNote.trim(),
      })

      await supabase.from('lead_events').insert({
        lead_id: lead.id,
        event_type: 'note_added',
        event_data: { preview: newNote.substring(0, 50) },
      })

      setNewNote('')
      router.refresh()
    } catch (error) {
      console.error('Error adding note:', error)
    } finally {
      setIsSavingNote(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const copyEmail = () => {
    navigator.clipboard.writeText(lead.email)
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="header-left">
          <Link href="/admin" className="back-link">← Leads</Link>
          <h1>Plainly AI</h1>
          <span className="header-badge">Admin</span>
        </div>
        <button onClick={handleLogout} className="btn btn-ghost">
          Sign out
        </button>
      </header>

      <main className="admin-main">
        <div className="lead-header">
          <div className="lead-title">
            <h2>{lead.first_name || lead.email}</h2>
            {lead.company_name && (
              <span className="company">{lead.company_name}</span>
            )}
          </div>
          <div className="lead-actions">
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdating}
              className="status-select"
            >
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="lead-grid">
          {/* Contact Info */}
          <div className="card-flat lead-card">
            <h3>Contact Information</h3>
            <dl className="info-list">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${lead.email}`}>{lead.email}</a>
                  <button onClick={copyEmail} className="copy-btn" title="Copy email">
                    📋
                  </button>
                </dd>
              </div>
              {lead.phone && (
                <div>
                  <dt>Phone</dt>
                  <dd><a href={`tel:${lead.phone}`}>{lead.phone}</a></dd>
                </div>
              )}
              {lead.first_name && (
                <div>
                  <dt>Name</dt>
                  <dd>{lead.first_name} {lead.last_name || ''}</dd>
                </div>
              )}
              {lead.company_name && (
                <div>
                  <dt>Company</dt>
                  <dd>{lead.company_name}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Qualification Data */}
          <div className="card-flat lead-card">
            <h3>Qualification</h3>
            <dl className="info-list">
              <div>
                <dt>Source</dt>
                <dd className="capitalize">{lead.source.replace('_', ' ')}</dd>
              </div>
              <div>
                <dt>Service Interest</dt>
                <dd className="capitalize">{lead.service_interest || '-'}</dd>
              </div>
              <div className="detail-item">
                <dt>Team Size</dt>
                <dd>{lead.team_size || '-'}</dd>
              </div>
              <div className="detail-item">
                <dt>Main Challenge</dt>
                <dd className="capitalize">{lead.main_challenge?.replace('_', ' ') || '-'}</dd>
              </div>
              {lead.readiness_score !== null && (
                <div>
                  <dt>Readiness Score</dt>
                  <dd>{lead.readiness_score}%</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Lead Score */}
          <div className="card-flat lead-card">
            <h3>Lead Score</h3>
            <div className="score-display">
              <span className={`score-value ${lead.lead_score >= 60 ? 'hot' : lead.lead_score >= 30 ? 'warm' : 'cool'
                }`}>
                {lead.lead_score}
              </span>
              <span className="score-label">
                {lead.lead_score >= 60 ? 'Hot Lead' : lead.lead_score >= 30 ? 'Warm Lead' : 'Cool Lead'}
              </span>
            </div>
            <div className="meta">
              <p>Created: {formatDate(lead.created_at)}</p>
              <p>Updated: {formatDate(lead.updated_at)}</p>
            </div>
          </div>

          {/* Notes */}
          <div className="card-flat lead-card notes-card">
            <h3>Notes</h3>
            <form onSubmit={handleAddNote} className="note-form">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="form-textarea"
                rows={3}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSavingNote || !newNote.trim()}
              >
                {isSavingNote ? 'Saving...' : 'Add Note'}
              </button>
            </form>

            {notes.length > 0 && (
              <div className="notes-list">
                {notes.map(note => (
                  <div key={note.id} className="note-item">
                    <p>{note.note}</p>
                    <span className="note-date">{formatDate(note.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="card-flat lead-card timeline-card">
            <h3>Timeline</h3>
            <div className="timeline">
              {events.map(event => (
                <div key={event.id} className="timeline-item">
                  <span className="timeline-dot" />
                  <div className="timeline-content">
                    <span className="event-type">{event.event_type.replace('_', ' ')}</span>
                    <span className="event-date">{formatDate(event.created_at)}</span>
                  </div>
                </div>
              ))}
              <div className="timeline-item">
                <span className="timeline-dot" />
                <div className="timeline-content">
                  <span className="event-type">Lead Created</span>
                  <span className="event-date">{formatDate(lead.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
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
          gap: 16px;
        }

        .back-link {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 0.875rem;
        }

        .back-link:hover {
          color: white;
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
        }

        .admin-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px;
        }

        .lead-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        .lead-title h2 {
          margin: 0 0 4px 0;
        }

        .company {
          color: var(--color-text-muted);
        }

        .status-select {
          padding: 8px 16px;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          font-size: 0.9375rem;
          text-transform: capitalize;
        }

        .lead-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .lead-card {
          padding: 24px;
        }

        .lead-card h3 {
          font-size: 1rem;
          margin: 0 0 16px 0;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--color-border);
        }

        .info-list {
          margin: 0;
        }

        .info-list > div {
          display: flex;
          padding: 8px 0;
          border-bottom: 1px solid var(--color-border);
        }

        .info-list > div:last-child {
          border-bottom: none;
        }

        .info-list dt {
          width: 120px;
          color: var(--color-text-muted);
          font-size: 0.875rem;
        }

        .info-list dd {
          flex: 1;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .copy-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          opacity: 0.5;
        }

        .copy-btn:hover {
          opacity: 1;
        }

        .capitalize {
          text-transform: capitalize;
        }

        .score-display {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .score-value {
          font-size: 2.5rem;
          font-weight: 600;
        }

        .score-value.hot { color: #15803D; }
        .score-value.warm { color: #B45309; }
        .score-value.cool { color: #6B7280; }

        .score-label {
          color: var(--color-text-muted);
        }

        .meta {
          font-size: 0.875rem;
          color: var(--color-text-muted);
        }

        .meta p {
          margin: 4px 0;
        }

        .notes-card,
        .timeline-card {
          grid-column: span 1;
        }

        .note-form {
          margin-bottom: 20px;
        }

        .note-form textarea {
          margin-bottom: 12px;
        }

        .notes-list {
          border-top: 1px solid var(--color-border);
          padding-top: 16px;
        }

        .note-item {
          padding: 12px 0;
          border-bottom: 1px solid var(--color-border);
        }

        .note-item:last-child {
          border-bottom: none;
        }

        .note-item p {
          margin: 0 0 4px 0;
        }

        .note-date {
          font-size: 0.75rem;
          color: var(--color-text-light);
        }

        .timeline {
          position: relative;
        }

        .timeline-item {
          display: flex;
          gap: 16px;
          padding: 12px 0;
          position: relative;
        }

        .timeline-dot {
          width: 8px;
          height: 8px;
          background: var(--color-accent);
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .timeline-item:not(:last-child)::before {
          content: '';
          position: absolute;
          left: 3px;
          top: 26px;
          width: 2px;
          height: calc(100% - 14px);
          background: var(--color-border);
        }

        .timeline-content {
          display: flex;
          flex-direction: column;
        }

        .event-type {
          text-transform: capitalize;
          font-size: 0.9375rem;
        }

        .event-date {
          font-size: 0.75rem;
          color: var(--color-text-light);
        }

        @media (max-width: 900px) {
          .lead-grid {
            grid-template-columns: 1fr;
          }

          .notes-card,
          .timeline-card {
            grid-column: span 1;
          }
        }

        @media (max-width: 768px) {
          .admin-main {
            padding: 16px;
          }

          .lead-header {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  )
}
