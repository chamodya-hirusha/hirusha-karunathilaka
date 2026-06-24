'use client'

import { useEffect } from 'react'

interface SEOAnalyticsProps {
  pageTitle?: string
  pagePath?: string
  customDimensions?: Record<string, string>
}

export default function SEOAnalytics({ 
  pageTitle, 
  pagePath, 
  customDimensions = {} 
}: SEOAnalyticsProps) {
  useEffect(() => {
    // Track page views and SEO metrics
    const trackPageView = () => {
      // Google Analytics 4 tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', {
          page_title: pageTitle || document.title,
          page_location: pagePath || window.location.href,
          page_path: pagePath || window.location.pathname,
          ...customDimensions
        })
      }
    }

    // Track Core Web Vitals
    const trackWebVitals = () => {
      if ('web-vital' in window) {
        // Track Largest Contentful Paint
        new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              const lcp = entry.startTime
              console.log('LCP:', lcp)
              
              // Send to analytics
              if (window.gtag) {
                window.gtag('event', 'web_vitals', {
                  metric_name: 'LCP',
                  metric_value: Math.round(lcp),
                  metric_rating: lcp < 2500 ? 'good' : lcp < 4000 ? 'needs_improvement' : 'poor'
                })
              }
            }
          })
        }).observe({ entryTypes: ['largest-contentful-paint'] })

        // Track First Input Delay
        new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'first-input') {
              const fidEntry = entry as PerformanceEventTiming
              const fid = fidEntry.processingStart - fidEntry.startTime
              console.log('FID:', fid)

              if (window.gtag) {
                window.gtag('event', 'web_vitals', {
                  metric_name: 'FID',
                  metric_value: Math.round(fid),
                  metric_rating: fid < 100 ? 'good' : fid < 300 ? 'needs_improvement' : 'poor'
                })
              }
            }
          })
        }).observe({ entryTypes: ['first-input'] })

        // Track Cumulative Layout Shift
        let clsValue = 0
        new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            const clsEntry = entry as any
            if (!clsEntry.hadRecentInput) {
              clsValue += clsEntry.value
            }
          })

          console.log('CLS:', clsValue)

          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              metric_name: 'CLS',
              metric_value: Math.round(clsValue * 1000),
              metric_rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs_improvement' : 'poor'
            })
          }
        }).observe({ entryTypes: ['layout-shift'] })
      }
    }

    // Track SEO-related user interactions
    const trackSEOInteractions = () => {
      // Track scroll depth
      let maxScrollDepth = 0
      const trackScrollDepth = () => {
        const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
        if (scrollDepth > maxScrollDepth) {
          maxScrollDepth = scrollDepth
          
          // Track milestone scroll depths
          if ([25, 50, 75, 90, 100].includes(scrollDepth)) {
            if (window.gtag) {
              window.gtag('event', 'scroll_depth', {
                scroll_depth: scrollDepth,
                page_path: pagePath || window.location.pathname
              })
            }
          }
        }
      }

      // Track time on page
      const startTime = Date.now()
      const trackTimeOnPage = () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000)
        
        // Track milestone time periods
        if ([30, 60, 120, 300, 600].includes(timeOnPage)) {
          if (window.gtag) {
            window.gtag('event', 'time_on_page', {
              time_on_page: timeOnPage,
              page_path: pagePath || window.location.pathname
            })
          }
        }
      }

      // Track external link clicks
      const trackExternalLinks = () => {
        document.addEventListener('click', (event) => {
          const target = event.target as HTMLElement
          const link = target.closest('a')
          
          if (link && link.href && !link.href.includes(window.location.hostname)) {
            if (window.gtag) {
              window.gtag('event', 'click', {
                event_category: 'outbound',
                event_label: link.href,
                page_path: pagePath || window.location.pathname
              })
            }
          }
        })
      }

      // Track form submissions
      const trackFormSubmissions = () => {
        document.addEventListener('submit', (event) => {
          const form = event.target as HTMLFormElement
          if (window.gtag) {
            window.gtag('event', 'form_submit', {
              form_name: form.name || 'contact_form',
              page_path: pagePath || window.location.pathname
            })
          }
        })
      }

      // Initialize tracking
      window.addEventListener('scroll', trackScrollDepth, { passive: true })
      setInterval(trackTimeOnPage, 30000) // Check every 30 seconds
      trackExternalLinks()
      trackFormSubmissions()
    }

    // Track search engine visibility
    const trackSearchVisibility = () => {
      // Track if user came from search engine
      const referrer = document.referrer
      const isSearchEngine = /google|bing|yahoo|duckduckgo/i.test(referrer)
      
      if (isSearchEngine && window.gtag) {
        window.gtag('event', 'search_engine_visit', {
          search_engine: referrer,
          page_path: pagePath || window.location.pathname
        })
      }
    }

    // Initialize all tracking
    trackPageView()
    trackWebVitals()
    trackSEOInteractions()
    trackSearchVisibility()

    // Cleanup function
    return () => {
      // Remove event listeners if needed
      window.removeEventListener('scroll', () => {})
    }
  }, [pageTitle, pagePath, customDimensions])

  return null
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    webVital: any
  }
}
