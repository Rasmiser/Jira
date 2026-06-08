// ---------------------------------------------------------------------------
// RASMISER scan engine
//
// This is a deterministic *simulated* mobile app security scanner that produces
// realistic OWASP MASVS findings. It is intentionally structured behind a single
// `runScan()` entry point so a real MobSF instance can be plugged in later by
// implementing `runMobSFScan()` and toggling on MOBSF_API_URL / MOBSF_API_KEY.
// ---------------------------------------------------------------------------

export type Severity = "critical" | "high" | "medium" | "low" | "info"

export interface FindingTemplate {
  title: string
  severity: Severity
  category: string
  masvs: string
  description: string
  remediation: string
  reference?: string
  platforms: Array<"android" | "ios">
  // relative likelihood this finding appears in a scan (0-1)
  probability: number
}

export interface ScanResultFinding {
  title: string
  severity: Severity
  category: string
  masvs: string
  description: string
  remediation: string
  reference?: string
}

export interface ScanResult {
  packageName: string
  versionName: string
  riskScore: number // 0-100, higher = riskier
  grade: string // A-F
  findings: ScanResultFinding[]
  counts: {
    critical: number
    high: number
    medium: number
    low: number
  }
}

const FINDING_LIBRARY: FindingTemplate[] = [
  {
    title: "Hardcoded API key found in source",
    severity: "critical",
    category: "Secrets Management",
    masvs: "MASVS-STORAGE-1",
    description:
      "A hardcoded credential resembling a third-party API key was detected in the decompiled application code. Attackers who unpack the binary can extract and abuse this key.",
    remediation:
      "Remove the credential from the codebase and load it at runtime from a secure backend or your platform's secret store. Rotate the exposed key immediately.",
    reference: "https://owasp.org/www-project-mobile-app-security/",
    platforms: ["android", "ios"],
    probability: 0.55,
  },
  {
    title: "Cleartext traffic permitted",
    severity: "high",
    category: "Network Security",
    masvs: "MASVS-NETWORK-1",
    description:
      "The app allows unencrypted HTTP traffic. Data transmitted over cleartext can be intercepted on untrusted networks via man-in-the-middle attacks.",
    remediation:
      "Disable cleartext traffic. On Android set android:usesCleartextTraffic=\"false\" and enforce a network security config; on iOS enforce App Transport Security (ATS).",
    reference: "https://developer.android.com/privacy-and-security/security-config",
    platforms: ["android", "ios"],
    probability: 0.6,
  },
  {
    title: "Weak cryptographic algorithm (MD5/SHA-1)",
    severity: "high",
    category: "Cryptography",
    masvs: "MASVS-CRYPTO-1",
    description:
      "The application uses a cryptographically broken hashing algorithm. MD5 and SHA-1 are vulnerable to collision attacks and must not be used for security-sensitive operations.",
    remediation:
      "Replace MD5/SHA-1 with SHA-256 or stronger. For password storage use a memory-hard KDF such as Argon2 or bcrypt.",
    reference: "https://owasp.org/www-project-mobile-app-security/",
    platforms: ["android", "ios"],
    probability: 0.5,
  },
  {
    title: "Sensitive data stored in plaintext",
    severity: "high",
    category: "Data Storage",
    masvs: "MASVS-STORAGE-1",
    description:
      "User data appears to be written to shared preferences / local storage without encryption. On a compromised or rooted device this data is trivially readable.",
    remediation:
      "Encrypt local data at rest using the Android Keystore / iOS Keychain. Avoid storing sensitive data on the device unless strictly necessary.",
    platforms: ["android", "ios"],
    probability: 0.45,
  },
  {
    title: "Exported activity without permission",
    severity: "medium",
    category: "Platform Interaction",
    masvs: "MASVS-PLATFORM-1",
    description:
      "An Android component is exported and accessible to other apps without a signature-level permission, expanding the attack surface for intent-based attacks.",
    remediation:
      "Set android:exported=\"false\" for components that don't need to be public, or protect them with a signature-level permission.",
    platforms: ["android"],
    probability: 0.4,
  },
  {
    title: "Missing certificate pinning",
    severity: "medium",
    category: "Network Security",
    masvs: "MASVS-NETWORK-2",
    description:
      "The app does not pin server certificates. Without pinning, a forged or rogue CA certificate can enable interception of TLS traffic.",
    remediation:
      "Implement certificate or public-key pinning for connections to your backend APIs, with a documented rotation strategy.",
    platforms: ["android", "ios"],
    probability: 0.5,
  },
  {
    title: "Debuggable build flag enabled",
    severity: "medium",
    category: "Code Quality",
    masvs: "MASVS-RESILIENCE-2",
    description:
      "The application is marked as debuggable. Debuggable builds let attackers attach a debugger, read memory, and bypass logic.",
    remediation:
      "Ensure android:debuggable is false (or unset) in release builds and strip debug symbols before shipping.",
    platforms: ["android"],
    probability: 0.35,
  },
  {
    title: "No root / jailbreak detection",
    severity: "low",
    category: "Resilience",
    masvs: "MASVS-RESILIENCE-1",
    description:
      "The app does not detect rooted or jailbroken devices. While not exploitable on its own, this weakens defense-in-depth for high-value apps.",
    remediation:
      "Add root/jailbreak detection and degrade gracefully (e.g. block high-risk features) when a compromised environment is detected.",
    platforms: ["android", "ios"],
    probability: 0.55,
  },
  {
    title: "Excessive permissions requested",
    severity: "low",
    category: "Privacy",
    masvs: "MASVS-PRIVACY-1",
    description:
      "The manifest requests permissions that appear unrelated to the app's core functionality, increasing privacy risk and review friction.",
    remediation:
      "Audit requested permissions and remove any that are not strictly required. Prefer runtime permission requests scoped to specific features.",
    platforms: ["android", "ios"],
    probability: 0.5,
  },
  {
    title: "Logging of sensitive information",
    severity: "low",
    category: "Data Storage",
    masvs: "MASVS-STORAGE-2",
    description:
      "Calls that may log sensitive values (tokens, PII) were detected. Logs can be read by other apps or extracted from device backups.",
    remediation:
      "Remove or guard sensitive logging behind a debug-only flag, and ensure no secrets reach production logs.",
    platforms: ["android", "ios"],
    probability: 0.45,
  },
]

