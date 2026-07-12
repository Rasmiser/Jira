import React from "react"
import type { Metadata, Viewport } from 'next'
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { getSiteUrl } from '@/lib/site'
import './globals.css'

const siteUrl = getSiteUrl()

const instrumentSans = Instrument_Sans({ 
  subsets: ["latin"],
  variable: '--font-instrument'
});

const instrumentSerif = Instrument_Serif({ 
  subsets: ["latin"],
  weight: "400",
  variable: '--font-instrument-serif'
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains'
});

const title = 'RASMISER — Find Mobile App Vulnerabilities Before Attackers Do'
const description =
  'Automated Android & iOS security scanning powered by OWASP MASVS. Upload your APK or IPA, get a full vulnerability report with AI-written fixes in under 5 minutes. Free forever.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: '%s | RASMISER',
  },
  description,
  applicationName: 'RASMISER',
  keywords: [
    'mobile app security',
    'OWASP MASVS',
    'Android security scanning',
    'iOS security scanning',
    'APK vulnerability scanner',
    'IPA security analysis',
    'mobile penetration testing',
    'static analysis mobile',
    'dynamic analysis mobile',
    'CI/CD security gates',
    'app security testing',
    'RASP protection',
    'mobile app vulnerability scanner',
    'free APK scanner',
  ],
  authors: [{ name: 'RASMISER', url: siteUrl }],
  creator: 'RASMISER',
  publisher: 'RASMISER',
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'RASMISER',
    url: siteUrl,
    title,
    description,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RASMISER — Mobile App Security Scanning dashboard showing vulnerability findings and OWASP MASVS compliance',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@rasmiser',
    creator: '@rasmiser',
    title,
    description,
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'RASMISER',
  url: siteUrl,
  description,
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  publisher: {
    '@type': 'Organization',
    name: 'RASMISER',
    url: siteUrl,
  },
  featureList: [
    'Android APK security scanning',
    'iOS IPA security scanning',
    'OWASP MASVS compliance reporting',
    'AI-written vulnerability remediation',
    'CI/CD pipeline integration',
    'Runtime application self-protection',
    '300+ security checks',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
