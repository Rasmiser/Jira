// ---------------------------------------------------------------------------
// RASMISER test engine
//
// Deterministic, *simulated* QA test runner for the six client-facing testing
// tools (functional, compatibility, performance, security, ui_ux, automation).
// Each test type has a library of realistic checks; runTestSuite() selects and
// scores them deterministically from a seed so a given run id is reproducible.
//
// Structured behind a single entry point so a real device-farm / CI backend can
// be plugged in later without touching callers.
// ---------------------------------------------------------------------------

export type TestType =
  | "functional"
  | "compatibility"
  | "performance"
  | "security"
  | "ui_ux"
  | "automation"

export type CheckStatus = "pass" | "warn" | "fail"

export interface TestTypeMeta {
  type: TestType
  name: string
  tagline: string
  description: string
  /** lucide icon name resolved in the UI layer */
  icon: string
  /** tailwind text color token used for accents */
  accent: string
  platforms: Array<"android" | "ios" | "web" | "cross">
}

export const TEST_TYPES: TestTypeMeta[] = [
  {
    type: "functional",
    name: "Functional Testing",
    tagline: "Ensure all features work as expected across devices and platforms.",
    description:
      "Validates core user flows, business logic, inputs, and edge cases to confirm every feature behaves as designed.",
    icon: "CheckCircle2",
    accent: "text-violet-400",
    platforms: ["android", "ios", "web", "cross"],
  },
  {
    type: "compatibility",
    name: "Compatibility Testing",
    tagline:
      "Test across multiple devices, OS versions and screen sizes for a seamless experience.",
    description:
      "Runs the app against a matrix of device models, OS versions, screen sizes, and locales to surface fragmentation issues.",
    icon: "Smartphone",
    accent: "text-sky-400",
    platforms: ["android", "ios", "cross"],
  },
  {
    type: "performance",
    name: "Performance Testing",
    tagline:
      "Check speed, stability, load time and app behavior under real-world conditions.",
    description:
      "Measures startup time, frame rate, memory, network, and battery under simulated real-world load and connectivity.",
    icon: "Gauge",
    accent: "text-emerald-400",
    platforms: ["android", "ios", "web", "cross"],
  },
  {
    type: "security",
    name: "Security Testing",
    tagline:
      "Identify vulnerabilities and ensure your app and user data are always protected.",
    description:
      "Probes data storage, transport security, authentication, and resilience for vulnerabilities that expose user data.",
    icon: "Lock",
    accent: "text-orange-400",
    platforms: ["android", "ios", "web", "cross"],
  },
  {
    type: "ui_ux",
    name: "UI/UX Testing",
    tagline: "Validate usability, navigation, layout and overall user experience.",
    description:
      "Audits layout integrity, accessibility, navigation consistency, and visual polish across breakpoints.",
    icon: "LayoutTemplate",
    accent: "text-pink-400",
    platforms: ["android", "ios", "web", "cross"],
  },
  {
    type: "automation",
    name: "Test Automation",
    tagline: "Automate regression testing to save time and increase test coverage.",
    description:
      "Executes the automated regression suite, reporting coverage, flakiness, and stability across the pipeline.",
    icon: "Bot",
    accent: "text-teal-400",
    platforms: ["android", "ios", "web", "cross"],
  },
]

export function getTestTypeMeta(type: string): TestTypeMeta | undefined {
  return TEST_TYPES.find((t) => t.type === type)
}

interface CheckTemplate {
  name: string
  category: string
  detail: string
  recommendation: string
  /** chance this check is degraded (warn/fail) rather than pass */
  riskiness: number
  /** optional metric generator when degraded vs healthy */
  metric?: { healthy: string; degraded: string }
}

