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
    slug: "ai-agents-can-now-pay-what-it-means-for-app-security",
    title: "AI Agents Can Now Pay: What Visa x OpenAI Means for App Security",
    excerpt:
      "Visa and OpenAI just let AI agents make authorized payments through ChatGPT. Agentic commerce is here, and it reshapes the mobile attack surface overnight.",
    category: "Top News",
    author: "Marcus Webb",
    role: "Principal Security Engineer",
    date: "2026-06-11",
    readingTime: "6 min read",
    image: "/images/blog/ai-agent-payments.png",
    imageAlt: "Illustration of an AI agent making an authorized payment through a chat interface",
    intro:
      "In the last 48 hours, Visa partnered with OpenAI to let AI agents conduct authorized payments directly through ChatGPT, while Samsung announced it will bake ChatGPT, Gemini, and Claude into its core operations. Agentic commerce is no longer a demo, it is shipping. For teams building mobile apps, an agent that can move money is a brand-new, high-value attack surface.",
    sections: [
      {
        heading: "Why agentic payments change the threat model",
        paragraphs: [
          "Traditional mobile security assumes a human taps the buttons. When an autonomous agent can authorize a purchase, the gap between intent and action widens, and that gap is exactly where attackers operate. A poisoned prompt or a manipulated context window can now trigger a real transaction.",
          "Apps integrating agentic payment flows need to treat every agent action as untrusted until verified, the same way they treat raw user input.",
        ],
      },
      {
        heading: "The new failure modes to watch",
        paragraphs: [
          "Our research team is already mapping these flows in customer builds. The recurring risks look familiar but hit harder when money is involved.",
        ],
        bullets: [
          "Payment tokens or session keys for the agent stored insecurely on-device",
          "Prompt injection that redirects an authorized purchase to an attacker",
          "Missing confirmation steps before an agent commits an irreversible action",
          "Over-broad agent permissions that survive past a single transaction",
        ],
      },
      {
        heading: "How RASMISER helps teams ship agentic features safely",
        paragraphs: [
          "RASMISER traces where untrusted content meets an agent's decision path and where payment credentials live in the binary. We flag direct client-to-provider calls that should be proxied, insecurely stored agent tokens, and missing transaction confirmation gates, each mapped to OWASP MASVS.",
          "Combined with runtime protection, teams can ship agent-driven commerce with anti-tampering and TLS pinning in place, so the payment paths stay protected after launch.",
        ],
      },
    ],
    takeaway:
      "Letting an AI agent spend money is a powerful feature and a serious responsibility. Scan the agent's payment path the same week you build it, before an attacker finds the gap between intent and authorization.",
  },
  {
    slug: "fable-5-jailbroken-on-day-one-lessons-for-builders",
    title: "Fable 5 Was Jailbroken on Day One: Lessons for App Builders",
    excerpt:
      "Anthropic shipped a guardrailed consumer model and researchers broke it within hours. If you embed an LLM in your app, assume its safety layer will fail.",
    category: "Top News",
    author: "Sarah Chen",
    role: "Head of Security Research",
    date: "2026-06-11",
    readingTime: "5 min read",
    image: "/images/blog/jailbroken-llm.png",
    imageAlt: "Illustration of an AI model with safety guardrails being broken open",
    intro:
      "This week Anthropic released Fable 5, a consumer-facing version of its powerful Mythos model wrapped in safety guardrails, and researchers reported jailbreaking it almost immediately. At the same time, CEO Dario Amodei called for mandatory government testing of frontier models. The lesson for app builders is blunt: a provider's safety layer is not your security boundary.",
    sections: [
      {
        heading: "Provider guardrails are not your guardrails",
        paragraphs: [
          "When you embed an LLM in your app, it is tempting to assume the provider's safety filters protect you. Day-one jailbreaks prove otherwise. If a determined user can bypass the model's restrictions, your app must still behave safely with whatever output comes back.",
          "Treat every model response as untrusted data, not as a trusted instruction. Validate it before you act on it.",
        ],
      },
      {
        heading: "What this looks like in a mobile build",
        paragraphs: [
          "We see the same gaps repeatedly when teams wire an LLM into a client.",
        ],
        bullets: [
          "Model output used directly in a system command, query, or deep link",
          "No output validation before rendering or executing model responses",
          "System prompts and provider keys embedded in the binary",
          "Sensitive inference inputs and outputs written to plaintext logs",
        ],
      },
      {
        heading: "Scanning the AI layer before launch",
        paragraphs: [
          "RASMISER treats AI integrations as first-class citizens in the scan. We identify where untrusted input meets model calls, where keys are exposed, and where AI-derived data is acted on without validation, then explain each risk in plain English.",
          "As regulators move toward mandatory model testing, having an auditable, MASVS-aligned report of how your app handles AI output turns a compliance scramble into a download.",
        ],
      },
    ],
    takeaway:
      "If a frontier model can be jailbroken on day one, your app cannot rely on its guardrails. Validate every model response and scan the AI layer like any other untrusted input.",
  },
  {
    slug: "based-grok-goes-viral-the-no-filter-ai-risk",
    title: "\"Based Grok\" Goes Viral: The Hidden Risk of No-Filter AI",
    excerpt:
      "A candid Grok reply blew up across X this week. Beyond the memes, no-filter AI in your app is a reputational and security liability worth scanning for.",
    category: "Viral Moments",
    author: "Elena Rodriguez",
    role: "VP of Engineering",
    date: "2026-06-11",
    readingTime: "4 min read",
    image: "/images/blog/viral-grok-moment.png",
    imageAlt: "Illustration of an AI chatbot reply going viral on social media",
    intro:
      "The viral AI moment of the week was Elon Musk amplifying a \"Based Grok\" post on X, praising the model's candid, no-filter response to a pointed question. Screenshots and memes spread fast, reigniting the debate between unfiltered candor and AI safety. It is funny on a timeline, but for anyone embedding a chat model in their app, no-filter AI is a real liability.",
    sections: [
      {
        heading: "Why a viral reply is a product risk",
        paragraphs: [
          "When your app surfaces model output to users, you own what it says. A single unfiltered, offensive, or misleading response can become a screenshot that defines your brand for a news cycle.",
          "The same lack of filtering that produces a viral quip can also leak system prompts, repeat injected instructions, or surface manipulated content to your users.",
        ],
      },
      {
        heading: "Where this bites mobile apps",
        paragraphs: [
          "Beyond reputation, no-filter output intersects with concrete security gaps we scan for.",
        ],
        bullets: [
          "Untrusted model output rendered without moderation or validation",
          "Prompt injection that turns a chat feature into a misinformation vector",
          "System prompts recoverable from the binary or from clever queries",
          "No logging or rate controls to catch abuse before it spreads",
        ],
      },
      {
        heading: "Ship personality without shipping liability",
        paragraphs: [
          "RASMISER flags where untrusted content flows into and out of your model, where prompts and keys are exposed, and where responses are acted on without checks. You can give your assistant a voice while still controlling what reaches your users.",
          "With runtime protection in place, the model endpoints and the data flowing to them stay locked down, so a viral moment stays on-brand instead of becoming an incident.",
        ],
      },
    ],
    takeaway:
      "No-filter AI is great for going viral and dangerous for shipping in production. Decide deliberately what your model can say, then scan the integration so a meme never becomes a breach.",
  },
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
  // Parse the date parts manually and format in UTC so the output is identical
  // on the server and client regardless of the local timezone (avoids hydration mismatch).
  const [year, month, day] = iso.split("-").map(Number)
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}
