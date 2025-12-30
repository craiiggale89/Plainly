'use client'

export default function ValueProposition() {
  return (
    <section className="value-prop section">
      <div className="container">
        <div className="value-prop-content">
          <h2 className="value-title">
            Move forward with AI. Clearly and confidently.
          </h2>

          <p className="value-text">
            Whether you need to upskill your team on ChatGPT and Copilot, or build custom tools that save time and reduce errors, we keep things practical, jargon-free, and focused on what works for your business.
          </p>

          <div className="reassurance-strip">
            <h3 className="reassurance-title">Safe, sensible use comes as standard</h3>
            <ul className="reassurance-list">
              <li>
                <strong>Humans stay in charge:</strong> We set clear boundaries so AI supports your decisions, never replaces them.
              </li>
              <li>
                <strong>Private by design:</strong> Simple, practical setups that keep your business data where it belongs.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .value-prop {
          background-color: var(--color-background);
        }

        .value-prop-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .value-title {
          margin-bottom: 20px;
        }

        .value-text {
          font-size: 1.125rem;
          color: var(--color-text-muted);
          line-height: 1.7;
          margin: 0 0 40px 0;
        }

        .reassurance-strip {
          background: var(--color-background-alt);
          padding: 24px 32px;
          border-radius: 12px;
          text-align: left;
          border: 1px solid var(--color-border);
        }

        .reassurance-title {
          font-size: 1.125rem;
          color: var(--color-primary);
          margin-bottom: 16px;
          text-align: center;
        }

        .reassurance-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .reassurance-list li {
          font-size: 0.9375rem;
          color: var(--color-text-muted);
          line-height: 1.5;
        }

        .reassurance-list strong {
          color: var(--color-text);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .reassurance-list {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 16px;
          }
        }
      `}</style>
    </section>
  )
}
