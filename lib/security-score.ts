// ---------------------------------------------------------------------------
// Executive security score
//
// The scan engine produces a 0-100 *risk* score (higher = riskier). Executives
// and founders think in terms of a *security* score (higher = better), so this
// module flips the risk score into a 0-100 security score with an A–F grade and
// a per-severity breakdown used by the executive summary card.
// ---------------------------------------------------------------------------

export interface SeverityCounts {
  critical: number
  high: number
  medium: number
  low: number
}

export interface SecurityScore {
  score: number // 0-100, higher = more secure
  grade: "A" | "B" | "C" | "D" | "F"
  label: string
  // tailwind text color token for the grade
  tone: "emerald" | "lime" | "yellow" | "orange" | "red"
}

const GRADE_TONES: Record<SecurityScore["grade"], SecurityScore["tone"]> = {
  A: "emerald",
  B: "lime",
  C: "yellow",
  D: "orange",
  F: "red",
}

const GRADE_LABELS: Record<SecurityScore["grade"], string> = {
  A: "Excellent posture",
  B: "Strong posture",
  C: "Needs attention",
  D: "At risk",
  F: "Critical exposure",
}

function gradeForScore(score: number): SecurityScore["grade"] {
  if (score >= 90) return "A"
  if (score >= 75) return "B"
  if (score >= 60) return "C"
  if (score >= 40) return "D"
  return "F"
}

/**
 * Convert a 0-100 risk score (higher = riskier) into an executive security
 * score (higher = safer) with grade and tone.
 */
export function toSecurityScore(riskScore: number | null | undefined): SecurityScore {
  const risk = Math.max(0, Math.min(100, riskScore ?? 0))
  const score = 100 - risk
  const grade = gradeForScore(score)
  return {
    score,
    grade,
    label: GRADE_LABELS[grade],
    tone: GRADE_TONES[grade],
  }
}

/**
 * A weighted 0-100 contribution per severity, used to render the score
 * breakdown bar. Returns the share of total risk attributable to each severity.
 */
export function severityRiskBreakdown(counts: SeverityCounts) {
  const weights = { critical: 25, high: 14, medium: 7, low: 3 }
  const segments = [
    { key: "critical" as const, count: counts.critical, weight: weights.critical },
    { key: "high" as const, count: counts.high, weight: weights.high },
    { key: "medium" as const, count: counts.medium, weight: weights.medium },
    { key: "low" as const, count: counts.low, weight: weights.low },
  ]
  const total = segments.reduce((sum, s) => sum + s.count * s.weight, 0)
  return segments.map((s) => ({
    ...s,
    points: s.count * s.weight,
    share: total === 0 ? 0 : (s.count * s.weight) / total,
  }))
}
