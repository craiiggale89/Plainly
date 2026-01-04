'use client'

import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Practical AI for your business. Plain and simple.
          </h1>

          <p className="hero-subtitle">
            Enablr helps small businesses in the UK use AI tools confidently, from team training to custom automations that fit your workflow.
          </p>

          <div className="hero-ctas">
            <Link href="/readiness-check" className="btn btn-primary btn-lg hero-btn">
              Start your 4-minute AI readiness check
            </Link>
            <Link href="#book-call" className="btn btn-secondary btn-lg hero-btn">
              Book a discovery call
            </Link>
          </div>

          <div className="hero-divider" />

          <p className="hero-location">
            Based in Birmingham, supporting businesses across the UK
          </p>
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
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          width: 100%;
          max-width: 800px; /* Increased to allow buttons to fit side-by-side */
          margin: 0 auto;
        }

        .hero-btn {
          width: 100%;
          white-space: nowrap;
          padding-left: 24px;
          padding-right: 24px;
        }

        .hero-divider {
          width: 48px;
          height: 3px;
          background-color: var(--color-accent);
          border-radius: 2px;
          margin: 32px auto 24px;
          opacity: 0.5;
        }

        .hero-location {
          margin-top: 0;
          font-size: 0.9375rem;
          color: var(--color-text-muted);
          opacity: 0.8;
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
            grid-template-columns: 1fr;
          }

          .hero-btn {
             width: 100%;
             white-space: normal; /* Allow wrapping on mobile if needed */
          }
        }
      `}</style>
    </section>
  )
}
