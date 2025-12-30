'use client'

import { useState } from 'react'

export default function BookingFormSection() {
    const [firstName, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [serviceInterest, setServiceInterest] = useState('both')
    const [mainChallenge, setMainChallenge] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isComplete, setIsComplete] = useState(false)

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
                    service_interest: serviceInterest,
                    main_challenge: mainChallenge,
                    source: 'discovery_call',
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

    if (isComplete) {
        return (
            <section className="booking-section section" id="book-call">
                <div className="container">
                    <div className="booking-card success-card">
                        <div className="success-icon">✓</div>
                        <h2 className="title">Request received</h2>
                        <p className="text">
                            Thanks for reaching out! We&apos;ll be in touch within 24 hours to schedule your discovery call.
                        </p>
                    </div>
                </div>
                <style jsx>{`
                    .booking-section {
                        padding: 80px 0;
                        background: var(--color-background-alt);
                    }
                    .success-card {
                        text-align: center;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 60px 40px;
                        background: white;
                        border-radius: 20px;
                        box-shadow: var(--shadow-lg);
                    }
                    .success-icon {
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
                    .title { margin-bottom: 16px; }
                    .text { color: var(--color-text-muted); line-height: 1.6; }
                `}</style>
            </section>
        )
    }

    return (
        <section className="booking-section section" id="book-call">
            <div className="container">
                <div className="booking-grid">
                    <div className="booking-info">
                        <h2 className="section-title">Book a discovery call</h2>
                        <p className="section-subtitle">
                            Ready to move forward? Tell us a bit about your business and we&apos;ll schedule a time to chat.
                        </p>

                        <ul className="info-list">
                            <li>
                                <span className="icon">⏱️</span>
                                <div>
                                    <strong>15-minute chat</strong>
                                    <span>Quick, low-pressure introduction</span>
                                </div>
                            </li>
                            <li>
                                <span className="icon">📂</span>
                                <div>
                                    <strong>Business focused</strong>
                                    <span>We talk practical results, not technical jargon</span>
                                </div>
                            </li>
                            <li>
                                <span className="icon">📍</span>
                                <div>
                                    <strong>On-site available</strong>
                                    <span>Birmingham & the West Midlands</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="booking-form-container">
                        <form className="booking-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group border-right">
                                    <label htmlFor="booking-name">First name</label>
                                    <input
                                        type="text"
                                        id="booking-name"
                                        placeholder="Your name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="booking-email">Email address</label>
                                    <input
                                        type="email"
                                        id="booking-email"
                                        placeholder="you@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="booking-company">Company name</label>
                                <input
                                    type="text"
                                    id="booking-company"
                                    placeholder="Your company"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="booking-interest">How can we help?</label>
                                <select
                                    id="booking-interest"
                                    value={serviceInterest}
                                    onChange={(e) => setServiceInterest(e.target.value)}
                                >
                                    <option value="training">AI Team Training</option>
                                    <option value="building">Custom AI Building</option>
                                    <option value="both">Both Training & Building</option>
                                    <option value="other">Something else</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="booking-challenge">What is your main challenge right now?</label>
                                <textarea
                                    id="booking-challenge"
                                    rows={3}
                                    placeholder="Briefly describe what you'd like to achieve with AI..."
                                    value={mainChallenge}
                                    onChange={(e) => setMainChallenge(e.target.value)}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sending...' : 'Request a discovery call'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .booking-section {
                    padding: 100px 0;
                    background: var(--color-background-alt);
                }

                .booking-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 80px;
                    align-items: center;
                }

                .section-title {
                    font-size: 2.5rem;
                    margin-bottom: 24px;
                }

                .section-subtitle {
                    font-size: 1.125rem;
                    color: var(--color-text-muted);
                    line-height: 1.6;
                    margin-bottom: 40px;
                }

                .info-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .info-list li {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 24px;
                }

                .info-list .icon {
                    font-size: 1.5rem;
                }

                .info-list strong {
                    display: block;
                    font-size: 1.125rem;
                    margin-bottom: 4px;
                }

                .info-list span {
                    color: var(--color-text-muted);
                    font-size: 0.9375rem;
                }

                .booking-form-container {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: var(--shadow-lg);
                    border: 1px solid var(--color-border);
                }

                .booking-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    border-bottom: 1px solid var(--color-border);
                    padding-bottom: 20px;
                    margin-bottom: 10px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .form-group label {
                    font-weight: 500;
                    font-size: 0.875rem;
                    color: var(--color-text);
                }

                .form-input, 
                .booking-form input,
                .booking-form select,
                .booking-form textarea {
                    padding: 12px 16px;
                    border: 1px solid var(--color-border);
                    border-radius: 8px;
                    font-size: 1rem;
                    background: var(--color-background);
                    transition: border-color var(--transition-fast);
                }

                .booking-form input:focus,
                .booking-form select:focus,
                .booking-form textarea:focus {
                    outline: none;
                    border-color: var(--color-accent);
                }

                .submit-btn {
                    width: 100%;
                    margin-top: 10px;
                }

                @media (max-width: 900px) {
                    .booking-grid {
                        grid-template-columns: 1fr;
                        gap: 48px;
                    }
                    
                    .section-title {
                        font-size: 2rem;
                    }

                    .booking-form-container {
                        padding: 32px 24px;
                    }
                }

                @media (max-width: 600px) {
                    .form-row {
                        grid-template-columns: 1fr;
                        border-bottom: none;
                        padding-bottom: 0;
                        margin-bottom: 0;
                    }
                }
            `}</style>
        </section>
    )
}
