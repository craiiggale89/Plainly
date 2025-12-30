'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSection from '@/components/sections/HeroSection'
import ValueProposition from '@/components/sections/ValueProposition'
import OffersSection from '@/components/sections/OffersSection'
import ServicesSection from '@/components/sections/ServicesSection'
import UseCasesSection from '@/components/sections/UseCasesSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import TrustSection from '@/components/sections/TrustSection'
import FAQSection from '@/components/sections/FAQSection'
import CTASection from '@/components/sections/CTASection'
import BookingFormSection from '@/components/sections/BookingFormSection'
import ChatWidget from '@/components/ChatWidget'

export default function HomePage() {
  return (
    <div className="page-wrapper">
      <Header />

      <main>
        <HeroSection />
        <ValueProposition />
        <OffersSection />
        <ServicesSection />
        <UseCasesSection />
        <HowItWorksSection />
        <TrustSection />
        <FAQSection />
        <CTASection />
        <BookingFormSection />
      </main>

      <Footer />
      <ChatWidget />

      <style jsx>{`
        .page-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        main {
          flex: 1;
        }
      `}</style>
    </div>
  )
}
