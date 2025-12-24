'use client'

import { useState } from 'react'

const faqs = [
  {
    question: "I'm not technical. Is this right for my business?",
    answer: "Absolutely. We work with business owners and team members who aren't from a technical background. That's kind of the point. We explain everything in plain English.",
  },
  {
    question: 'What AI tools do you teach?',
    answer: "We focus on the tools you probably already have: ChatGPT, Microsoft Copilot, Google Workspace AI (Gemini), and similar everyday tools. No specialist software required.",
  },
  {
    question: 'How long does training take?',
    answer: 'Most team training happens in a half-day or full-day session, with follow-up support included. We tailor it to your pace.',
  },
  {
    question: 'Can you build something custom for my business?',
    answer: "Yes. If you need an internal tool, automation, or dashboard that doesn't exist off-the-shelf, we can build it for you, and train your team to use it.",
  },
  {
    question: 'What does it cost?',
    answer: 'We provide a clear, fixed quote after our initial discovery call. No surprises, no hidden fees. Training typically starts from £500; builds vary based on scope.',
  },
  {
    question: 'Do I need to sign a long contract?',
    answer: 'No. We work project-by-project or on short monthly support agreements. No lock-ins.',
  },
  {
    question: "What if I'm not sure what I need?",
    answer: "That's exactly what the discovery call is for. We'll help you figure out what makes sense. If AI isn't the right answer, we'll tell you.",
  },
  {
    question: 'Is my data safe?',
    answer: "We follow UK data protection requirements and only access what's needed for the project. We're happy to sign NDAs or data processing agreements.",
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="faq-item">
      <button
        className="faq-question"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <span className={`faq-icon ${isOpen ? 'open' : ''}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            width="20"
            height="20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </span>
      </button>

      <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
        <p>{answer}</p>
      </div>

      <style jsx>{`
        .faq-item {
          border-bottom: 1px solid var(--color-border);
        }

        .faq-question {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px 0;
          background: none;
          border: none;
          text-align: left;
          font-size: 1.0625rem;
          font-weight: 500;
          color: var(--color-primary);
          cursor: pointer;
          transition: color var(--transition-fast);
        }

        .faq-question:hover {
          color: var(--color-accent);
        }

        .faq-icon {
          flex-shrink: 0;
          transition: transform var(--transition-base);
        }

        .faq-icon.open {
          transform: rotate(180deg);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height var(--transition-slow);
        }

        .faq-answer.open {
          max-height: 200px;
        }

        .faq-answer p {
          padding-bottom: 20px;
          color: var(--color-text-muted);
          line-height: 1.6;
          margin: 0;
        }
      `}</style>
    </div>
  )
}

export default function FAQSection() {
  return (
    <section className="faq section section-alt">
      <div className="container">
        <div className="faq-content">
          <h2 className="section-title">Common questions</h2>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .faq-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .section-title {
          text-align: center;
          margin-bottom: 48px;
        }

        .faq-list {
          border-top: 1px solid var(--color-border);
        }
      `}</style>
    </section>
  )
}
