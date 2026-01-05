'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Question {
    id: string
    question: string
    options: { label: string; value: string; score: number }[]
}

const questions: Question[] = [
    {
        id: 'current_use',
        question: 'Is your team currently using any AI tools (ChatGPT, Copilot, etc.)?',
        options: [
            { label: 'Yes, regularly and confidently', value: 'regular', score: 20 },
            { label: 'Occasionally, but not sure if we\'re using them well', value: 'occasional', score: 15 },
            { label: 'We\'ve tried them but stopped', value: 'tried', score: 10 },
            { label: 'Not yet, but interested', value: 'interested', score: 5 },
            { label: 'No, and not sure if it\'s relevant', value: 'unsure', score: 0 },
        ],
    },
    {
        id: 'team_size',
        question: 'How many people are in your team?',
        options: [
            { label: 'Just me', value: '1', score: 5 },
            { label: '2-5 people', value: '2-5', score: 10 },
            { label: '6-10 people', value: '6-10', score: 15 },
            { label: '11-25 people', value: '11-25', score: 20 },
            { label: '26-50 people', value: '26-50', score: 20 },
            { label: 'More than 50', value: '50+', score: 15 },
        ],
    },
    {
        id: 'biggest_challenge',
        question: 'What\'s your biggest challenge with AI right now?',
        options: [
            { label: 'Not sure where to start', value: 'start', score: 15 },
            { label: 'Team isn\'t confident using it', value: 'confidence', score: 15 },
            { label: 'Worried about data security or mistakes', value: 'security', score: 10 },
            { label: 'Need something built that doesn\'t exist', value: 'custom', score: 20 },
            { label: 'Too many options, hard to choose', value: 'overwhelm', score: 10 },
        ],
    },
    {
        id: 'time_spent',
        question: 'How much time does your team spend on repetitive admin tasks weekly?',
        options: [
            { label: 'Less than 5 hours', value: 'low', score: 5 },
            { label: '5-10 hours', value: 'medium', score: 15 },
            { label: '10-20 hours', value: 'high', score: 20 },
            { label: 'More than 20 hours', value: 'very-high', score: 25 },
            { label: 'Not sure', value: 'unsure', score: 10 },
        ],
    },
    {
        id: 'interest',
        question: 'What are you most interested in?',
        options: [
            { label: 'Training my team to use AI tools better', value: 'training', score: 15 },
            { label: 'Building custom tools or automations', value: 'build', score: 20 },
            { label: 'Both training and building', value: 'both', score: 25 },
            { label: 'Just exploring what\'s possible', value: 'exploring', score: 5 },
        ],
    },
]

function getReadinessLevel(score: number): {
    label: string
    meaning: string
    nextSteps: string[]
    bridge: string
    color: string
} {
    if (score >= 80) {
        return {
            label: 'AI Ready',
            meaning: 'Your foundations are solid, and you\'re ready to move from experimenting to integrating AI into daily workflows.',
            nextSteps: [
                'Audit where you currently use AI successfully',
                'Create a simple "safe use" policy for the team',
                'Identify one repetitive task to fully automate'
            ],
            bridge: 'Teams at this stage often partner with Enablr to build those custom automations safely.',
            color: '#2D6A4F',
        }
    } else if (score >= 50) {
        return {
            label: 'Getting Ready',
            meaning: 'You have the right mindset, but your team needs more structure to use AI consistently and safely.',
            nextSteps: [
                'Identify the top 3 AI tools relevant to your work',
                'Run a "lunch and learn" to share what\'s working',
                'Set clear boundaries on what data not to share'
            ],
            bridge: 'This is where Enablr typically steps in to provide structured team training.',
            color: '#3D8B8B',
        }
    } else {
        return {
            label: 'Early Stage',
            meaning: 'You are in the exploration phase, perfect for building good habits before things get messy.',
            nextSteps: [
                'Appoint one person as your designated "AI explorer"',
                'Focus on solving one specific pain point first',
                'Start with free tools before committing to subscriptions'
            ],
            bridge: 'Enablr often helps businesses at this stage simply figure out where to start.',
            color: '#D4A574',
        }
    }
}

