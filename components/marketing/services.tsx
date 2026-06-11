import {
  Smartphone,
  MonitorSmartphone,
  Gauge,
  Lock,
  LayoutPanelLeft,
  Cog,
  Server,
  Layers,
  BarChart3,
  Headphones,
} from "lucide-react"

const services = [
  {
    icon: Smartphone,
    title: "Functional Testing",
    description: "Ensure all features work as expected across devices and platforms.",
    color: "text-violet-600",
    bg: "bg-violet-100",
  },
  {
    icon: MonitorSmartphone,
    title: "Compatibility Testing",
    description: "Test across multiple devices, OS versions and screen sizes for a seamless experience.",
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    icon: Gauge,
    title: "Performance Testing",
    description: "Check speed, stability, load time and app behavior under real-world conditions.",
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  {
    icon: Lock,
    title: "Security Testing",
    description: "Identify vulnerabilities and ensure your app and user data are always protected.",
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  {
    icon: LayoutPanelLeft,
    title: "UI/UX Testing",
    description: "Validate usability, navigation, layout and overall user experience.",
    color: "text-rose-600",
    bg: "bg-rose-100",
  },
  {
    icon: Cog,
    title: "Test Automation",
    description: "Automate regression testing to save time and increase test coverage.",
    color: "text-teal-600",
    bg: "bg-teal-100",
  },
]

const highlights = [
  {
    icon: Server,
    title: "Built-in test runners",
    description: "Run each suite on demand from your dashboard",
  },
  {
    icon: Layers,
    title: "Android, iOS & cross-platform",
    description: "Comprehensive coverage across platforms",
  },
  {
    icon: BarChart3,
    title: "Scored, actionable reports",
    description: "Clear grades and fixes to improve every release",
  },
  {
    icon: Headphones,
    title: "Guided remediation",
    description: "Plain-English recommendations on every check",
  },
]

export function Services() {
  return (
    <section id="services" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Testing suites</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Self-serve testing built into the platform
          </h2>
          <p className="mt-4 text-pretty text-lg text-slate-600">
            Beyond security scanning, run functional, performance, and UX test suites on your builds — all from your
            RASMISER dashboard, no agency required.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="rounded-xl border border-slate-200 bg-white p-6 text-center transition-shadow hover:shadow-lg hover:shadow-slate-900/5"
            >
              <span
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${s.bg} ${s.color}`}
              >
                <s.icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-slate-600">{s.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((h) => (
              <div key={h.title} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <h.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">{h.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{h.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
