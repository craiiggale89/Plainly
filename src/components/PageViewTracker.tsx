'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function PageViewTracker() {
    const pathname = usePathname()

    useEffect(() => {
        // Don't track admin pages
        if (pathname.startsWith('/admin')) return

        // Track the page view
        const trackView = async () => {
            try {
                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        url: window.location.origin + pathname,
                        referrer: document.referrer || null
                    })
                })
            } catch (error) {
                // Silently fail - analytics shouldn't break the site
                console.debug('Analytics tracking failed:', error)
            }
        }

        trackView()
    }, [pathname])

    return null // This component renders nothing
}
