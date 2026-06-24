'use client'

import { useEffect } from 'react'

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Optimize images loading
    const optimizeImages = () => {
      const images = document.querySelectorAll('img')
      images.forEach((img) => {
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy')
        }
        if (!img.hasAttribute('decoding')) {
          img.setAttribute('decoding', 'async')
        }
      })
    }

    // Add intersection observer for lazy loading
    const addIntersectionObserver = () => {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              if (img.dataset.src) {
                img.src = img.dataset.src
                img.removeAttribute('data-src')
                observer.unobserve(img)
              }
            }
          })
        })

        const lazyImages = document.querySelectorAll('img[data-src]')
        lazyImages.forEach((img) => imageObserver.observe(img))
      }
    }

    // Optimize fonts loading
    const optimizeFonts = () => {
      if ('fonts' in document) {
        document.fonts.ready.then(() => {
          document.documentElement.classList.add('fonts-loaded')
        })
      }
    }

    // Add performance monitoring
    const addPerformanceMonitoring = () => {
      if ('performance' in window) {
        // Monitor Core Web Vitals
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
              if (entry.entryType === 'largest-contentful-paint') {
                console.log('LCP:', entry.startTime)
              }
              if (entry.entryType === 'first-input') {
                const fidEntry = entry as PerformanceEventTiming
                console.log('FID:', fidEntry.processingStart - fidEntry.startTime)
              }
              if (entry.entryType === 'layout-shift') {
                const clsEntry = entry as any
                console.log('CLS:', clsEntry.value)
              }
            })
        })

        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })

        // Disconnect observer after initial measurements
        setTimeout(() => {
          observer.disconnect()
        }, 10000)
      }
    }

    // Initialize optimizations
    optimizeImages()
    addIntersectionObserver()
    optimizeFonts()
    addPerformanceMonitoring()

    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth'

    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalResources = [
        '/fonts/inter-var.woff2',
        '/og-image.jpg'
      ]

      criticalResources.forEach((resource) => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.href = resource
        if (resource.includes('.woff2')) {
          link.as = 'font'
          link.type = 'font/woff2'
          link.crossOrigin = 'anonymous'
        } else {
          link.as = 'image'
        }
        document.head.appendChild(link)
      })
    }

    preloadCriticalResources()

    // Add service worker registration for caching
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration)
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError)
          })
      })
    }
  }, [])

  return null
}
