'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-left">
            <Link href="/" className="footer-logo">
              <span className="logo-text">Enablr</span>
            </Link>
            <p className="footer-tagline">
              Practical AI for small businesses
            </p>
          </div>

          <div className="footer-right">
            <p className="footer-location">Enablr | Birmingham, UK</p>
            <p className="footer-copyright">
              © {currentYear} Enablr
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <Link href="/privacy" className="footer-link">
            Privacy Policy
          </Link>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background-color: var(--color-primary);
          color: white;
          padding: 48px 0 24px;
          margin-top: auto;
        }

        .footer-inner {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 32px;
          padding-bottom: 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 2px;
          font-size: 1.25rem;
          font-weight: 600;
          text-decoration: none;
          margin-bottom: 8px;
        }

        .logo-text {
          color: white;
        }

        .logo-accent {
          color: var(--color-accent-light);
        }

        .footer-tagline {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          margin: 0;
        }

        .footer-right {
          text-align: right;
        }

        .footer-location {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          margin: 0 0 4px 0;
        }

        .footer-copyright {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.875rem;
          margin: 0;
        }

        .footer-bottom {
          padding-top: 24px;
          text-align: center;
        }

        .footer-link {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.875rem;
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .footer-link:hover {
          color: white;
        }

        @media (max-width: 768px) {
          .footer-inner {
            flex-direction: column;
            text-align: center;
            gap: 24px;
          }

          .footer-right {
            text-align: center;
          }
        }
      `}</style>
    </footer>
  )
}
