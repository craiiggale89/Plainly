'use client'

import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="cta-section section">
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-title">Get a clear, practical view of your AI readiness</h2>

          <p className="cta-text">
            Answer a few simple questions about how your team works today. In about 4 minutes, you&apos;ll receive a personalized breakdown of where you stand and what to focus on next.
          </p>

          <ul className="cta-bullets">
            <li>Your AI Readiness Score</li>
            <li>Gap Analysis</li>
            <li>Practical Next Steps</li>
          </ul>

          <div className="cta-buttons">
            <Link href="/readiness-check" className="btn btn-primary btn-lg">
              Start your 4-minute AI readiness check
            </Link>
          </div>

          <p className="cta-secondary">
            No prep. No sales pitch.
          </p>

          <p className="cta-location">
            Available for on-site sessions across Birmingham and the West Midlands.
          </p>
        </div>
      </div>

      <style jsx>{`
        .cta-section {
          background: linear-gradient(to bottom, var(--color-background), var(--color-background-alt));
        }

        .cta-content {
          max-width: 640px;
          margin: 0 auto;
          text-align: center;
        }

        .cta-title {
          margin-bottom: 20px;
        }

        .cta-text {
          font-size: 1.125rem;
          color: var(--color-text-muted);
          line-height: 1.7;
          margin-bottom: 32px;
        }

        .cta-bullets {
          list-style: none;
          padding: 0;
          margin: 0 0 32px 0;
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .cta-bullets li {
          font-weight: 500;
          color: var(--color-text);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cta-bullets li::before {
          content: '✓';
          color: var(--color-accent);
          font-weight: bold;
        }

        .cta-buttons {
          margin-bottom: 24px;
        }

        .cta-secondary {
          color: var(--color-text-muted);
          margin: 0;
        }

        .cta-link {
          color: var(--color-accent);
          text-decoration: underline;
        }

        .cta-link:hover {
          color: var(--color-accent-dark);
        }

        .cta-location {
          margin-top: 16px;
          font-size: 0.875rem;
          color: var(--color-text-muted);
          opacity: 0.8;
        }
      `}</style>
    </section>
  )
}
