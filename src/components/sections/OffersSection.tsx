'use client'

import Link from 'next/link'

const offers = [
    {
        title: 'The Readiness Check',
        for: 'Businesses who want to know where they stand before spending anything.',
        features: [
            'A clear score of your current AI maturity',
            'An impartial gap analysis identifying quick wins',
            'Three practical next steps you can take immediately'
        ],
        cta: 'Start for free',
        href: '/readiness-check',
        primary: true
    },
    {
        title: 'Team Upskilling',
        for: 'Teams using AI tools inconsistently or in secret ("Shadow AI").',
        features: [
            'Practical training on the tools you already have (ChatGPT, Copilot, Gemini)',
            'Prompt engineering frameworks that actually improve work quality',
            'Guidelines on safe, appropriate use'
        ],
        cta: 'See training options',
        href: '#book-call',
        primary: false
    },
    {
        title: 'Focused Builds',
        for: 'Businesses stuck on a specific manual bottleneck.',
        features: [
            'A custom automation or lightweight app built with you',
            'Full handover and documentation so you own the solution',
            'No complex dependencies or black boxes'
        ],
        cta: 'Discuss a project',
        href: '#book-call',
        primary: false
    }
]

export default function OffersSection() {
    return (
        <section className="offers section">
            <div className="container">
                <h2 className="section-title">Three sensible ways to start</h2>

                <div className="offers-grid">
                    {offers.map((offer, index) => (
                        <div key={index} className="offer-card">
                            <h3 className="offer-title">{offer.title}</h3>
                            <p className="offer-for">{offer.for}</p>

                            <ul className="offer-features">
                                {offer.features.map((feature, i) => (
                                    <li key={i}>{feature}</li>
                                ))}
                            </ul>

                            <div className="offer-cta">
                                <Link href={offer.href} className={`btn ${offer.primary ? 'btn-primary' : 'btn-outline'}`}>
                                    {offer.cta}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .section-title {
          text-align: center;
          margin-bottom: 48px;
        }
        
        .offers-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        
        .offer-card {
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          background: var(--color-background);
        }
        
        .offer-title {
          font-size: 1.25rem;
          margin-bottom: 12px;
        }
        
        .offer-for {
          color: var(--color-text-muted);
          font-size: 0.9375rem;
          margin-bottom: 24px;
          line-height: 1.5;
          min-height: 42px;
        }
        
        .offer-features {
          list-style: none;
          padding: 0;
          margin: 0 0 32px 0;
          flex-grow: 1;
        }
        
        .offer-features li {
          padding: 8px 0 8px 16px;
          border-bottom: 1px solid var(--color-border);
          font-size: 0.9375rem;
          color: var(--color-text);
          line-height: 1.5;
          position: relative;
        }
        
        .offer-features li:last-child {
          border-bottom: none;
        }
        
        .offer-features li::before {
          content: '•';
          color: var(--color-accent);
          position: absolute;
          left: 0;
        }

        .offer-cta {
          margin-top: auto;
        }
        
        .btn-outline {
          background: transparent;
          border: 1px solid var(--color-border);
          color: var(--color-text);
        }
        
        .btn-outline:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }
        
        @media (max-width: 900px) {
          .offers-grid {
            grid-template-columns: 1fr;
            max-width: 500px;
            margin: 0 auto;
          }
          
          .offer-for {
             min-height: auto;
          }
        }
      `}</style>
        </section>
    )
}
