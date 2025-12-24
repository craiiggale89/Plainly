'use client'

import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Practical AI for your business. Without the overwhelm.
          </h1>

          <p className="hero-subtitle">
            Plainly AI helps small businesses in the UK use AI tools confidently, from team training to custom automations that actually work.
          </p>

          <div className="hero-ctas">
            <Link href="/readiness-check" className="btn btn-primary btn-lg">
              Start your free AI readiness check
            </Link>
            <Link href="#book-call" className="btn btn-secondary btn-lg">
              Book a discovery call
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          padding: 96px 0 120px;
          background: linear-gradient(to bottom, var(--color-background-alt), var(--color-background));
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 600;
          line-height: 1.1;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--color-text-muted);
          line-height: 1.6;
          margin-bottom: 40px;
          max-width: 640px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-ctas {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .hero {
            padding: 64px 0 80px;
          }

          .hero-title {
            font-size: 2.25rem;
          }

          .hero-subtitle {
            font-size: 1.125rem;
          }

          .hero-ctas {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </section>
  )
}
