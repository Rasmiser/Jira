"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Shield, Menu, X } from "lucide-react"
import { useSession } from "@/lib/auth-client"

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Services", href: "#services" },
  { name: "How it works", href: "#how-it-works" },
  { name: "Blog", href: "/blog" },
  { name: "FAQ", href: "#faq" },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const isAuthed = Boolean(session?.user)
  const ctaHref = isAuthed ? "/dashboard" : "/sign-up"
  const ctaLabel = isAuthed ? "Dashboard" : "Start free"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-slate-200 bg-white/90 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">
            <Shield className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">RASMISER</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navLinks.map((l) => (
            <a
              key={l.name}
              href={l.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {l.name}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!isAuthed && (
            <Link
              href="/sign-in"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              Sign in
            </Link>
          )}
          <Link
            href={ctaHref}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {ctaLabel}
          </Link>
        </div>

        <button
          type="button"
          className="text-slate-900 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6" aria-label="Mobile">
            {navLinks.map((l) => (
              <a
                key={l.name}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {l.name}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
              {!isAuthed && (
                <Link href="/sign-in" className="px-2 py-2 text-sm font-medium text-slate-700">
                  Sign in
                </Link>
              )}
              <Link
                href={ctaHref}
                className="rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white"
              >
                {ctaLabel}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
