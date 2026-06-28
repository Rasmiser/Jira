import React from "react"
import type { Metadata } from 'next'
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Mobile App Security Scanner | Scan iOS & Android Apps for Vulnerabilities — RASMISER',
    template: '%s | RASMISER',
  },
  description: 'Scan your iOS and Android apps for security vulnerabilities in minutes. RASMISER detects OWASP Mobile Top 10 risks, insecure storage, and API flaws — no setup required.',
  applicationName: 'RASMISER',
  keywords: [
    'mobile app security scanner',
    'mobile app security',
    'OWASP Mobile Top 10',
    'OWASP MASVS',
    'Android security scan',
    'iOS security testing',
    'scan APK for vulnerabilities',
    'IPA security scan',
    'app penetration testing',
    'vulnerability scanning',
    'mobile app testing',
    'SAST DAST mobile',
    'CI/CD security scanner',
    'mobile DevSecOps',
  ],
  authors: [{ name: 'RASMISER' }],
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'C5uNEdktK9xRNPDze7O1-poJ8NScQ65sOS_bCQDQfwg',
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
    siteName: 'RASMISER',
    url: siteUrl,
    title: 'Mobile App Security Scanner | Scan iOS & Android Apps for Vulnerabilities — RASMISER',
    description: 'Scan your iOS and Android apps for security vulnerabilities in minutes. RASMISER detects OWASP Mobile Top 10 risks, insecure storage, and API flaws — no setup required.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobile App Security Scanner | Scan iOS & Android Apps for Vulnerabilities — RASMISER',
    description: 'Scan your iOS and Android apps for security vulnerabilities in minutes. RASMISER detects OWASP Mobile Top 10 risks, insecure storage, and API flaws — no setup required.',
  },
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
