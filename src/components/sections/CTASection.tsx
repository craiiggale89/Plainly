'use client'

import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="cta-section section">
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-title">Ready to move forward with AI?</h2>

          <p className="cta-text">
            Take five minutes to complete our free AI readiness check. You&apos;ll get a clear picture of where you stand, and practical next steps, whether you work with us or not.
          </p>

          <div className="cta-buttons">
            <Link href="/readiness-check" className="btn btn-primary btn-lg">
              Start your free AI readiness check
            </Link>
          </div>

          <p className="cta-secondary">
            Or{' '}
            <Link href="#book-call" className="cta-link">
              book a discovery call
            </Link>
            {' '}if you&apos;d prefer to talk first.
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
