'use client'

const trustPoints = [
  'Based in Birmingham, supporting businesses across the UK',
  'You’ve already got the tools. We just help you get the value',
  'No lock-in contracts. Pay for what you need',
  'Clear, upfront pricing before any work starts',
  'We teach your team to be independent, not dependent',
  'Jargon-free explanations, every step of the way',
]

export default function TrustSection() {
  return (
    <section className="trust section">
      <div className="container">
        <div className="trust-content">
          <h2 className="section-title">Why businesses trust Plainly AI</h2>

          <ul className="trust-list">
            {trustPoints.map((point, index) => (
              <li key={index} className="trust-item">
                <span className="trust-check">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <blockquote className="testimonial">
            <p className="testimonial-quote">
              &ldquo;Quote from early client about clarity, practical results, and straightforward service.&rdquo;
            </p>
            <footer className="testimonial-author">
              Name, Company
            </footer>
          </blockquote>
        </div>
      </div>

      <style jsx>{`
        .trust-content {
          max-width: 700px;
          margin: 0 auto;
        }

        .section-title {
          text-align: center;
          margin-bottom: 40px;
        }

        .trust-list {
          list-style: none;
          padding: 0;
          margin: 0 0 48px 0;
        }

        .trust-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 0;
          font-size: 1.0625rem;
          color: var(--color-text);
        }

        .trust-check {
          color: var(--color-success);
          font-weight: 600;
          flex-shrink: 0;
        }

        .testimonial {
          background: var(--color-background-alt);
          border-left: 4px solid var(--color-accent);
          padding: 24px 32px;
          border-radius: 0 12px 12px 0;
          margin: 0;
        }

        .testimonial-quote {
          font-size: 1.125rem;
          font-style: italic;
          color: var(--color-text);
          line-height: 1.6;
          margin: 0 0 16px 0;
        }

        .testimonial-author {
          font-size: 0.9375rem;
          color: var(--color-text-muted);
        }

        @media (max-width: 768px) {
          .testimonial {
            padding: 20px 24px;
          }
        }
      `}</style>
    </section>
  )
}
