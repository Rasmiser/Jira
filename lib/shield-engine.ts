// ---------------------------------------------------------------------------
// RASMISER shield engine
//
// Defines the no-code runtime protections ("shields") that can be applied to an
// app, the protection levels that bundle them, and a deterministic generator
// for realistic runtime threat events used by the live monitoring views.
// ---------------------------------------------------------------------------

export type ThreatType =
  | "hooking"
  | "tampering"
  | "jailbreak"
  | "root"
  | "mitm"
  | "debugger"
  | "screen_capture"
  | "emulator"

export type ThreatSeverity = "critical" | "high" | "medium" | "low"
export type ThreatAction = "blocked" | "terminated" | "flagged" | "allowed"
export type ProtectionLevel = "standard" | "advanced" | "maximum"

export interface ShieldDef {
  id: string
  name: string
  description: string
  /** threat types this shield mitigates */
  mitigates: ThreatType[]
  /** minimum protection level that enables this shield by default */
  tier: ProtectionLevel
}

export const SHIELDS: ShieldDef[] = [
  {
    id: "anti_tampering",
    name: "Anti-Tampering",
    description:
      "Verifies app integrity at runtime and terminates if the binary, resources, or signature have been modified.",
    mitigates: ["tampering"],
    tier: "standard",
  },
  {
    id: "anti_debugging",
    name: "Anti-Debugging",
    description:
      "Detects attached debuggers (ptrace, JDWP, lldb) and prevents dynamic inspection of the running process.",
    mitigates: ["debugger"],
    tier: "standard",
  },
  {
    id: "root_jailbreak",
    name: "Root / Jailbreak Detection",
    description:
      "Identifies rooted or jailbroken devices and blocks high-risk features on compromised environments.",
    mitigates: ["root", "jailbreak"],
    tier: "standard",
  },
  {
    id: "anti_hooking",
    name: "Anti-Hooking",
    description:
      "Blocks dynamic instrumentation frameworks such as Frida, Xposed, and Substrate from injecting into the app.",
    mitigates: ["hooking"],
    tier: "advanced",
  },
  {
    id: "tls_pinning",
    name: "TLS / Certificate Pinning",
    description:
      "Enforces certificate and public-key pinning to stop man-in-the-middle interception of network traffic.",
    mitigates: ["mitm"],
    tier: "advanced",
  },
  {
    id: "emulator_detection",
    name: "Emulator Detection",
    description:
      "Detects emulated and virtualized environments commonly used for automated attacks and reverse engineering.",
    mitigates: ["emulator"],
    tier: "advanced",
  },
  {
    id: "screen_protection",
    name: "Screen Capture Protection",
    description:
      "Prevents screenshots, screen recording, and overlay attacks on screens that display sensitive data.",
    mitigates: ["screen_capture"],
    tier: "maximum",
  },
  {
    id: "code_obfuscation",
    name: "Code Obfuscation",
    description:
      "Obfuscates control flow, strings, and symbols to slow static reverse engineering of the binary.",
    mitigates: ["tampering", "hooking"],
    tier: "maximum",
  },
]

export const PROTECTION_LEVELS: Record<
  ProtectionLevel,
  { name: string; description: string }
> = {
  standard: {
    name: "Standard",
    description: "Core integrity and environment checks for most apps.",
  },
  advanced: {
    name: "Advanced",
    description: "Adds anti-instrumentation and network hardening.",
  },
  maximum: {
    name: "Maximum",
    description: "Full defense-in-depth for high-value and regulated apps.",
  },
}

const LEVEL_ORDER: ProtectionLevel[] = ["standard", "advanced", "maximum"]

/** Shield ids enabled by default for a given protection level. */
export function defaultShieldsForLevel(level: ProtectionLevel): string[] {
  const maxIndex = LEVEL_ORDER.indexOf(level)
  return SHIELDS.filter((s) => LEVEL_ORDER.indexOf(s.tier) <= maxIndex).map(
    (s) => s.id,
  )
}

export function getShield(id: string): ShieldDef | undefined {
  return SHIELDS.find((s) => s.id === id)
}

// ---------------------------------------------------------------------------
// Compliance posture
//
// Maps enabled shields onto common regulatory / security frameworks. Each
// framework lists the shield ids whose controls it depends on; readiness is the
// share of those controls that are currently enabled on the app.
// ---------------------------------------------------------------------------

export interface ComplianceFramework {
  id: string
  name: string
  full: string
  description: string
  requires: string[]
}

export const COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  {
    id: "masvs",
    name: "OWASP MASVS",
    full: "Mobile Application Security Verification Standard",
    description: "Resilience controls (MASVS-RESILIENCE) for mobile apps.",
    requires: [
      "anti_tampering",
      "anti_debugging",
      "root_jailbreak",
      "anti_hooking",
      "emulator_detection",
      "code_obfuscation",
    ],
  },
  {
    id: "pci",
    name: "PCI DSS",
    full: "Payment Card Industry Data Security Standard",
    description: "Protects stored and transmitted cardholder data.",
    requires: ["tls_pinning", "anti_tampering", "root_jailbreak", "screen_protection"],
  },
  {
    id: "gdpr",
    name: "GDPR",
    full: "General Data Protection Regulation",
    description: "Safeguards processing of EU personal data.",
    requires: ["tls_pinning", "screen_protection", "anti_tampering"],
  },
  {
    id: "hipaa",
    name: "HIPAA",
    full: "Health Insurance Portability and Accountability Act",
    description: "Protects electronic protected health information (ePHI).",
    requires: ["tls_pinning", "screen_protection", "root_jailbreak", "anti_debugging"],
  },
]

