'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          <Link href="/" className="logo">
            <span className="logo-text">Enab</span>
            <span className="logo-suffix">lr</span>
          </Link>

          <nav className="nav-desktop">
            <Link href="/readiness-check" className="nav-link">
              AI Readiness Check
            </Link>
            <Link href="#book-call" className="btn btn-primary">
              Book a Call
            </Link>
          </nav>

          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="menu-icon"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="nav-mobile">
            <Link
              href="/readiness-check"
              className="nav-link-mobile"
              onClick={() => setMobileMenuOpen(false)}
            >
              AI Readiness Check
            </Link>
            <Link
              href="#book-call"
              className="btn btn-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Book a Call
            </Link>
          </nav>
        )}
      </div>

      <style jsx>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          background-color: rgba(248, 246, 243, 0.95);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--color-border);
        }

        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0;
          font-size: 3rem;
          font-weight: 600;
          text-decoration: none;
        }

        .logo-text {
          color: var(--color-primary);
        }

        .logo-suffix {
          color: var(--color-primary);
          position: relative;
          display: inline-block;
        }

        .logo-suffix::after {
          content: '';
          position: absolute;
          left: -5%;
          bottom: -8px;
          width: 110%;
          height: 6px;
          background-color: var(--color-accent);
          border-radius: 3px;
          opacity: 0.9;
        }

        .nav-desktop {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          color: var(--color-text-muted);
          font-weight: 500;
          transition: color var(--transition-fast);
        }

        .nav-link:hover {
          color: var(--color-primary);
        }

        .mobile-menu-button {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .menu-icon {
          width: 24px;
          height: 24px;
          color: var(--color-primary);
        }

        .nav-mobile {
          display: none;
          flex-direction: column;
          gap: 16px;
          padding: 16px 0 24px;
          border-top: 1px solid var(--color-border);
        }

        .nav-link-mobile {
          display: block;
          padding: 12px 0;
          color: var(--color-text-muted);
          font-weight: 500;
          transition: color var(--transition-fast);
        }

        .nav-link-mobile:hover {
          color: var(--color-primary);
        }

        @media (max-width: 768px) {
          .nav-desktop {
            display: none;
          }

          .mobile-menu-button {
            display: block;
          }

          .nav-mobile {
            display: flex;
          }
        }
      `}</style>
    </header>
  )
}