export default function ReadinessCheckPage() {
    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState<Record<string, { value: string; score: number }>>({})
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isComplete, setIsComplete] = useState(false)

    const totalScore = Object.values(answers).reduce((sum, a) => sum + a.score, 0)
    const maxPossibleScore = questions.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.score)), 0)
    const percentageScore = Math.round((totalScore / maxPossibleScore) * 100)

    const handleOptionSelect = (questionId: string, value: string, score: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: { value, score } }))

        // Auto-advance to next question after a brief delay
        setTimeout(() => {
            if (currentStep < questions.length - 1) {
                setCurrentStep(prev => prev + 1)
            } else {
                setCurrentStep(questions.length) // Move to results/capture form
            }
        }, 300)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setIsSubmitting(true)

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    first_name: firstName,
                    company_name: companyName,
                    source: 'readiness_check',
                    readiness_score: percentageScore,
                    readiness_answers: answers,
                    service_interest: answers.interest?.value || 'exploring',
                    team_size: answers.team_size?.value,
                    main_challenge: answers.biggest_challenge?.value,
                }),
            })

            if (response.ok) {
                setIsComplete(true)
            }
        } catch (error) {
            console.error('Submit error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const readinessLevel = getReadinessLevel(percentageScore)

    return (
        <div className="page-wrapper">
            <Header />

            <main className="readiness-main">
                <div className="container">
                    <div className="readiness-container">
                        {/* Progress indicator */}
                        {currentStep < questions.length && (
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                                />
                            </div>
                        )}

                        {/* Question view */}
                        {currentStep < questions.length && (
                            <div className="question-card">
                                <p className="question-counter">
                                    Question {currentStep + 1} of {questions.length}
                                </p>

                                <h2 className="question-text">
                                    {questions[currentStep].question}
                                </h2>

                                <div className="options-list">
                                    {questions[currentStep].options.map((option) => (
                                        <button
                                            key={option.value}
                                            className={`option-button ${answers[questions[currentStep].id]?.value === option.value ? 'selected' : ''
                                                }`}
                                            onClick={() => handleOptionSelect(
                                                questions[currentStep].id,
                                                option.value,
                                                option.score
                                            )}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>

                                {currentStep > 0 && (
                                    <button
                                        className="back-button"
                                        onClick={() => setCurrentStep(prev => prev - 1)}
                                    >
                                        ← Back
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Results and capture form */}
                        {currentStep >= questions.length && !isComplete && (
                            <div className="results-card">
                                <div className="score-display">
                                    <div
                                        className="score-circle"
                                        style={{ borderColor: readinessLevel.color }}
                                    >
                                        <span className="score-number" style={{ color: readinessLevel.color }}>
                                            {percentageScore}%
                                        </span>
                                    </div>
                                    <h2 className="score-label" style={{ color: readinessLevel.color }}>
                                        {readinessLevel.label}
                                    </h2>
                                </div>

                                <p className="score-meaning">
                                    {readinessLevel.meaning}
                                </p>

                                <div className="results-section">
                                    <h3>Next steps to consider</h3>
                                    <ul className="steps-list">
                                        {readinessLevel.nextSteps.map((step, index) => (
                                            <li key={index}>{step}</li>
                                        ))}
                                    </ul>
                                </div>

                                <p className="score-bridge">
                                    {readinessLevel.bridge}
                                </p>

                                <div className="capture-form">
                                    <h3>Get your personalised recommendations</h3>
                                    <p className="form-intro">
                                        Enter your details below and we&apos;ll send you specific next steps based on your answers.
                                    </p>

                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="firstName" className="form-label">First name</label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="form-input"
                                                placeholder="Your first name"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="email" className="form-label">Email address *</label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="form-input"
                                                placeholder="you@company.com"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="company" className="form-label">Company name</label>
                                            <input
                                                type="text"
                                                id="company"
                                                value={companyName}
                                                onChange={(e) => setCompanyName(e.target.value)}
                                                className="form-input"
                                                placeholder="Your company"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg submit-btn"
                                            disabled={isSubmitting || !email}
                                        >
                                            {isSubmitting ? 'Sending...' : 'Get my recommendations'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Completion screen */}
                        {isComplete && (
                            <div className="complete-card">
                                <div className="complete-icon">✓</div>
                                <h2>Thanks! Check your inbox</h2>
                                <p>
                                    We&apos;ll send your personalised recommendations shortly. In the meantime, you might want to:
                                </p>
                                <div className="complete-actions">
                                    <Link
                                        href="/#book-call"
                                        className="btn btn-primary"
                                    >
                                        Book a call
                                    </Link>
                                    <Link href="/" className="btn btn-secondary">
                                        Return to homepage
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main >

            <Footer />

            <style jsx>{`
        .page-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .readiness-main {
          flex: 1;
          padding: 64px 0;
          background: linear-gradient(to bottom, var(--color-background-alt), var(--color-background));
        }

        .readiness-container {
          max-width: 600px;
          margin: 0 auto;
        }

        .progress-bar {
          height: 4px;
          background: var(--color-border);
          border-radius: 2px;
          margin-bottom: 48px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--color-accent);
          transition: width 0.3s ease;
        }

        .question-card,
        .results-card,
        .complete-card {
          background: white;
          border-radius: 16px;
          padding: 48px;
          box-shadow: var(--shadow-lg);
        }

        .question-counter {
          color: var(--color-text-muted);
          font-size: 0.875rem;
          margin-bottom: 16px;
        }

        .question-text {
          font-size: 1.5rem;
          margin-bottom: 32px;
          line-height: 1.3;
        }

        .options-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .option-button {
          width: 100%;
          text-align: left;
          padding: 16px 20px;
          background: var(--color-background);
          border: 2px solid var(--color-border);
          border-radius: 12px;
          font-size: 1rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .option-button:hover {
          border-color: var(--color-accent);
          background: rgba(61, 139, 139, 0.05);
        }

        .option-button.selected {
          border-color: var(--color-accent);
          background: rgba(61, 139, 139, 0.1);
        }

        .back-button {
          margin-top: 24px;
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          font-size: 0.9375rem;
        }

        .back-button:hover {
          color: var(--color-primary);
        }

        .score-display {
          text-align: center;
          margin-bottom: 24px;
        }

        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 6px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .score-number {
          font-size: 2.5rem;
          font-weight: 600;
        }

        .score-label {
          font-size: 1.5rem;
        }

        .score-description {
            text-align: center;
            color: var(--color-text-muted);
            line-height: 1.6;
            margin-bottom: 40px;
            padding: 0 20px;
        }

        .score-meaning {
            text-align: center;
            font-size: 1.125rem;
            line-height: 1.6;
            margin-bottom: 32px;
            padding: 0 16px;
        }

        .results-section {
            background: var(--color-background);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            text-align: left;
        }

        .results-section h3 {
            font-size: 1rem;
            color: var(--color-primary);
            margin-bottom: 16px;
            font-weight: 600;
        }

        .steps-list {
            margin: 0;
            padding-left: 20px;
            color: var(--color-text);
        }

        .steps-list li {
            margin-bottom: 8px;
            line-height: 1.5;
        }

        .steps-list li:last-child {
            margin-bottom: 0;
        }

        .score-bridge {
            text-align: center;
            font-size: 0.9375rem;
            color: var(--color-text-muted);
            font-style: italic;
            margin-bottom: 40px;
            padding: 0 16px;
        }

        .capture-form h3 {
          margin-bottom: 8px;
        }

        .form-intro {
          color: var(--color-text-muted);
          margin-bottom: 24px;
        }

        .submit-btn {
          width: 100%;
          margin-top: 8px;
        }

        .complete-card {
          text-align: center;
        }

        .complete-icon {
          width: 64px;
          height: 64px;
          background: var(--color-success);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin: 0 auto 24px;
        }

        .complete-card h2 {
          margin-bottom: 16px;
        }

        .complete-card p {
          color: var(--color-text-muted);
          margin-bottom: 32px;
        }

        .complete-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .question-card,
          .results-card,
          .complete-card {
            padding: 32px 24px;
          }

          .question-text {
            font-size: 1.25rem;
          }
        }
      `}</style>
        </div >
    )
}
