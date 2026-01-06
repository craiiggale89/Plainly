'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsPage() {
    return (
        <>
            <Header />
            <main className="legal-page">
                <div className="container">
                    <h1>Terms of Service</h1>
                    <p className="last-updated">Last updated: January 2026</p>

                    <section>
                        <h2>What this covers</h2>
                        <p>
                            These terms apply when you use our website, complete our readiness check,
                            or engage with our chatbot. If you work with us on a paid project,
                            we&apos;ll agree separate terms for that work.
                        </p>
                    </section>

                    <section>
                        <h2>Using our site</h2>
                        <p>
                            Our website is provided for informational purposes. While we aim to keep
                            everything accurate, we can&apos;t guarantee that all content is up-to-date
                            or error-free.
                        </p>
                        <p>
                            The readiness check and chatbot provide general guidance only—not specific
                            business, legal, or technical advice tailored to your situation.
                        </p>
                    </section>

                    <section>
                        <h2>Your responsibilities</h2>
                        <ul>
                            <li>Provide accurate information when you contact us</li>
                            <li>Don&apos;t use the site for anything unlawful or harmful</li>
                            <li>Don&apos;t attempt to access systems or data you shouldn&apos;t</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Intellectual property</h2>
                        <p>
                            The content, design, and branding on this site belong to Enablr.
                            You&apos;re welcome to share links, but please don&apos;t copy or reproduce
                            our content without permission.
                        </p>
                    </section>

                    <section>
                        <h2>Limitation of liability</h2>
                        <p>
                            We provide our site and tools in good faith, but we can&apos;t be held
                            responsible for decisions you make based on information found here.
                            For specific advice, we recommend booking a call to discuss your situation.
                        </p>
                    </section>

                    <section>
                        <h2>Changes to these terms</h2>
                        <p>
                            We may update these terms occasionally. If we make significant changes,
                            we&apos;ll note the date at the top of this page.
                        </p>
                    </section>

                    <section>
                        <h2>Contact</h2>
                        <p>
                            Questions? Email us at{' '}
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
