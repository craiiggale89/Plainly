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
              Book a call
            </Link>
          </div>

          <div className="trust-strip">
            <p className="trust-label">Working with the AI tools your team already uses</p>
            <div className="trust-logos">
              <img src="/trust-logos/chatgpt.png" alt="ChatGPT" className="trust-logo" />
              <img src="/trust-logos/copilot.png" alt="Microsoft Copilot" className="trust-logo" />
              <img src="/trust-logos/gemini.png" alt="Google Gemini" className="trust-logo" />
            </div>
            {/* Optional disclaimer if needed in future */}
            {/* <p className="trust-disclaimer">Logos shown to indicate tools we support. No affiliation or endorsement implied.</p> */}
          </div>

          {/* Divider removed as trust logos now act as the separator */}
          {/* <div className="hero-divider" /> */}

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

        /* Divider styles removed */
        .hero-divider {
          display: none;
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

        .trust-strip {
          margin-top: 48px;
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          
          /* Visual Container Styles */
          background-color: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 16px;
          padding: 24px 32px;
          width: 100%;
          backdrop-filter: blur(8px); /* Subtle glass effect for premium feel */
        }

        .trust-label {
          font-size: 0.8125rem;
          color: var(--color-text-muted);
          /* text-transform: uppercase; Removed for softer tone */
          letter-spacing: 0.05em;
          margin: 0;
          opacity: 0.8;
        }

        .trust-logos {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }

        .trust-logo {
          height: 32px; /* Increased from 24px (+33%) for better recognition */
          width: auto;
          opacity: 0.6;
          filter: grayscale(100%);
          transition: opacity 0.2s ease;
        }

        .trust-logo:hover {
          opacity: 0.8;
        }

        @media (max-width: 600px) {
          .trust-logos {
            gap: 24px;
          }
        }
      `}</style>
    </section>
  )
}
