"use client";

import { useEffect, useRef, useState } from "react";

const shields = [
  { name: "Anti-Hooking", desc: "Blocks Frida, Xposed & Substrate injection." },
  { name: "Anti-Tampering", desc: "Verifies integrity & kills modified builds." },
  { name: "Root / Jailbreak", desc: "Detects compromised devices on launch." },
  { name: "TLS Pinning", desc: "Stops man-in-the-middle interception." },
  { name: "Emulator Detection", desc: "Flags virtualized attack environments." },
  { name: "Screen Protection", desc: "Prevents capture of sensitive screens." },
];

const liveEvents = [
  { type: "Runtime Hooking", device: "Pixel 8 Pro", country: "RU", action: "TERMINATED", sev: "critical" },
  { type: "App Tampering", device: "Galaxy S24", country: "CN", action: "TERMINATED", sev: "critical" },
  { type: "MITM Interception", device: "iPhone 15 Pro", country: "BR", action: "BLOCKED", sev: "high" },
  { type: "Rooted Device", device: "OnePlus 12", country: "IN", action: "BLOCKED", sev: "high" },
  { type: "Debugger Attached", device: "Pixel 6a", country: "NG", action: "BLOCKED", sev: "medium" },
  { type: "Emulator Detected", device: "Generic x86", country: "VN", action: "FLAGGED", sev: "low" },
];

const sevColor: Record<string, string> = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-yellow-400",
  low: "text-sky-400",
};

const actionColor: Record<string, string> = {
  TERMINATED: "border-red-500/40 bg-red-500/10 text-red-400",
  BLOCKED: "border-orange-500/40 bg-orange-500/10 text-orange-400",
  FLAGGED: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
};

export function ProtectionSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [feed, setFeed] = useState(liveEvents.slice(0, 4));
  const sectionRef = useRef<HTMLDivElement>(null);
  const idx = useRef(4);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Rolling live feed simulation
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      const next = liveEvents[idx.current % liveEvents.length];
      idx.current += 1;
      setFeed((prev) => [next, ...prev].slice(0, 4));
    }, 2600);
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section
      id="protection"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-[oklch(0.09_0.01_260)] text-white overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-white/[0.02] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-16 lg:mb-24">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-white/40 mb-6">
              <span className="w-12 h-px bg-white/20" />
              Runtime protection
            </span>
            <h2
              className={`text-6xl md:text-7xl lg:text-[110px] font-display tracking-tight leading-[0.9] transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Shield in
              <br />
              <span className="text-white/30">production.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-4">
            <p
              className={`text-xl text-white/60 leading-relaxed transition-all duration-1000 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Scanning finds the holes. RASP closes them. Apply no-code defenses
              to your build and block hooking, tampering, and reverse engineering
              on real devices — then watch every attack in real time.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Shields grid */}
          <div className="grid sm:grid-cols-2 gap-px bg-white/10 border border-white/10">
            {shields.map((s, i) => (
              <div
                key={s.name}
                className={`bg-black p-6 transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#eca8d6]" aria-hidden="true" />
                  <span className="text-xs font-mono uppercase tracking-wider text-white/40">
                    Active
                  </span>
                </div>
                <h3 className="text-lg font-display">{s.name}</h3>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Live threat feed mockup */}
          <div className="border border-white/10 bg-black flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span className="text-sm font-mono text-white/60">
                  Live threat feed
                </span>
              </div>
              <span className="text-xs font-mono text-white/30">/threats</span>
            </div>

            <div className="divide-y divide-white/5">
              {feed.map((e, i) => (
                <div
                  key={`${e.type}-${i}-${e.country}`}
                  className="flex items-center gap-3 px-6 py-4 animate-fade-in"
                >
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <span className={`h-1.5 w-1.5 rounded-full ${sevColor[e.sev].replace("text-", "bg-")}`} aria-hidden="true" />
                      <span className="truncate">{e.type}</span>
                    </p>
                    <p className="mt-0.5 truncate text-xs font-mono text-white/40">
                      {e.device} · {e.country}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${actionColor[e.action]}`}
                  >
                    {e.action}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-auto grid grid-cols-3 gap-px border-t border-white/10 bg-white/10">
              {[
                { v: "1.2M", l: "blocked" },
                { v: "99.4%", l: "block rate" },
                { v: "24/7", l: "monitoring" },
              ].map((stat) => (
                <div key={stat.l} className="bg-black px-4 py-4 text-center">
                  <p className="text-2xl font-display">{stat.v}</p>
                  <p className="mt-1 text-[10px] font-mono uppercase tracking-wider text-white/40">
                    {stat.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </section>
  );
}
