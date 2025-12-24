'use client'

import Link from 'next/link'

const steps = [
  {
    number: '1',
    title: 'Discovery',
    description: "We listen. What's working? What isn't? Where does AI actually make sense for you?",
  },
  {
    number: '2',
    title: 'Pilot',
    description: 'We start small, with a focused training session or a single automation, so you see results quickly.',
  },
  {
    number: '3',
    title: 'Deliver',
    description: 'If it works, we scale it. Full rollout with documentation, training, and handover.',
  },
  {
    number: '4',
    title: 'Support',
    description: "We stay available. Questions, updates, new ideas: just get in touch.",
  },
]

export default function HowItWorksSection() {
  return (
    <section className="how-it-works section section-alt">
      <div className="container">
        <h2 className="section-title">Four simple steps</h2>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="section-cta">
          <Link href="#book-call" className="btn btn-primary btn-lg">
            Start with a discovery call
          </Link>
        </div>
      </div>

      <style jsx>{`
        .section-title {
          text-align: center;
          margin-bottom: 48px;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 48px;
        }

        .step-card {
          text-align: center;
          padding: 32px 24px;
        }

        .step-number {
          width: 48px;
          height: 48px;
          background: var(--color-accent);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 auto 20px;
        }

        .step-title {
          font-size: 1.25rem;
          margin-bottom: 12px;
        }

        .step-description {
          font-size: 0.9375rem;
          color: var(--color-text-muted);
          line-height: 1.6;
          margin: 0;
        }

        .section-cta {
          text-align: center;
        }

        @media (max-width: 900px) {
          .steps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .steps-grid {
            grid-template-columns: 1fr;
          }

          .step-card {
            padding: 24px;
          }
        }
      `}</style>
    </section>
  )
}
