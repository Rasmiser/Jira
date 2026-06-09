export type BlogSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  role: string
  date: string
  readingTime: string
  image: string
  imageAlt: string
  intro: string
  sections: BlogSection[]
  takeaway: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: "securing-new-build-apps-before-launch",
    title: "The 7 Security Gaps Hiding in Every New Build App",
    excerpt:
      "Most vulnerabilities ship on day one. Here are the seven issues we catch most often in brand-new mobile apps and how to close them before launch.",
    category: "App Security",
    author: "Sarah Chen",
    role: "Head of Security Research",
    date: "2026-05-28",
    readingTime: "6 min read",
    image: "/images/blog/new-app-vulnerabilities.png",
    imageAlt: "Illustration of a smartphone being scanned for vulnerabilities",
    intro:
      "When a team ships a new mobile app, the pressure is on speed and features, not security. The result is predictable: the same handful of vulnerabilities appear in build after build, long before a single attacker shows up. The good news is that these gaps are easy to find and close when you scan early.",
    sections: [
      {
        heading: "1. Hardcoded secrets and API keys",
        paragraphs: [
          "Embedding API keys, tokens, or credentials directly in the app is the single most common issue we find in new builds. Anyone can decompile an APK or IPA in minutes and read those strings in plain text.",
          "RASMISER decompiles every build and flags hardcoded secrets automatically, mapping each finding to OWASP MASVS so your team knows exactly what to rotate and where.",
        ],
      },
      {
        heading: "2. Insecure data storage",
        paragraphs: [
          "New apps frequently cache sensitive data, including auth tokens and personal information, in unencrypted local storage or shared preferences. On a rooted or jailbroken device, that data is trivial to extract.",
        ],
        bullets: [
          "Unencrypted SQLite databases and preference files",
          "Sensitive values written to logs",
          "Backups that include private user data",
        ],
      },
      {
        heading: "3. Weak transport security",
        paragraphs: [
          "Missing TLS, accepting self-signed certificates, or skipping certificate pinning leaves apps open to man-in-the-middle attacks on public networks. Our dynamic analysis exercises the running app and reports exactly which connections are exposed.",
        ],
      },
      {
        heading: "4. Over-permissioned components",
        paragraphs: [
          "Exported activities, broadcast receivers, and content providers that should be private are a frequent oversight in early builds. They give other apps an entry point you never intended to open.",
        ],
      },
      {
        heading: "How RASMISER closes the gap before launch",
        paragraphs: [
          "Instead of waiting for a manual pentest weeks before release, you upload a build and get a prioritized report in minutes. Every finding includes a plain-English explanation, the real-world impact, and a concrete suggested fix your developers can act on the same day.",
          "Teams that wire RASMISER into CI catch these seven issues automatically on every commit, so a critical finding fails the build instead of reaching the store.",
        ],
      },
    ],
    takeaway:
      "The vulnerabilities that sink new apps are well understood and entirely preventable. Scanning early turns a launch-blocking surprise into a routine, five-minute checklist.",
  },
  {
    slug: "securing-ai-powered-mobile-apps",
    title: "Securing AI-Powered Apps: The New Attack Surface",
    excerpt:
      "LLM features, on-device models, and AI APIs introduce risks traditional scanners miss. Here is what changes and how we help teams ship AI safely.",
    category: "Emerging Tech",
    author: "Marcus Webb",
    role: "Principal Security Engineer",
    date: "2026-06-04",
    readingTime: "7 min read",
    image: "/images/blog/ai-app-risks.png",
    imageAlt: "Illustration of a mobile app connected to an AI neural network with a padlock",
    intro:
      "Almost every new app now ships an AI feature, a chat assistant, a recommendation model, or a call to an external LLM. These capabilities create an attack surface that did not exist two years ago, and most security tooling has not caught up. Here is what teams building AI features need to watch for.",
    sections: [
      {
        heading: "Prompt injection reaches the mobile client",
        paragraphs: [
          "When an app passes user input or untrusted content into an LLM prompt, an attacker can craft input that overrides your instructions, leaks system prompts, or triggers unintended actions. On mobile, this often combines with insecure deep links or clipboard data to escalate quickly.",
          "We analyze how your app constructs prompts and where untrusted data flows into them, flagging the paths most likely to be abused.",
        ],
      },
      {
        heading: "Leaking model and provider keys",
        paragraphs: [
          "Calling an AI provider directly from the client almost always means an API key is sitting in the binary. Beyond the obvious credential theft, attackers can rack up usage costs or abuse your account. RASMISER detects embedded keys and flags direct client-to-provider calls that should be proxied through your backend.",
        ],
      },
      {
        heading: "On-device models and data exposure",
        paragraphs: [
          "On-device inference is great for privacy and latency, but bundled model files, training data, and inference logs can expose intellectual property or sensitive user data if stored insecurely.",
        ],
        bullets: [
          "Model files left world-readable in app storage",
          "Inference inputs and outputs written to plaintext logs",
          "Insufficient validation of model responses before acting on them",
        ],
      },
      {
        heading: "How we help teams ship AI features safely",
        paragraphs: [
          "RASMISER treats AI integrations as first-class citizens in the scan. We identify where untrusted input meets model calls, where keys are exposed, and where AI-derived data is stored or logged insecurely, then explain each risk in terms your team can act on.",
          "Combined with runtime protection, teams can ship AI-powered apps with anti-tampering and TLS pinning in place, so the model endpoints and the data flowing to them stay protected after launch.",
        ],
      },
    ],
    takeaway:
      "AI features expand what your app can do and what attackers can target. Treating the AI layer as part of your security scan, not an afterthought, is the difference between a confident launch and an expensive incident.",
  },
  {
    slug: "shift-left-security-cicd-mobile",
    title: "Shift Left: Making Security a Build Step, Not a Blocker",
    excerpt:
      "Security checks at the end of a release cycle slow everyone down. Here is how automated scanning in CI/CD keeps teams fast and clients confident.",
    category: "DevSecOps",
    author: "Elena Rodriguez",
    role: "VP of Engineering",
    date: "2026-06-09",
    readingTime: "5 min read",
    image: "/images/blog/shift-left-cicd.png",
    imageAlt: "Illustration of a CI/CD pipeline with a security gate",
    intro:
      "The slowest way to do security is to leave it until the end. A manual pentest the week before launch finds problems when they are most expensive to fix and most likely to delay a release. Shifting security left, into the build pipeline itself, keeps teams fast and gives clients real confidence in every release.",
    sections: [
      {
        heading: "Why end-of-cycle security fails",
        paragraphs: [
          "When findings arrive days before launch, teams face a bad choice: delay the release or ship with known risks. Neither outcome makes clients happy, and both erode trust over time.",
          "Catching issues at commit time changes the economics entirely. A finding fixed the moment it is introduced costs a fraction of one discovered in a pre-launch audit.",
        ],
      },
      {
        heading: "Security as an automated build step",
        paragraphs: [
          "RASMISER plugs into GitHub, GitLab, and Bitbucket pipelines. Every build is scanned automatically, and you set the policy: warn on medium findings, fail the build on critical ones.",
        ],
        bullets: [
          "Scans trigger on every pull request and merge",
          "Critical findings block the release automatically",
          "Results export as SARIF and JSON for your existing tools",
        ],
      },
      {
        heading: "Turning security into a client-facing advantage",
        paragraphs: [
          "When security is continuous, you can show clients exactly where they stand. Every release ships with an OWASP MASVS-aligned report, so compliance becomes a download instead of a scramble, and your team can point to a clean, auditable history.",
          "That visibility is what keeps clients satisfied: they are not asking whether the app is secure, they can see it, release after release.",
        ],
      },
    ],
    takeaway:
      "Security does not have to be the thing that slows a launch down. Built into the pipeline, it becomes invisible to developers and reassuring to clients, a quiet guarantee on every single release.",
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
