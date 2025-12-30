'use client'

import Link from 'next/link'

export default function ServicesSection() {
  return (
    <section className="services section section-alt">
      <div className="container">
        <div className="section-intro">
          <p className="intro-text">We help you build your own capabilities, not a dependency on ours.</p>
        </div>
        <div className="services-grid">
          {/* Service A: AI Readiness & Team Upskilling */}
          <div className="service-card">
            <div className="service-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>

            <h3 className="service-title">
              Help your team use AI tools with confidence
            </h3>

            <p className="service-description">
              We don&apos;t just teach theory. We teach your team how to use the tools they already have access to: ChatGPT, Microsoft Copilot, and Google Workspace AI, in ways that actually help.
            </p>

            <ul className="service-features">
              <li>
                <strong>Practical skills:</strong> How to write prompts that work, spot errors, and know when AI isn&apos;t the right answer
              </li>
              <li>
                <strong>Safe, structured use:</strong> Clear guidelines so your team knows what&apos;s appropriate
              </li>
              <li>
                <strong>Ongoing support:</strong> We&apos;re available after training to answer questions and troubleshoot
              </li>
            </ul>

            <p className="service-tagline">
              No jargon. No hype. Just clear, confident use of AI in everyday work.
            </p>

            <Link href="/readiness-check" className="btn btn-ghost">
              Take the readiness check →
            </Link>
          </div>

          {/* Service B: Custom Automations & Apps */}
          <div className="service-card">
            <div className="service-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
            </div>

            <h3 className="service-title">
              Custom tools that clear the friction from your workflows
            </h3>

            <p className="service-description">
              When standard software forces you into awkward workarounds, we build the simpler path. We create practical internal tools that handle your specific repetitive tasks—giving your team the clarity and headspace to focus on the work that actually matters.
            </p>

            <ul className="service-features">
              <li>
                <strong>Fits your reality:</strong> Designed around the way you work, eliminating the manual &quot;glue work&quot; and data entry that frustrate your team
              </li>
              <li>
                <strong>No locked boxes:</strong> We hand over clear, documented systems that you can run and manage yourselves, without creating a new dependency
              </li>
              <li>
                <strong>Calm reliability:</strong> We build robust tools that don&apos;t need constant fixing, while remaining available if your business needs change
              </li>
            </ul>

            <p className="service-tagline">
              From automated reports to internal dashboards, we build tools that work, then step back.
            </p>

            <Link href="#book-call" className="btn btn-ghost">
              Tell us what you need →
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .section-intro {
          text-align: center;
          margin-bottom: 40px;
          max-width: 800px;
          margin: 0 auto 40px;
        }

        .intro-text {
          font-size: 1.25rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
        }

        .service-card {
          background: var(--color-background);
          border-radius: 16px;
          padding: 40px;
          border: 1px solid var(--color-border);
        }

        .service-icon {
          width: 48px;
          height: 48px;
          background: rgba(61, 139, 139, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          color: var(--color-accent);
        }

        .service-icon svg {
          width: 24px;
          height: 24px;
        }

        .service-title {
          margin-bottom: 16px;
          font-size: 1.5rem;
        }

        .service-description {
          color: var(--color-text-muted);
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .service-features {
          list-style: none;
          padding: 0;
          margin: 0 0 24px 0;
        }

        .service-features li {
          padding: 12px 0;
          border-bottom: 1px solid var(--color-border);
          color: var(--color-text);
          line-height: 1.5;
        }

        .service-features li:last-child {
          border-bottom: none;
        }

        .service-tagline {
          font-style: italic;
          color: var(--color-text-muted);
          margin-bottom: 24px;
        }

        @media (max-width: 900px) {
          .services-grid {
            grid-template-columns: 1fr;
          }

          .service-card {
            padding: 32px;
          }
        }
      `}</style>
    </section>
  )
}
