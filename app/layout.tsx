import React from "react"
import type { Metadata } from 'next'
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
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
    default: 'RASMISER - Mobile App Security Scanning',
    template: '%s | RASMISER',
  },
  description: 'Upload your Android or iOS build and get a full OWASP MASVS security report in minutes. Find vulnerabilities before attackers do.',
  applicationName: 'RASMISER',
  keywords: [
    'mobile app security',
    'OWASP MASVS',
    'Android security scan',
    'iOS security scan',
    'app penetration testing',
    'vulnerability scanning',
    'mobile app testing',
  ],
  authors: [{ name: 'RASMISER' }],
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
    siteName: 'RASMISER',
    url: siteUrl,
    title: 'RASMISER - Mobile App Security Scanning',
    description: 'Upload your Android or iOS build and get a full OWASP MASVS security report in minutes. Find vulnerabilities before attackers do.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RASMISER - Mobile App Security Scanning',
    description: 'Upload your Android or iOS build and get a full OWASP MASVS security report in minutes. Find vulnerabilities before attackers do.',
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
        <SpeedInsights />
      </body>
    </html>
  )
}
