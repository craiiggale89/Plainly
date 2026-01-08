'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface AdminLayoutClientProps {
  children: React.ReactNode
}

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin' || pathname?.startsWith('/admin/leads')
    }
    return pathname?.startsWith(path)
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="header-left">
          <h1>Enablr</h1>
          <span className="header-badge">Admin</span>
        </div>
        <nav className="admin-nav">
          <Link
            href="/admin/leads"
            className={`nav-item ${isActive('/admin/leads') && !isActive('/admin/leads/discovery') ? 'active' : ''}`}
          >
            Leads
          </Link>
          <Link
            href="/admin/leads/discovery"
            className={`nav-item ${isActive('/admin/leads/discovery') ? 'active' : ''}`}
          >
            Discovery Agent ✨
          </Link>
          <Link
            href="/admin/content"
            className={`nav-link ${isActive('/admin/content') ? 'active' : ''}`}
          >
            Content & Coverage
          </Link>
          <Link
            href="/admin/seo"
            className={`nav-item ${isActive('/admin/seo') ? 'active' : ''}`}
          >
            SEO Agent ✨
          </Link>
          <Link
            href="/admin/chatbot"
            className={`nav-link ${isActive('/admin/chatbot') ? 'active' : ''}`}
          >
            Chatbot
          </Link>
          <Link
            href="/admin/analytics"
            className={`nav-link ${isActive('/admin/analytics') ? 'active' : ''}`}
          >
            Analytics
          </Link>
        </nav>
        <button onClick={handleLogout} className="btn btn-ghost">
          Sign out
        </button>
      </header>

      {children}

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
          gap: 24px;
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

        .admin-nav {
          display: flex;
          gap: 8px;
          flex: 1;
          justify-content: center;
        }

        .nav-link {
          color: rgba(255, 255, 255, 0.7);
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.9375rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }

        .nav-link.active {
          color: white;
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}
