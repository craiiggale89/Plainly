'use client'

const useCases = [
  {
    title: 'Faster customer responses',
    description: 'Draft consistent email replies in seconds',
  },
  {
    title: 'Smarter meeting notes',
    description: 'Summarise calls and extract action items automatically',
  },
  {
    title: 'Cleaner admin',
    description: 'Automate data entry between systems',
  },
  {
    title: 'Better first drafts',
    description: 'Generate proposals, reports, and briefs faster',
  },
  {
    title: 'Easier research',
    description: 'Summarise documents, compare suppliers, find answers',
  },
  {
    title: 'Consistent onboarding',
    description: 'Create training materials and guides from existing docs',
  },
  {
    title: 'Internal dashboards',
    description: 'See key metrics without digging through spreadsheets',
  },
  {
    title: 'Workflow automation',
    description: 'Connect tools so data flows without manual input',
  },
]

export default function UseCasesSection() {
  return (
    <section className="use-cases section">
      <div className="container">
        <h2 className="section-title">How businesses like yours are using AI</h2>

        <div className="use-cases-grid">
          {useCases.map((useCase, index) => (
            <div key={index} className="use-case-card">
              <h4 className="use-case-title">{useCase.title}</h4>
              <p className="use-case-description">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .section-title {
          text-align: center;
          margin-bottom: 48px;
        }

        .use-cases-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .use-case-card {
          background: var(--color-background-alt);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 24px;
          transition: all var(--transition-base);
        }

        .use-case-card:hover {
          border-color: var(--color-accent);
          box-shadow: var(--shadow-sm);
          transform: translateY(-2px);
        }

        .use-case-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--color-primary);
        }

        .use-case-description {
          font-size: 0.875rem;
          color: var(--color-text-muted);
          margin: 0;
          line-height: 1.5;
        }

        @media (max-width: 1024px) {
          .use-cases-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .use-cases-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}
