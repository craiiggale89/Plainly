'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CookiesPage() {
    return (
        <>
            <Header />
            <main className="legal-page">
                <div className="container">
                    <h1>Cookie Policy</h1>
                    <p className="last-updated">Last updated: January 2026</p>

                    <section>
                        <h2>What are cookies?</h2>
                        <p>
                            Cookies are small text files stored on your device when you visit a website.
                            They help the site remember things about your visit.
                        </p>
                    </section>

                    <section>
                        <h2>What we use</h2>
                        <p>We use a minimal set of cookies:</p>

                        <h3>Essential cookies</h3>
                        <p>
                            These are necessary for the site to function. They handle things like
                            keeping you logged in (if applicable) and remembering your session.
                        </p>

                        <h3>Analytics cookies</h3>
                        <p>
                            We track basic page views and clicks to understand how people use our site.
                            This helps us improve the experience. The data is anonymised and doesn&apos;t
                            identify you personally.
                        </p>
                    </section>

                    <section>
                        <h2>What we don&apos;t use</h2>
                        <ul>
                            <li>Advertising or tracking cookies</li>
                            <li>Third-party marketing cookies</li>
                            <li>Social media tracking pixels</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Managing cookies</h2>
                        <p>
                            You can control cookies through your browser settings. Most browsers let
                            you block or delete cookies. Note that blocking essential cookies may
                            affect how the site works.
                        </p>
                    </section>

                    <section>
                        <h2>Contact</h2>
                        <p>
                            Questions about cookies? Email us at{' '}
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
                    h3 {
                        font-size: 1rem;
                        font-weight: 600;
                        margin: 20px 0 8px;
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