const CHECK_LIBRARY: Record<TestType, CheckTemplate[]> = {
  functional: [
    {
      name: "User registration & login flow",
      category: "Authentication",
      detail: "Sign-up, login, and password reset complete successfully end to end.",
      recommendation:
        "Add validation for edge-case inputs and verify session persistence after relaunch.",
      riskiness: 0.2,
    },
    {
      name: "Core navigation paths",
      category: "Navigation",
      detail: "All primary screens are reachable and back-stack behaves correctly.",
      recommendation:
        "Ensure deep links restore the expected navigation state on cold start.",
      riskiness: 0.25,
    },
    {
      name: "Form input validation",
      category: "Forms",
      detail: "Required fields, formats, and error messaging behave as expected.",
      recommendation:
        "Surface inline, field-level error messages and block submission until resolved.",
      riskiness: 0.35,
    },
    {
      name: "Data persistence & sync",
      category: "Data",
      detail: "Created and edited records persist and sync across sessions.",
      recommendation:
        "Add conflict resolution for offline edits and retry failed sync operations.",
      riskiness: 0.3,
    },
    {
      name: "Payments & checkout",
      category: "Commerce",
      detail: "Checkout completes and order confirmation is generated.",
      recommendation:
        "Test declined cards, timeouts, and duplicate-submission guards.",
      riskiness: 0.4,
    },
    {
      name: "Push notification handling",
      category: "Messaging",
      detail: "Notifications are received and route to the correct screen.",
      recommendation: "Verify behavior when the app is backgrounded or killed.",
      riskiness: 0.45,
    },
    {
      name: "Offline mode behavior",
      category: "Resilience",
      detail: "App degrades gracefully without connectivity.",
      recommendation:
        "Cache critical data and show a clear offline state instead of errors.",
      riskiness: 0.5,
    },
  ],
  compatibility: [
    {
      name: "Android version matrix (10–15)",
      category: "OS Versions",
      detail: "App installs and runs across supported Android API levels.",
      recommendation:
        "Guard newer APIs with version checks and test on the minSdk device.",
      riskiness: 0.35,
      metric: { healthy: "15/15 OS", degraded: "12/15 OS" },
    },
    {
      name: "iOS version matrix (15–18)",
      category: "OS Versions",
      detail: "App runs across supported iOS releases without crashes.",
      recommendation: "Validate deprecated API fallbacks on the lowest supported iOS.",
      riskiness: 0.3,
      metric: { healthy: "4/4 OS", degraded: "3/4 OS" },
    },
    {
      name: "Screen size & density",
      category: "Layout",
      detail: "Layouts adapt from small phones to tablets and foldables.",
      recommendation:
        "Use responsive constraints and test on 320dp and tablet widths.",
      riskiness: 0.4,
      metric: { healthy: "12/12 devices", degraded: "9/12 devices" },
    },
    {
      name: "Notch & safe-area handling",
      category: "Layout",
      detail: "Content respects notches, cutouts, and rounded corners.",
      recommendation: "Apply safe-area insets to top and bottom bars.",
      riskiness: 0.35,
    },
    {
      name: "Locale & RTL support",
      category: "Localization",
      detail: "Text, dates, and layouts render correctly across locales.",
      recommendation: "Test RTL mirroring and long-translation truncation.",
      riskiness: 0.45,
    },
    {
      name: "Hardware feature fallbacks",
      category: "Hardware",
      detail: "Camera, biometrics, and sensors degrade gracefully when absent.",
      recommendation: "Feature-detect hardware and disable unsupported flows.",
      riskiness: 0.4,
    },
    {
      name: "Dark mode rendering",
      category: "Theming",
      detail: "All screens render correctly in light and dark themes.",
      recommendation: "Audit hardcoded colors and contrast in dark mode.",
      riskiness: 0.3,
    },
  ],
  performance: [
    {
      name: "Cold start time",
      category: "Startup",
      detail: "Time from launch to first interactive screen.",
      recommendation: "Defer non-critical initialization and lazy-load heavy modules.",
      riskiness: 0.4,
      metric: { healthy: "1.4s", degraded: "3.2s" },
    },
    {
      name: "Frame rate / jank",
      category: "Rendering",
      detail: "Scrolling and animations sustain a smooth frame rate.",
      recommendation: "Reduce overdraw and move heavy work off the main thread.",
      riskiness: 0.4,
      metric: { healthy: "59 fps", degraded: "41 fps" },
    },
    {
      name: "Memory footprint",
      category: "Memory",
      detail: "Peak memory stays within budget without leaks.",
      recommendation: "Profile retained objects and release bitmaps/listeners.",
      riskiness: 0.35,
      metric: { healthy: "180 MB", degraded: "410 MB" },
    },
    {
      name: "API response handling",
      category: "Network",
      detail: "Requests complete within budget on a 3G profile.",
      recommendation: "Add caching, pagination, and request coalescing.",
      riskiness: 0.45,
      metric: { healthy: "620ms", degraded: "2.1s" },
    },
    {
      name: "Battery consumption",
      category: "Power",
      detail: "Background and foreground battery usage stays reasonable.",
      recommendation: "Batch network calls and reduce wake locks / location polling.",
      riskiness: 0.4,
      metric: { healthy: "Low", degraded: "High" },
    },
    {
      name: "App size / bundle",
      category: "Footprint",
      detail: "Download and install size are within store-friendly limits.",
      recommendation: "Enable app bundles, strip unused resources, compress assets.",
      riskiness: 0.3,
      metric: { healthy: "38 MB", degraded: "190 MB" },
    },
    {
      name: "Stability under load",
      category: "Reliability",
      detail: "App remains stable through stress and rapid input.",
      recommendation: "Add backpressure and guard against rapid re-entrancy.",
      riskiness: 0.35,
      metric: { healthy: "0 crashes", degraded: "3 crashes" },
    },
  ],
  security: [
    {
      name: "Data encryption at rest",
      category: "Storage",
      detail: "Sensitive local data is encrypted using platform keystores.",
      recommendation: "Use Android Keystore / iOS Keychain; never store secrets in plaintext.",
      riskiness: 0.4,
    },
    {
      name: "TLS / transport security",
      category: "Network",
      detail: "All traffic uses TLS with modern ciphers; no cleartext.",
      recommendation: "Disable cleartext traffic and enforce ATS / network security config.",
      riskiness: 0.35,
    },
    {
      name: "Certificate pinning",
      category: "Network",
      detail: "Backend connections pin server certificates.",
      recommendation: "Pin public keys with a documented rotation plan.",
      riskiness: 0.5,
    },
    {
      name: "Authentication & session",
      category: "Auth",
      detail: "Tokens expire, rotate, and are stored securely.",
      recommendation: "Use short-lived tokens with secure refresh and revoke on logout.",
      riskiness: 0.4,
    },
    {
      name: "Secrets in binary",
      category: "Secrets",
      detail: "No hardcoded API keys or credentials in the package.",
      recommendation: "Load secrets at runtime from a backend; rotate any exposed keys.",
      riskiness: 0.45,
    },
    {
      name: "Root / jailbreak resilience",
      category: "Resilience",
      detail: "App detects compromised environments and degrades safely.",
      recommendation: "Add root/jailbreak detection for high-risk features.",
      riskiness: 0.5,
    },
    {
      name: "Input sanitization",
      category: "Validation",
      detail: "Inputs are validated to prevent injection and tampering.",
      recommendation: "Validate and encode all untrusted input server-side.",
      riskiness: 0.35,
    },
  ],
  ui_ux: [
    {
      name: "Layout integrity across breakpoints",
      category: "Layout",
      detail: "No overlap, clipping, or overflow at supported sizes.",
      recommendation: "Use flexible constraints and test long-text and small screens.",
      riskiness: 0.35,
    },
    {
      name: "Color contrast (WCAG AA)",
      category: "Accessibility",
      detail: "Text and controls meet AA contrast ratios.",
      recommendation: "Raise contrast for muted text and disabled states to 4.5:1.",
      riskiness: 0.45,
      metric: { healthy: "AA pass", degraded: "3.1:1" },
    },
    {
      name: "Touch target sizing",
      category: "Accessibility",
      detail: "Interactive targets meet minimum 44–48dp sizing.",
      recommendation: "Increase hit areas and spacing for small controls.",
      riskiness: 0.4,
    },
    {
      name: "Screen reader labels",
      category: "Accessibility",
      detail: "Controls and images expose accessible labels.",
      recommendation: "Add content descriptions / accessibility labels to all controls.",
      riskiness: 0.5,
    },
    {
      name: "Navigation consistency",
      category: "Usability",
      detail: "Back, tabs, and gestures behave predictably throughout.",
      recommendation: "Standardize navigation patterns and preserve scroll state.",
      riskiness: 0.3,
    },
    {
      name: "Empty, loading & error states",
      category: "Usability",
      detail: "Every async surface has clear loading, empty, and error states.",
      recommendation: "Add skeletons and actionable error recovery messaging.",
      riskiness: 0.4,
    },
    {
      name: "Visual consistency",
      category: "Design",
      detail: "Spacing, typography, and components follow the design system.",
      recommendation: "Consolidate one-off styles into shared tokens/components.",
      riskiness: 0.3,
    },
  ],
  automation: [
    {
      name: "Regression suite execution",
      category: "Coverage",
      detail: "Automated regression suite runs to completion.",
      recommendation: "Quarantine and fix failing specs before merge.",
      riskiness: 0.3,
      metric: { healthy: "100% run", degraded: "94% run" },
    },
    {
      name: "Code coverage",
      category: "Coverage",
      detail: "Automated tests cover critical paths.",
      recommendation: "Raise coverage on untested business logic and edge cases.",
      riskiness: 0.45,
      metric: { healthy: "82%", degraded: "54%" },
    },
    {
      name: "Flaky test rate",
      category: "Stability",
      detail: "Tests produce consistent results across runs.",
      recommendation: "Stabilize timing-dependent tests with explicit waits.",
      riskiness: 0.45,
      metric: { healthy: "0.4%", degraded: "6.2%" },
    },
    {
      name: "CI pipeline integration",
      category: "Pipeline",
      detail: "Suite runs automatically on each pull request.",
      recommendation: "Gate merges on a green required test workflow.",
      riskiness: 0.35,
    },
    {
      name: "Cross-device test grid",
      category: "Coverage",
      detail: "Automated runs execute across a device matrix.",
      recommendation: "Expand the grid to cover top devices by user share.",
      riskiness: 0.4,
      metric: { healthy: "10 devices", degraded: "3 devices" },
    },
    {
      name: "Average suite duration",
      category: "Pipeline",
      detail: "Full suite completes within the time budget.",
      recommendation: "Parallelize and shard slow suites to cut feedback time.",
      riskiness: 0.35,
      metric: { healthy: "6m 12s", degraded: "23m" },
    },
    {
      name: "Test reporting & artifacts",
      category: "Reporting",
      detail: "Runs publish reports, logs, and failure screenshots.",
      recommendation: "Attach video/screenshot artifacts on failure for triage.",
      riskiness: 0.3,
    },
  ],
}

