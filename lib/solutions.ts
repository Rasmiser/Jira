import type { LucideIcon } from "lucide-react"
import { Smartphone, Apple, ShieldCheck, FileSearch, PackageSearch, GitBranch } from "lucide-react"

export type SolutionPage = {
  slug: string
  // SEO
  metaTitle: string
  metaDescription: string
  keyword: string
  // Hero
  eyebrow: string
  heading: string
  subheading: string
  icon: LucideIcon
  // Body
  intro: string
  capabilities: { title: string; description: string }[]
  faqs: { question: string; answer: string }[]
}

export const solutionPages: SolutionPage[] = [
  {
    slug: "android-app-security-scanner",
    metaTitle: "Android App Security Scanner",
    metaDescription:
      "Scan your Android APK or AAB for security vulnerabilities in minutes. RASMISER finds insecure storage, hardcoded secrets, and OWASP MASVS gaps before attackers do.",
    keyword: "Android app security scanner",
    eyebrow: "For Android teams",
    heading: "Android app security scanner",
    subheading:
      "Upload an APK or AAB and get a full vulnerability report mapped to OWASP MASVS — no source code or SDK required.",
    icon: Smartphone,
    intro:
      "Android apps ship as APK or AAB binaries that anyone can decompile. RASMISER analyzes your build the same way an attacker would, surfacing insecure data storage, hardcoded API keys, weak cryptography, exported components, and misconfigured network security — then tells your team exactly how to fix each one.",
    capabilities: [
      { title: "APK & AAB static analysis", description: "Decompile and inspect DEX, manifest, and resources for risky configurations." },
      { title: "Secret & key detection", description: "Catch hardcoded credentials and tokens embedded in the binary." },
      { title: "Manifest & component review", description: "Flag exported activities, services, and providers that leak data." },
      { title: "Network security checks", description: "Verify TLS pinning, cleartext traffic rules, and certificate handling." },
    ],
    faqs: [
      {
        question: "Do I need to share my source code?",
        answer: "No. RASMISER scans the compiled APK or AAB directly, so you can get results without exposing source.",
      },
      {
        question: "How long does an Android scan take?",
        answer: "Most builds finish in a few minutes. You'll get a severity-ranked report with suggested fixes.",
      },
    ],
  },
  {
    slug: "ios-app-security-testing",
    metaTitle: "iOS App Security Testing",
    metaDescription:
      "Test your iOS IPA for security vulnerabilities. RASMISER checks keychain usage, jailbreak detection, insecure storage, and OWASP MASVS compliance in minutes.",
    keyword: "iOS app security testing",
    eyebrow: "For iOS teams",
    heading: "iOS app security testing",
    subheading:
      "Upload an IPA and get an OWASP MASVS report covering keychain, storage, transport security, and anti-tampering.",
    icon: Apple,
    intro:
      "iOS apps face their own class of risks: weak keychain access policies, missing jailbreak detection, insecure WebViews, and PII leaking into logs or backups. RASMISER inspects your IPA against the OWASP Mobile Application Security Verification Standard and hands you a prioritized, fixable report.",
    capabilities: [
      { title: "IPA static analysis", description: "Inspect binaries, plists, and entitlements for insecure configuration." },
      { title: "Keychain & storage review", description: "Validate keychain accessibility classes and local data protection." },
      { title: "Anti-tampering checks", description: "Detect missing jailbreak and runtime integrity defenses." },
      { title: "Transport security", description: "Confirm ATS settings and certificate pinning are correctly enforced." },
    ],
    faqs: [
      {
        question: "Can I scan an IPA without an Apple Developer account?",
        answer: "Yes. Upload the IPA build directly — RASMISER does not require App Store provisioning to analyze it.",
      },
      {
        question: "Which standards do you check against?",
        answer: "Findings are mapped to OWASP MASVS and the Mobile Top 10, with CWE and CVSS references.",
      },
    ],
  },
  {
    slug: "owasp-masvs-testing",
    metaTitle: "OWASP MASVS Testing & Compliance",
    metaDescription:
      "Automate OWASP MASVS testing for your mobile app. RASMISER maps every finding to MASVS controls and the Mobile Top 10 for clean, audit-ready reports.",
    keyword: "OWASP MASVS testing",
    eyebrow: "Compliance",
    heading: "OWASP MASVS testing, automated",
    subheading:
      "Map every finding to MASVS controls and the Mobile Top 10 to produce audit-ready security reports on demand.",
    icon: ShieldCheck,
    intro:
      "The OWASP Mobile Application Security Verification Standard (MASVS) is the benchmark for mobile app security. Manually verifying each control is slow and error-prone. RASMISER automates the assessment, mapping findings to MASVS categories — storage, crypto, auth, network, platform, and resilience — so you can demonstrate compliance without a manual audit.",
    capabilities: [
      { title: "Full MASVS coverage", description: "Checks across storage, crypto, auth, network, platform, and resilience controls." },
      { title: "Mobile Top 10 mapping", description: "Every finding tied to the OWASP Mobile Top 10 risk categories." },
      { title: "Audit-ready exports", description: "Generate PDF and SARIF reports for auditors and stakeholders." },
      { title: "Continuous verification", description: "Re-run MASVS checks on every release to prevent regressions." },
    ],
    faqs: [
      {
        question: "Is this an official OWASP certification?",
        answer: "No. RASMISER automates testing against the MASVS framework; it does not issue official OWASP certifications.",
      },
      {
        question: "Can I export results for an audit?",
        answer: "Yes. Reports export to PDF and SARIF with full MASVS control mapping included.",
      },
    ],
  },
  {
    slug: "apk-vulnerability-scanner",
    metaTitle: "APK Vulnerability Scanner",
    metaDescription:
      "Free APK vulnerability scanner. Upload your Android package and RASMISER detects malware, insecure storage, and exposed components mapped to OWASP standards.",
    keyword: "APK vulnerability scan",
    eyebrow: "For Android teams",
    heading: "APK vulnerability scanner",
    subheading:
      "Detect malware, insecure storage, and exposed components inside your APK with a severity-ranked report.",
    icon: PackageSearch,
    intro:
      "An APK bundles everything an attacker needs to study your app. RASMISER's APK vulnerability scanner unpacks and analyzes the package for malicious code, suspicious SDKs, insecure storage, debug flags, and tampering exposure, scoring each issue so your team knows what to fix first.",
    capabilities: [
      { title: "Package integrity analysis", description: "Inspect APK structure, signatures, and debug configuration." },
      { title: "Malware & SDK screening", description: "Flag malicious code and risky third-party libraries." },
      { title: "Storage & permission review", description: "Find insecure local data and over-broad permissions." },
      { title: "Severity scoring", description: "Every finding ranked with CVSS so you can prioritize fixes." },
    ],
    faqs: [
      {
        question: "What file types can I scan?",
        answer: "RASMISER accepts APK and AAB files for Android, plus IPA for iOS.",
      },
      {
        question: "Will it detect malware in third-party SDKs?",
        answer: "Yes. The scanner screens bundled SDKs and libraries for known-bad signatures and suspicious behavior.",
      },
    ],
  },
  {
    slug: "ci-cd-mobile-security",
    metaTitle: "CI/CD Mobile App Security",
    metaDescription:
      "Add automated mobile security scanning to your CI/CD pipeline. RASMISER scans every build and fails the pipeline on critical vulnerabilities.",
    keyword: "CI/CD mobile app security",
    eyebrow: "Automation",
    heading: "Mobile security in your CI/CD pipeline",
    subheading:
      "Scan every build automatically and gate releases on critical findings — no manual review required.",
    icon: GitBranch,
    intro:
      "Security that only runs before launch catches issues too late. RASMISER plugs into your CI/CD pipeline to scan every build as it's produced, failing the pipeline when critical or high-severity issues appear so vulnerabilities never reach production.",
    capabilities: [
      { title: "Automated build scanning", description: "Trigger a scan on every commit, branch, or release tag." },
      { title: "Configurable gates", description: "Fail the pipeline on critical or high-severity findings." },
      { title: "SARIF integration", description: "Surface findings directly in your code review and security tooling." },
      { title: "Trend tracking", description: "Watch your security score improve release over release." },
    ],
    faqs: [
      {
        question: "Which CI providers are supported?",
        answer: "RASMISER works with any pipeline that can run a CLI step or call an API, including GitHub Actions, GitLab CI, and Bitbucket.",
      },
      {
        question: "Can I customize the failure threshold?",
        answer: "Yes. Configure gates to fail only on critical issues, or on any finding above a severity you choose.",
      },
    ],
  },
]

export function getSolutionPage(slug: string) {
  return solutionPages.find((p) => p.slug === slug)
}
