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
    slug: "llm-jailbreak-universal-transfers-2026",
    title: "Universal LLM Jailbreaks Are Getting Faster and More Transferable",
    excerpt:
      "New research shows adversarial suffix attacks optimized on one model now transfer to closed-source frontier models in under an hour. Every embedded LLM is in scope.",
    category: "Cyber Threats",
    author: "Sarah Chen",
    role: "Head of Security Research",
    date: "2026-06-23",
    readingTime: "6 min read",
    image: "/images/blog/llm-jailbreak-exploit.png",
    imageAlt: "Illustration of a cracked AI model lock with exploit code fragments leaking out",
    intro:
      "A new wave of research published this month demonstrates that universal adversarial suffix attacks, short token sequences appended to any prompt, can now bypass safety alignment on GPT-4o, Claude Opus 4, and Gemini Ultra with transfer rates researchers describe as 'alarmingly high.' What used to require direct model access to optimize against can now be pre-computed on open-weight models and replayed against closed-source ones. For every team that embeds an LLM in their app, the provider's safety layer just got measurably thinner.",
    sections: [
      {
        heading: "Why transferability changes the threat model",
        paragraphs: [
          "Earlier jailbreak research required white-box access to a target model to run gradient descent on the adversarial suffix. Transferability breaks that constraint: an attacker optimizes against an open-weight model like Llama or Mistral and then fires the resulting suffix at a black-box API they cannot inspect.",
          "The implications are significant for mobile apps. An attacker does not need to reverse-engineer your integration. They craft the payload offline and deliver it through any input your app passes to the model, a text field, a clipboard paste, a scanned document.",
        ],
      },
      {
        heading: "Where the exposure lands in your app",
        paragraphs: [
          "Transferable jailbreaks widen the blast radius of every input path your app hands to an LLM.",
        ],
        bullets: [
          "User-supplied text, file uploads, and OCR results concatenated into prompts without sanitization",
          "Deep-link parameters and push notification payloads feeding directly into model context",
          "System prompts recoverable once guardrails are bypassed, leaking architecture and keys",
          "Agent tool calls triggered by jailbroken output executing with the agent's full permissions",
        ],
      },
      {
        heading: "How RASMISER maps your jailbreak surface",
        paragraphs: [
          "RASMISER traces every path from untrusted input to LLM call in your binary, flagging where raw content reaches a model without isolation and where the response is acted on without validation, each finding mapped to OWASP MASVS LLM controls.",
          "With runtime protection, the model endpoints your app calls stay pinned and tamper-resistant, so a jailbroken response cannot redirect data to an attacker-controlled channel.",
        ],
      },
    ],
    takeaway:
      "Universal transferable jailbreaks mean the safety alignment your provider ships is not a wall, it is a speed bump. Treat every LLM input as adversarial, isolate untrusted content from prompts, and validate every response before your app acts on it.",
  },
  {
    slug: "rag-poisoning-enterprise-knowledge-bases",
    title: "RAG Poisoning: How Attackers Corrupt Your AI Knowledge Base",
    excerpt:
      "Injecting a handful of malicious documents into a RAG pipeline can silently redirect an AI assistant's answers for every user. Your vector database is now an attack surface.",
    category: "Cyber Threats",
    author: "Marcus Webb",
    role: "Principal Security Engineer",
    date: "2026-06-22",
    readingTime: "6 min read",
    image: "/images/blog/ai-rag-poisoning.png",
    imageAlt: "Illustration of malicious documents being injected into a RAG vector database pipeline",
    intro:
      "Retrieval-Augmented Generation has become the default pattern for grounding LLM answers in real company data. It is also quietly becoming a high-value attack target. Security researchers this month demonstrated that inserting as few as five adversarially crafted documents into a corporate knowledge base is enough to reliably redirect an AI assistant's answers, exfiltrate retrieved context, or suppress correct information for targeted queries. The vector database your RAG pipeline reads from is now part of your threat model.",
    sections: [
      {
        heading: "Why RAG poisoning is hard to detect",
        paragraphs: [
          "A poisoned RAG document does not exploit a code bug. It exploits the model's instruction-following. A malicious document can carry hidden instructions that the retriever surfaces at exactly the right query, and the LLM faithfully executes them because they look like authoritative context.",
          "Unlike a classic database injection, there is no error, no anomalous query, and no obvious log entry. The assistant simply starts giving different answers to targeted questions, and attribution is nearly impossible without auditing retrieval traces.",
        ],
      },
      {
        heading: "The attack patterns researchers demonstrated",
        paragraphs: [
          "The published research catalogued three distinct poisoning strategies that teams should defend against now.",
        ],
        bullets: [
          "Instruction injection: documents containing hidden directives that override system prompt behavior",
          "Context hijacking: high-similarity documents that out-rank legitimate sources and replace correct answers",
          "Exfiltration anchors: documents that cause the model to echo retrieved context to an attacker-controlled URL",
          "Denial of retrieval: poisoned embeddings that suppress specific topics from appearing in results",
        ],
      },
      {
        heading: "How RASMISER helps secure RAG integrations",
        paragraphs: [
          "RASMISER audits how your app populates and queries RAG pipelines, flags where retrieved content flows unfiltered into prompts, and identifies retrieval paths that could expose sensitive context to injection, mapped to OWASP MASVS.",
          "Combined with runtime monitoring, the retrieval and inference paths in your app stay observable, so anomalous retrieval patterns surface as alerts rather than silent mis-answers delivered to every user.",
        ],
      },
    ],
    takeaway:
      "Your RAG pipeline is only as trustworthy as the documents inside it. Treat ingestion as a security boundary, validate retrieved content before it reaches a prompt, and monitor retrieval behavior for poisoning indicators.",
  },
  {
    slug: "ai-agent-privilege-escalation-mobile",
    title: "AI Agent Privilege Escalation: From Chat to Root in Three Steps",
    excerpt:
      "Researchers chained prompt injection with over-scoped tool permissions to escalate from a harmless chat query to full device access. Agentic apps need a least-privilege rethink.",
    category: "Emerging Tech",
    author: "Elena Rodriguez",
    role: "VP of Engineering",
    date: "2026-06-21",
    readingTime: "7 min read",
    image: "/images/blog/ai-agent-privilege-escalation.png",
    imageAlt: "Illustration of an AI agent bypassing access control gates through privilege escalation",
    intro:
      "At this month's AI Security Summit, researchers from Trail of Bits published a three-step privilege escalation chain that starts with a single injected prompt in a mobile AI assistant and ends with arbitrary code execution on the host device. The chain works by exploiting the combination of over-scoped tool permissions, missing confirmation gates, and the agent's willingness to follow instructions embedded in retrieved content. It is not theoretical: the demo ran live on two shipping consumer apps.",
    sections: [
      {
        heading: "How the three-step chain works",
        paragraphs: [
          "Step one is injection: the attacker embeds a malicious instruction in any content the agent retrieves, such as a webpage, a document, or a calendar event. Step two is tool abuse: the injected instruction directs the agent to call a tool with permissions broader than the task requires, such as a file-write tool invoked during a read-only summary task.",
          "Step three is escalation: the over-scoped tool call plants a malicious payload, modifies a configuration, or invokes a system capability the user never intended to grant. On mobile, the gap between an AI feature and device-level access is often just one mis-scoped API permission.",
        ],
      },
      {
        heading: "The permission gaps that enable escalation",
        paragraphs: [
          "The research identified a consistent set of misconfigurations that make escalation chains viable.",
        ],
        bullets: [
          "Agents granted persistent broad permissions rather than task-scoped, time-limited grants",
          "No human-in-the-loop confirmation before irreversible or high-impact tool calls",
          "Tool descriptions that do not restrict the contexts in which a tool may be invoked",
          "Retrieved content passed directly to the agent without stripping embedded instructions",
          "Missing sandboxing between agent tool execution and OS-level capabilities",
        ],
      },
      {
        heading: "How RASMISER audits agentic permission models",
        paragraphs: [
          "RASMISER inspects how your app scopes agent permissions, where confirmation gates are absent before sensitive tool calls, and which tool invocation paths can be triggered by untrusted retrieved content, with every finding mapped to OWASP MASVS.",
          "With runtime protection active, agent tool calls to sensitive APIs are instrumented and tamper-resistant, so an injected instruction attempting to escalate hits a hard boundary rather than executing silently.",
        ],
      },
    ],
    takeaway:
      "Agentic features that work with broad permissions are an escalation chain waiting to happen. Scope every tool grant to the minimum needed for the specific task, require confirmation before irreversible actions, and scan the full injection-to-execution path before you ship.",
  },
  {
    slug: "multimodal-ai-visual-prompt-injection",
    title: "Seeing Is Deceiving: Visual Prompt Injection in Multimodal AI",
    excerpt:
      "Attackers are hiding instructions inside images that multimodal models faithfully execute. A photo processed by your AI feature can now carry a hidden command.",
    category: "Cyber Threats",
    author: "Sarah Chen",
    role: "Head of Security Research",
    date: "2026-06-20",
    readingTime: "5 min read",
    image: "/images/blog/multimodal-ai-attack.png",
    imageAlt: "Illustration of a multimodal AI model reading hidden instructions embedded in an image",
    intro:
      "Text-based prompt injection was already a serious problem. Multimodal models have opened a second channel: attackers are embedding instructions directly into images as low-opacity text, pixel-level perturbations, or steganographic payloads, and frontier models like GPT-4o and Gemini Pro Vision faithfully follow them. For mobile apps that let users upload photos, scan documents, or process camera frames through an AI feature, every image is now a potential delivery mechanism for adversarial instructions.",
    sections: [
      {
        heading: "How visual injection bypasses text-level defenses",
        paragraphs: [
          "Input validation and content-filtering pipelines are almost universally built for text. An instruction hidden in an image as near-invisible overlay text or a steganographic payload passes every text-based filter and arrives at the model as trusted visual context.",
          "Because multimodal models integrate visual and textual reasoning, an instruction in the image can override a system prompt, redirect tool calls, or instruct the model to suppress its response to the legitimate user query, all without any anomalous text in the request.",
        ],
      },
      {
        heading: "The attack surfaces unique to mobile",
        paragraphs: [
          "Mobile apps create several injection entry points that desktop applications rarely face.",
        ],
        bullets: [
          "Camera feeds and photo library uploads processed by on-device or cloud vision models",
          "Document scanning features that pass page images directly into a multimodal context",
          "QR code and barcode readers whose decoded content feeds an LLM without sanitization",
          "Screenshot and screen-sharing features that inadvertently capture attacker-controlled content",
        ],
      },
      {
        heading: "How RASMISER addresses the multimodal surface",
        paragraphs: [
          "RASMISER identifies where your app routes image, camera, and document inputs to multimodal model calls, flags pipelines that pass visual content to a model without content-type separation or output validation, and maps each risk to the relevant OWASP MASVS control.",
          "With runtime protection, the image processing and model inference paths in your app stay monitored, so an anomalous model response triggered by a poisoned image surfaces as a detectable event rather than a silent data leak.",
        ],
      },
    ],
    takeaway:
      "Multimodal models read instructions from images as readily as from text, and your input validation almost certainly is not checking for them. Treat every image your app passes to a model as potential adversarial input and validate the model's response before acting on it.",
  },
  {
    slug: "mcp-servers-new-attack-surface-ai-agents",
    title: "MCP Servers Are the New Attack Surface for AI Agents",
    excerpt:
      "The Model Context Protocol lets AI agents plug into your tools, but a single malicious or over-permissioned MCP server can hand an attacker the keys to everything.",
    category: "Emerging Tech",
    author: "Marcus Webb",
    role: "Principal Security Engineer",
    date: "2026-06-18",
    readingTime: "6 min read",
    image: "/images/blog/mcp-server-risk.png",
    imageAlt: "Illustration of an AI assistant connected to multiple MCP tool servers, one of them compromised",
    intro:
      "The Model Context Protocol (MCP) has become the default way to connect AI agents to external tools, files, and APIs. It is powerful and it is spreading fast, which is exactly why attackers are paying attention. A single malicious, spoofed, or over-permissioned MCP server can quietly exfiltrate data, inject instructions, or chain into actions the user never approved. For mobile teams shipping agentic features, every MCP connection is now part of your attack surface.",
    sections: [
      {
        heading: "Why MCP changes the risk picture",
        paragraphs: [
          "MCP makes tools composable: an agent can discover a server, read its tool descriptions, and start calling it. That same flexibility means a poisoned tool description can carry hidden instructions, and a rogue server can impersonate a trusted one to harvest the data the agent sends it.",
          "Because the agent acts with the user's authority, a compromised MCP connection does not just leak data, it can take actions, and on mobile those actions reach contacts, files, and payment flows.",
        ],
      },
      {
        heading: "Where MCP goes wrong in a mobile app",
        paragraphs: [
          "The failure modes are concrete and show up repeatedly when teams wire MCP into a client.",
        ],
        bullets: [
          "MCP server URLs and auth tokens hardcoded or stored insecurely on-device",
          "Tool descriptions trusted blindly, allowing tool-poisoning prompt injection",
          "Over-broad scopes that let one server reach data meant for another",
          "No verification that a server is the legitimate one the user expects",
        ],
      },
      {
        heading: "How RASMISER secures your MCP connections",
        paragraphs: [
          "RASMISER traces where your app stores MCP credentials, how it validates servers, and which tool calls run without a confirmation gate, mapping each finding to OWASP MASVS so your team knows exactly what to fix.",
          "With runtime protection, the endpoints your agent talks to stay pinned and tamper-resistant, so a spoofed MCP server cannot quietly slot itself into your toolchain.",
        ],
      },
    ],
    takeaway:
      "MCP is becoming core infrastructure for AI agents, and untrusted tool servers are a first-class threat. Treat every MCP connection like untrusted input: verify the server, scope the permissions, and scan where the tokens live.",
  },
  {
    slug: "ai-voice-deepfakes-vishing-mobile-defense",
    title: "AI Voice Deepfakes Make Vishing a Mobile-First Threat",
    excerpt:
      "Real-time voice cloning now powers phishing calls that sound exactly like your CEO. The phone in your pocket is the front line, and your app may be the target.",
    category: "Cyber Threats",
    author: "Sarah Chen",
    role: "Head of Security Research",
    date: "2026-06-18",
    readingTime: "5 min read",
    image: "/images/blog/ai-voice-deepfake.png",
    imageAlt: "Illustration of a smartphone receiving a call with an AI voice waveform morphing into a fake face",
    intro:
      "Voice cloning that once needed minutes of audio now works on seconds of a public clip, in real time, over a phone call. Attackers are using AI-generated voices to impersonate executives, support agents, and family members, and the success rates are climbing. The attack lands on a mobile device, and increasingly the goal is to push a victim into an app: approve a transfer, reset a credential, paste a code.",
    sections: [
      {
        heading: "Why deepfake voice raises the stakes for apps",
        paragraphs: [
          "Vishing used to rely on a convincing script. Now the voice itself is convincing, so the social-engineering barrier collapses and the attacker can improvise in a live call. The weak link becomes whatever the victim can be talked into doing in your app.",
          "If a flow can be completed with a code read aloud or a single tap of approval, a cloned voice can drive it. Your app's confirmation design is now a security control.",
        ],
      },
      {
        heading: "Where the exposure lives in your build",
        paragraphs: [
          "Deepfake calls succeed by exploiting app flows that assume the human on the other end is who they claim to be.",
        ],
        bullets: [
          "One-time codes and approvals that can be completed without re-authentication",
          "Sensitive actions with no out-of-band or biometric confirmation step",
          "Account recovery flows that trust a phone number or a spoken code alone",
          "Push approvals that lack context about what is actually being authorized",
        ],
      },
      {
        heading: "How RASMISER hardens the targeted flows",
        paragraphs: [
          "RASMISER inspects how your app handles authentication, recovery, and high-value confirmations, flagging flows that can be completed without strong, contextual verification, each mapped to OWASP MASVS.",
          "Combined with runtime protection, the credential and approval paths stay tamper-resistant, so a victim coerced by a cloned voice still hits a wall your app puts up.",
        ],
      },
    ],
    takeaway:
      "When the voice on the call is fake but convincing, your app's confirmation steps are the last line of defense. Design sensitive actions to require strong, contextual verification, and scan the flows attackers will aim a deepfake at.",
  },
  {
    slug: "shadow-ai-data-leakage-enterprise-apps",
    title: "Shadow AI: The Data Leak Hiding in Your Employees' Apps",
    excerpt:
      "Staff are pasting source code, customer data, and secrets into unsanctioned AI tools every day. Shadow AI is the fastest-growing data-exfiltration channel of 2026.",
    category: "App Security",
    author: "Elena Rodriguez",
    role: "VP of Engineering",
    date: "2026-06-17",
    readingTime: "5 min read",
    image: "/images/blog/shadow-ai-leak.png",
    imageAlt: "Illustration of corporate data flowing out of an office into unsanctioned AI chatbot apps",
    intro:
      "Surveys this year keep landing on the same uncomfortable number: a large majority of employees use AI tools their company never approved, and many paste in data they should not. Shadow AI, the unsanctioned use of chatbots and AI features, has quietly become one of the biggest data-leakage channels in the enterprise. The data walks out through an app on a personal or corporate phone, often with no logging at all.",
    sections: [
      {
        heading: "Why shadow AI is so hard to see",
        paragraphs: [
          "Unlike a classic exfiltration attempt, shadow AI looks like normal productivity. An employee pastes a snippet to debug it or summarizes a document, and sensitive data leaves through a sanctioned-looking interface that security tooling never inspects.",
          "On mobile especially, AI features are embedded everywhere, in keyboards, browsers, and assistants, so data can leave without the user even opening a dedicated chatbot.",
        ],
      },
      {
        heading: "What leaks, and how",
        paragraphs: [
          "The patterns are consistent across the builds and workflows we review.",
        ],
        bullets: [
          "Source code, API keys, and config pasted into external AI tools for help",
          "Customer records and internal documents sent to summarize or rewrite",
          "AI-enabled keyboards and assistants with broad access to in-app content",
          "No logging, DLP, or policy controls on AI feature usage inside apps",
        ],
      },
      {
        heading: "How RASMISER helps you regain visibility",
        paragraphs: [
          "RASMISER flags where your own app exposes data to third-party AI SDKs and assistants, where content leaves the client without controls, and where embedded AI features have more access than they need, mapped to OWASP MASVS.",
          "With runtime protection in place, the data paths leaving your app stay monitored and locked down, so an embedded AI feature cannot become a silent exfiltration route.",
        ],
      },
    ],
    takeaway:
      "Shadow AI is a leak that looks like productivity, which is exactly why it spreads. Inventory where your app hands data to AI features and put controls on those paths before the next paste becomes a breach.",
  },
  {
    slug: "ai-data-poisoning-supply-chain-models",
    title: "Data Poisoning: Corrupting AI Before It Ever Ships",
    excerpt:
      "Researchers showed that poisoning a tiny fraction of training data can backdoor a model. If your app bundles or fine-tunes a model, the attack starts upstream.",
    category: "Cyber Threats",
    author: "Sarah Chen",
    role: "Head of Security Research",
    date: "2026-06-17",
    readingTime: "6 min read",
    image: "/images/blog/ai-data-poisoning.png",
    imageAlt: "Illustration of poisoned data droplets being injected into a clean AI training data stream",
    intro:
      "New research keeps lowering the bar for data poisoning: corrupting a surprisingly small slice of a model's training or fine-tuning data can plant a hidden backdoor that behaves normally until a specific trigger appears. As more mobile apps bundle on-device models or fine-tune on user data, the attack moves upstream into your AI supply chain, long before a single line of app code runs.",
    sections: [
      {
        heading: "Why poisoning is a supply-chain problem",
        paragraphs: [
          "A poisoned model is not a code bug you can grep for. The malicious behavior is baked into the weights, dormant until a trigger input activates it, which makes it nearly invisible to traditional testing.",
          "If you pull a pretrained model from a public hub, fine-tune on scraped data, or accept user contributions, you inherit whatever was hidden upstream, and you ship it inside your binary.",
        ],
      },
      {
        heading: "Where the risk reaches your app",
        paragraphs: [
          "The exposure concentrates around what you bundle and where your training data comes from.",
        ],
        bullets: [
          "Pretrained model files pulled from unverified or unsigned sources",
          "Fine-tuning on scraped or user-supplied data with no provenance",
          "Bundled model weights shipped without integrity verification",
          "No validation of model outputs before the app acts on them",
        ],
      },
      {
        heading: "How RASMISER inspects your AI supply chain",
        paragraphs: [
          "RASMISER inventories the model files and AI components compiled into your build, flags unsigned or unverified artifacts, and highlights where model output is trusted without validation, each mapped to OWASP MASVS.",
          "Wired into CI, the scan turns model provenance and integrity into an automatic gate, so an unverified or tampered model file fails the build instead of shipping to users.",
        ],
      },
    ],
    takeaway:
      "Data poisoning attacks your model before your code ever runs, so source-only security misses it entirely. Verify model provenance, check integrity at build time, and validate what the model produces before you trust it.",
  },
  {
    slug: "ai-worms-miasma-ironworm-target-coding-tools",
    title: "AI Worms Are Here: Miasma and IronWorm Target Your Dev Tools",
    excerpt:
      "Self-replicating AI worms now hunt coding assistants, embedding backdoors in config files to steal API keys. The software supply chain just got a new predator.",
    category: "Cyber Threats",
    author: "Marcus Webb",
    role: "Principal Security Engineer",
    date: "2026-06-16",
    readingTime: "6 min read",
    image: "/images/blog/ai-supply-chain-worm.png",
    imageAlt: "Illustration of a self-replicating AI worm spreading through a software supply chain",
    intro:
      "Researchers this week detailed Miasma and IronWorm, two campaigns of self-replicating AI worms that target AI coding tools directly. Instead of attacking a server, they embed backdoors into configuration files, harvesting API keys and credentials as developers build. For mobile teams, the threat is personal: the worm can ride your toolchain straight into your build artifacts.",
    sections: [
      {
        heading: "Why AI worms break the old supply-chain model",
        paragraphs: [
          "Traditional supply-chain attacks rely on a poisoned dependency you eventually pull. AI worms are adaptive: they identify target-specific weaknesses and replicate without human direction, jumping between coding assistants, config files, and credential stores.",
          "Because they live in your developer environment, anything they touch, including the secrets baked into a mobile build, is at risk before the app ever ships.",
        ],
      },
      {
        heading: "What lands in your mobile build",
        paragraphs: [
          "When a worm compromises the toolchain, the damage shows up in the artifact. These are the recurring traces we scan for.",
        ],
        bullets: [
          "API keys and tokens harvested from config files and re-embedded in the binary",
          "Backdoor endpoints injected into build scripts and bundled resources",
          "Tampered dependencies that survive into the shipped package",
          "Credentials written to insecure on-device storage during build automation",
        ],
      },
      {
        heading: "How RASMISER catches a compromised build",
        paragraphs: [
          "RASMISER decompiles every release and flags hardcoded secrets, unexpected network endpoints, and tampered components, each mapped to OWASP MASVS. A worm that slips a backdoor into your config shows up as a concrete finding in the report, not a silent passenger.",
          "Wired into CI, the scan runs on every build, so a compromised artifact fails the pipeline instead of reaching the store.",
        ],
      },
    ],
    takeaway:
      "AI worms turn your own developer tools into an attack vector. Scanning the final build artifact, not just your source, is how you catch a backdoor the worm left behind.",
  },
  {
    slug: "frontier-models-auto-generate-exploits-patch-gap",
    title: "When AI Writes Exploits in Hours: The Patch Gap Just Collapsed",
    excerpt:
      "Frontier models like Claude Mythos can now generate working exploits from a patch within hours. N-day vulnerabilities are suddenly far more dangerous.",
    category: "Cyber Threats",
    author: "Sarah Chen",
    role: "Head of Security Research",
    date: "2026-06-16",
    readingTime: "6 min read",
    image: "/images/blog/ai-autonomous-exploit.png",
    imageAlt: "Illustration of an AI model generating an exploit from a security patch",
    intro:
      "New research shows frontier models, including Claude Mythos, can autonomously generate functional exploits for freshly patched vulnerabilities, sometimes kernel-level, within hours of a fix being published. The traditional patch gap, the window between a fix shipping and attackers weaponizing it, has effectively collapsed. For mobile teams, slow update adoption is now a critical exposure.",
    sections: [
      {
        heading: "Why N-day just became as dangerous as zero-day",
        paragraphs: [
          "Defenders used to count on days or weeks between a public patch and a working exploit. When an AI can read a code diff and produce an exploit before lunch, every unpatched dependency in your app is live ammunition.",
          "Mobile apps are especially exposed: users update on their own schedule, and an outdated SDK or library can sit vulnerable on millions of devices long after a fix exists.",
        ],
      },
      {
        heading: "Where the risk hides in a mobile app",
        paragraphs: [
          "The exposure is almost always in what you bundle and how fast you can ship a fix.",
        ],
        bullets: [
          "Outdated third-party SDKs and native libraries with known CVEs",
          "Pinned dependency versions that never get bumped after launch",
          "No inventory of what is actually compiled into the shipped binary",
          "Slow release cadence that leaves patched fixes stuck in review",
        ],
      },
      {
        heading: "How RASMISER shortens your exposure window",
        paragraphs: [
          "RASMISER inventories the components compiled into your build and flags dependencies with known vulnerabilities, scored by severity so you patch the dangerous ones first. You see exactly what an AI-assisted attacker could target.",
          "Running in CI, the scan turns dependency hygiene into an automatic gate, so a known-vulnerable library fails the build instead of shipping to users who may not update for weeks.",
        ],
      },
    ],
    takeaway:
      "If AI can weaponize a patch in hours, your only defense is knowing what you ship and fixing it fast. Continuous dependency scanning is now table stakes, not a nice-to-have.",
  },
  {
    slug: "searchleak-prompt-injection-trusted-proxy",
    title: "SearchLeak: How Prompt Injection Turns Trusted Tools Against You",
    excerpt:
      "The SearchLeak attack used malicious query parameters to bypass Copilot guardrails and exfiltrate data through Bing as a trusted proxy. Prompt injection is still unsolved.",
    category: "Cyber Threats",
    author: "Marcus Webb",
    role: "Principal Security Engineer",
    date: "2026-06-16",
    readingTime: "5 min read",
    image: "/images/blog/prompt-injection-proxy.png",
    imageAlt: "Illustration of a prompt injection attack exfiltrating data through a trusted search proxy",
    intro:
      "Researchers disclosed SearchLeak this week, a parameter-to-prompt injection attack that smuggled malicious instructions through query parameters to bypass Copilot guardrails, exfiltrating organizational data by using Bing as a trusted proxy. It is a sharp reminder that prompt injection remains an unsolved architectural problem: LLMs still cannot reliably separate your instructions from untrusted content.",
    sections: [
      {
        heading: "Why trusted proxies make injection worse",
        paragraphs: [
          "SearchLeak works because the data leaves through a channel everyone trusts. The model follows injected instructions and routes sensitive data out via a legitimate service, so nothing looks obviously malicious.",
          "Any mobile app that feeds untrusted content, search results, web pages, user input, into an LLM can be steered the same way.",
        ],
      },
      {
        heading: "How this pattern reaches mobile apps",
        paragraphs: [
          "On a phone, injection often chains with platform features to escalate quickly.",
        ],
        bullets: [
          "Untrusted content concatenated directly into prompts without isolation",
          "Deep links and clipboard data carrying injected instructions",
          "Model responses that trigger network calls or exfiltrate data through allowed hosts",
          "System prompts recoverable through crafted queries",
        ],
      },
      {
        heading: "How RASMISER maps your injection surface",
        paragraphs: [
          "RASMISER traces how your app builds prompts and where untrusted data flows into them, flagging the paths most likely to be abused and the outbound channels that could become an exfiltration route, all mapped to OWASP MASVS.",
          "With runtime protection, the endpoints your model talks to stay pinned and tamper-resistant, so an injected instruction has nowhere clean to send your users' data.",
        ],
      },
    ],
    takeaway:
      "Prompt injection is an architectural reality, not a bug you patch once. Assume untrusted content can hijack your model and scan for the data paths it could abuse before you ship.",
  },
  {
    slug: "agentic-frameworks-unauthenticated-endpoints-killchains",
    title: "Autonomous Kill Chains: The Risk of Unauthenticated AI Agents",
    excerpt:
      "Attackers now use agentic frameworks to run real-time, multi-step intrusions. Unauthenticated agent endpoints can be coerced into executing unauthorized tasks.",
    category: "Cyber Threats",
    author: "Elena Rodriguez",
    role: "VP of Engineering",
    date: "2026-06-16",
    readingTime: "5 min read",
    image: "/images/blog/agentic-killchain.png",
    imageAlt: "Illustration of an autonomous AI agent performing a multi-step cyber attack kill chain",
    intro:
      "Security teams are tracking a shift from static attack scripts to agentic frameworks that improvise. These AI agents run multi-step kill chains in real time, harvesting credentials and pivoting across networks without human input. The newest concern: unauthenticated agent endpoints that can be coerced into executing unauthorized, multi-step tasks. If your app exposes an agent, that agent is now an attack surface.",
    sections: [
      {
        heading: "Why autonomous agents change the math",
        paragraphs: [
          "A static script does one thing. An agent improvises, adapting its next move to whatever it finds. When an agent endpoint lacks authentication or scoping, an attacker can hand it a goal and let it work out the steps.",
          "Mobile apps increasingly ship agentic features, and an under-secured agent endpoint is an open door to whatever that agent can reach.",
        ],
      },
      {
        heading: "What we look for in agentic apps",
        paragraphs: [
          "The failure modes are concrete and recurring when teams wire agents into a client.",
        ],
        bullets: [
          "Unauthenticated or weakly scoped agent endpoints",
          "Over-broad agent permissions that persist beyond a single task",
          "Missing confirmation gates before an agent takes irreversible actions",
          "Agent credentials and tool tokens stored insecurely on-device",
        ],
      },
      {
        heading: "How RASMISER secures the agent surface",
        paragraphs: [
          "RASMISER flags exposed agent endpoints, insecurely stored agent credentials, and missing authorization on the paths an agent can trigger, each explained in plain English and mapped to OWASP MASVS.",
          "Combined with runtime protection, the agent's endpoints and tokens stay locked down with anti-tampering and TLS pinning, so a coerced agent cannot become a multi-step kill chain inside your app.",
        ],
      },
    ],
    takeaway:
      "Agentic features are powerful and they widen your attack surface. Authenticate every agent endpoint, scope every permission, and scan the agent paths before an attacker turns your assistant into an intruder.",
  },
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
