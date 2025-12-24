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
            Whether you need to upskill your team on ChatGPT and Copilot, or build custom tools that save hours every week, we keep things practical, jargon-free, and focused on what works for your business.
          </p>
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
          margin: 0;
        }
      `}</style>
    </section>
  )
}
