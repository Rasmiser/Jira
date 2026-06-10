import { toSecurityScore } from "@/lib/security-score"

export interface ComparableFinding {
  id: string
  title: string
  severity: string
  category: string
  masvs: string | null
}

export interface ComparableScan {
  id: string
  appName: string
  versionName: string | null
  packageName: string | null
  riskScore: number | null
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  completedAt: Date | null
  createdAt: Date
}

export type DiffStatus = "fixed" | "new" | "unchanged"

export interface FindingDiffRow {
  key: string
  title: string
  severity: string
  category: string
  status: DiffStatus
}

const SEVERITY_RANK: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

/**
 * Identity for a finding across versions. We match on title + category since
 * IDs are per-scan. This treats "the same issue type in the same area" as the
 * same finding between two builds.
 */
function findingKey(f: ComparableFinding) {
  return `${f.category}::${f.title}`.toLowerCase()
}

export function diffFindings(
  baseFindings: ComparableFinding[],
  targetFindings: ComparableFinding[],
): FindingDiffRow[] {
  const baseMap = new Map(baseFindings.map((f) => [findingKey(f), f]))
  const targetMap = new Map(targetFindings.map((f) => [findingKey(f), f]))

  const rows: FindingDiffRow[] = []

  // Fixed: present in base, absent in target
  for (const [key, f] of baseMap) {
    if (!targetMap.has(key)) {
      rows.push({
        key,
        title: f.title,
        severity: f.severity,
        category: f.category,
        status: "fixed",
      })
    }
  }

  // New + unchanged: iterate target
  for (const [key, f] of targetMap) {
    rows.push({
      key,
      title: f.title,
      severity: f.severity,
      category: f.category,
      status: baseMap.has(key) ? "unchanged" : "new",
    })
  }

  // Sort: new first, then fixed, then unchanged; within each, by severity
  const statusRank: Record<DiffStatus, number> = {
    new: 0,
    fixed: 1,
    unchanged: 2,
  }
  return rows.sort((a, b) => {
    if (statusRank[a.status] !== statusRank[b.status]) {
      return statusRank[a.status] - statusRank[b.status]
    }
    return (
      (SEVERITY_RANK[a.severity.toLowerCase()] ?? 9) -
      (SEVERITY_RANK[b.severity.toLowerCase()] ?? 9)
    )
  })
}

export interface ComparisonSummary {
  fixed: number
  introduced: number
  unchanged: number
  baseScore: number
  targetScore: number
  scoreDelta: number
  baseGrade: string
  targetGrade: string
  improved: boolean
}

export function summarizeComparison(
  base: ComparableScan,
  target: ComparableScan,
  rows: FindingDiffRow[],
): ComparisonSummary {
  const baseSec = toSecurityScore(base.riskScore)
  const targetSec = toSecurityScore(target.riskScore)
  const fixed = rows.filter((r) => r.status === "fixed").length
  const introduced = rows.filter((r) => r.status === "new").length
  const unchanged = rows.filter((r) => r.status === "unchanged").length

  return {
    fixed,
    introduced,
    unchanged,
    baseScore: baseSec.score,
    targetScore: targetSec.score,
    scoreDelta: targetSec.score - baseSec.score,
    baseGrade: baseSec.grade,
    targetGrade: targetSec.grade,
    improved: targetSec.score >= baseSec.score,
  }
}