// Simple seeded PRNG so a given scan id always produces the same result.
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

const SEVERITY_WEIGHT: Record<Severity, number> = {
  critical: 25,
  high: 14,
  medium: 7,
  low: 3,
  info: 0,
}

function gradeForScore(score: number): string {
  if (score >= 80) return "F"
  if (score >= 60) return "D"
  if (score >= 40) return "C"
  if (score >= 20) return "B"
  return "A"
}

function slugToPackage(appName: string, platform: string) {
  const slug = appName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 20) || "app"
  return platform === "ios" ? `com.example.${slug}` : `com.example.${slug}`
}

/**
 * Produce a deterministic, realistic scan result. Replace the body with a call
 * to `runMobSFScan` once a real MobSF instance is configured.
 */
export function runScan(params: {
  scanId: string
  appName: string
  platform: "android" | "ios"
}): ScanResult {
  const { scanId, appName, platform } = params
  const rng = seededRandom(scanId + appName + platform)

  const selected = FINDING_LIBRARY.filter(
    (f) => f.platforms.includes(platform) && rng() < f.probability,
  )

  // Guarantee at least two findings so reports never look empty.
  if (selected.length < 2) {
    const extras = FINDING_LIBRARY.filter(
      (f) => f.platforms.includes(platform) && !selected.includes(f),
    ).slice(0, 2 - selected.length)
    selected.push(...extras)
  }

  const findings: ScanResultFinding[] = selected.map((f) => ({
    title: f.title,
    severity: f.severity,
    category: f.category,
    masvs: f.masvs,
    description: f.description,
    remediation: f.remediation,
    reference: f.reference,
  }))

  const counts = { critical: 0, high: 0, medium: 0, low: 0 }
  let rawScore = 0
  for (const f of findings) {
    rawScore += SEVERITY_WEIGHT[f.severity]
    if (f.severity === "critical") counts.critical++
    else if (f.severity === "high") counts.high++
    else if (f.severity === "medium") counts.medium++
    else if (f.severity === "low") counts.low++
  }

  const riskScore = Math.min(100, rawScore)
  const major = 1 + Math.floor(rng() * 5)
  const minor = Math.floor(rng() * 10)

  return {
    packageName: slugToPackage(appName, platform),
    versionName: `${major}.${minor}.0`,
    riskScore,
    grade: gradeForScore(riskScore),
    findings,
    counts,
  }
}