export interface ComplianceResult {
  framework: ComplianceFramework
  readiness: number // 0-100
  met: string[]
  missing: string[]
  status: "ready" | "partial" | "gap"
}

export function evaluateCompliance(enabledShields: string[]): ComplianceResult[] {
  const enabled = new Set(enabledShields)
  return COMPLIANCE_FRAMEWORKS.map((framework) => {
    const met = framework.requires.filter((id) => enabled.has(id))
    const missing = framework.requires.filter((id) => !enabled.has(id))
    const readiness = Math.round((met.length / framework.requires.length) * 100)
    const status: ComplianceResult["status"] =
      readiness >= 100 ? "ready" : readiness >= 50 ? "partial" : "gap"
    return { framework, readiness, met, missing, status }
  })
}

// ---------------------------------------------------------------------------
// Threat metadata
// ---------------------------------------------------------------------------

export const THREAT_META: Record<
  ThreatType,
  { label: string; severity: ThreatSeverity; description: string }
> = {
  hooking: {
    label: "Runtime Hooking",
    severity: "critical",
    description: "Frida/Xposed instrumentation attempt detected and blocked.",
  },
  tampering: {
    label: "App Tampering",
    severity: "critical",
    description: "Modified binary or resigned package detected at launch.",
  },
  jailbreak: {
    label: "Jailbroken Device",
    severity: "high",
    description: "App launched on a jailbroken iOS device.",
  },
  root: {
    label: "Rooted Device",
    severity: "high",
    description: "App launched on a rooted Android device.",
  },
  mitm: {
    label: "MITM Interception",
    severity: "high",
    description: "Untrusted certificate presented during TLS handshake.",
  },
  debugger: {
    label: "Debugger Attached",
    severity: "medium",
    description: "Debugger attach attempt detected on the running process.",
  },
  screen_capture: {
    label: "Screen Capture",
    severity: "medium",
    description: "Screenshot or screen recording attempt on a protected screen.",
  },
  emulator: {
    label: "Emulator Detected",
    severity: "low",
    description: "App running inside an emulated or virtualized environment.",
  },
}

export const THREAT_TYPES = Object.keys(THREAT_META) as ThreatType[]

const ACTION_BY_SEVERITY: Record<ThreatSeverity, ThreatAction> = {
  critical: "terminated",
  high: "blocked",
  medium: "blocked",
  low: "flagged",
}

const ANDROID_DEVICES = [
  ["Pixel 8 Pro", "Android 15"],
  ["Samsung Galaxy S24", "Android 14"],
  ["Xiaomi 14", "Android 14"],
  ["OnePlus 12", "Android 14"],
  ["Samsung Galaxy A54", "Android 13"],
  ["Pixel 6a", "Android 14"],
]

const IOS_DEVICES = [
  ["iPhone 15 Pro", "iOS 18.1"],
  ["iPhone 14", "iOS 17.6"],
  ["iPhone 13 mini", "iOS 17.5"],
  ["iPhone SE (3rd gen)", "iOS 18.0"],
  ["iPad Pro 11", "iPadOS 18.1"],
]

const COUNTRIES: Array<[string, string]> = [
  ["United States", "US"],
  ["Germany", "DE"],
  ["Brazil", "BR"],
  ["India", "IN"],
  ["Nigeria", "NG"],
  ["Russia", "RU"],
  ["China", "CN"],
  ["United Kingdom", "GB"],
  ["Indonesia", "ID"],
  ["Vietnam", "VN"],
]

export interface GeneratedThreat {
  threatType: ThreatType
  severity: ThreatSeverity
  action: ThreatAction
  deviceModel: string
  osVersion: string
  country: string
  countryCode: string
  description: string
}

function pick<T>(arr: T[], r: number): T {
  return arr[Math.floor(r * arr.length) % arr.length]
}

/**
 * Generate a single realistic threat event for a protected app. `platform`
 * constrains the device pool and threat mix (jailbreak=iOS, root=Android).
 * Pass a random function so callers can seed determinism if needed.
 */
export function generateThreat(
  platform: "android" | "ios",
  enabledShields: string[],
  rand: () => number = Math.random,
): GeneratedThreat {
  // Which threats are relevant for this platform.
  let candidates = THREAT_TYPES.filter((t) => {
    if (t === "jailbreak") return platform === "ios"
    if (t === "root") return platform === "android"
    return true
  })

  // Weight toward threats the app actually defends against (those generate
  // the most "blocked" events), but keep some that slip through as flagged.
  const mitigated = new Set(
    enabledShields.flatMap((id) => getShield(id)?.mitigates ?? []),
  )
  const weighted = candidates.flatMap((t) =>
    mitigated.has(t) ? [t, t, t] : [t],
  )

  const threatType = pick(weighted, rand())
  const meta = THREAT_META[threatType]
  const [deviceModel, osVersion] =
    platform === "ios"
      ? pick(IOS_DEVICES, rand())
      : pick(ANDROID_DEVICES, rand())
  const [country, countryCode] = pick(COUNTRIES, rand())

  // If a shield covers this threat, it's stopped; otherwise it's only flagged.
  const action: ThreatAction = mitigated.has(threatType)
    ? ACTION_BY_SEVERITY[meta.severity]
    : "flagged"

  return {
    threatType,
    severity: meta.severity,
    action,
    deviceModel,
    osVersion,
    country,
    countryCode,
    description: meta.description,
  }
}
