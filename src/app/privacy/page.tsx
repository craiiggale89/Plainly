'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
    return (
        <>
            <Header />
            <main className="legal-page">
                <div className="container">
                    <h1>Privacy Policy</h1>
                    <p className="last-updated">Last updated: January 2026</p>

                    <section>
                        <h2>Who we are</h2>
                        <p>
                            Enablr is an AI consultancy based in Birmingham, UK. We help small businesses
                            use AI tools practically and confidently.
                        </p>
                    </section>

                    <section>
                        <h2>What we collect</h2>
                        <p>We only collect information you give us directly:</p>
                        <ul>
                            <li>Your name and email when you book a call or complete the readiness check</li>
                            <li>Your company name and any details you share about your business</li>
                            <li>Messages you send through our chatbot</li>
                        </ul>
                        <p>
                            We also collect basic analytics (page views, clicks) to understand how people
                            use our site. This data is anonymised and does not identify you personally.
                        </p>
                    </section>

                    <section>
                        <h2>How we use it</h2>
                        <ul>
                            <li>To respond to your enquiries and schedule calls</li>
                            <li>To improve our services and website</li>
                            <li>To send you relevant follow-up information (only if you&apos;ve requested it)</li>
                        </ul>
                        <p>We do not sell your data. We do not share it with third parties for marketing.</p>
                    </section>

                    <section>
                        <h2>Where we store it</h2>
                        <p>
                            Your data is stored securely using industry-standard tools (Supabase for our database,
                            Vercel for hosting). All connections are encrypted.
                        </p>
                    </section>

                    <section>
                        <h2>Your rights</h2>
                        <p>You can ask us to:</p>
                        <ul>
                            <li>Show you what data we hold about you</li>
                            <li>Correct any mistakes</li>
                            <li>Delete your data entirely</li>
                        </ul>
                        <p>
                            Just email <a href="mailto:contact@enablr.digital">contact@enablr.digital</a> and
                            we&apos;ll sort it within 30 days.
                        </p>
                    </section>

                    <section>
                        <h2>Contact</h2>
                        <p>
                            Questions about your data? Email us at{' '}
                            <a href="mailto:contact@enablr.digital">contact@enablr.digital</a>
                        </p>
                    </section>
                </div>

                <style jsx>{`
                    .legal-page {
                        padding: 80px 0;
                        min-height: 70vh;
                    }
                    .container {
                        max-width: 720px;
                    }
                    h1 {
                        margin-bottom: 8px;
                    }
                    .last-updated {
                        color: var(--color-text-muted);
                        font-size: 0.875rem;
                        margin-bottom: 48px;
                    }
                    section {
                        margin-bottom: 40px;
                    }
                    h2 {
                        font-size: 1.25rem;
                        margin-bottom: 12px;
                    }
                    p {
                        line-height: 1.7;
                        color: var(--color-text);
                        margin-bottom: 16px;
                    }
                    ul {
                        margin: 16px 0;
                        padding-left: 24px;
                    }
                    li {
                        line-height: 1.7;
                        margin-bottom: 8px;
                        color: var(--color-text);
                    }
                    a {
                        color: var(--color-accent);
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                `}</style>
            </main>
            <Footer />
        </>
    )
}