export interface TestCheckResult {
  name: string
  status: CheckStatus
  category: string
  detail: string
  metric: string | null
  recommendation: string | null
}

export interface TestRunResult {
  score: number // 0-100, higher = better
  grade: string // A-F
  counts: { pass: number; warn: number; fail: number }
  summary: string
  checks: TestCheckResult[]
}

// Seeded PRNG (same approach as scan-engine) for reproducible runs.
function seededRandom(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function gradeForScore(score: number): string {
  if (score >= 90) return "A"
  if (score >= 75) return "B"
  if (score >= 60) return "C"
  if (score >= 40) return "D"
  return "F"
}

/**
 * Produce a deterministic, realistic test run result for a given test type.
 * Replace the body with a real device-farm / CI integration later.
 */
export function runTestSuite(params: {
  runId: string
  testType: TestType
  appName: string
  platform: string
}): TestRunResult {
  const { runId, testType, appName, platform } = params
  const rng = seededRandom(runId + testType + appName + platform)

  const templates = CHECK_LIBRARY[testType]
  const checks: TestCheckResult[] = templates.map((t) => {
    const roll = rng()
    let status: CheckStatus = "pass"
    // riskiness drives the chance of a degraded result; split warn vs fail.
    if (roll < t.riskiness) {
      status = roll < t.riskiness * 0.4 ? "fail" : "warn"
    }
    const healthy = status === "pass"
    return {
      name: t.name,
      status,
      category: t.category,
      detail: t.detail,
      metric: t.metric ? (healthy ? t.metric.healthy : t.metric.degraded) : null,
      recommendation: healthy ? null : t.recommendation,
    }
  })

  const counts = { pass: 0, warn: 0, fail: 0 }
  for (const c of checks) counts[c.status]++

  // Score: pass = full credit, warn = half, fail = none.
  const total = checks.length
  const earned = counts.pass * 1 + counts.warn * 0.5
  const score = Math.round((earned / total) * 100)
  const grade = gradeForScore(score)

  const meta = getTestTypeMeta(testType)
  const summary =
    counts.fail > 0
      ? `${counts.fail} failing and ${counts.warn} at-risk checks need attention.`
      : counts.warn > 0
        ? `All critical checks passed with ${counts.warn} improvement areas.`
        : `All ${total} ${meta?.name.toLowerCase() ?? ""} checks passed cleanly.`

  return { score, grade, counts, summary, checks }
}
