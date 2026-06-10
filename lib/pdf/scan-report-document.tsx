import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer"
import { toSecurityScore, type SecurityScore } from "@/lib/security-score"

const GRADE_HEX: Record<SecurityScore["tone"], string> = {
  emerald: "#059669",
  lime: "#65a30d",
  yellow: "#ca8a04",
  orange: "#ea580c",
  red: "#dc2626",
}

export interface PdfScan {
  appName: string
  platform: string
  packageName: string | null
  versionName: string | null
  riskScore: number
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
  completedAt: Date | null
  createdAt: Date
}

export interface PdfFinding {
  title: string
  severity: string
  category: string
  masvs: string | null
  description: string
  remediation: string
  aiFixSummary: string | null
  aiFixCode: string | null
}

const COLORS = {
  ink: "#111827",
  sub: "#6b7280",
  border: "#e5e7eb",
  bg: "#f9fafb",
  critical: "#b91c1c",
  high: "#c2410c",
  medium: "#a16207",
  low: "#15803d",
  brand: "#0f172a",
}

function severityColor(severity: string) {
  switch (severity.toLowerCase()) {
    case "critical":
      return COLORS.critical
    case "high":
      return COLORS.high
    case "medium":
      return COLORS.medium
    default:
      return COLORS.low
  }
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 48,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: COLORS.ink,
    lineHeight: 1.5,
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 12,
  },
  brand: { fontSize: 16, fontFamily: "Helvetica-Bold", color: COLORS.brand },
  brandSub: { fontSize: 9, color: COLORS.sub },
  title: { fontSize: 22, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  subtitle: { fontSize: 11, color: COLORS.sub, marginBottom: 24 },
  scoreRow: { flexDirection: "row", gap: 16, marginBottom: 24 },
  scoreBox: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: 16,
  },
  scoreLabel: {
    fontSize: 8,
    color: COLORS.sub,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  scoreValue: { fontSize: 30, fontFamily: "Helvetica-Bold" },
  countRow: { flexDirection: "row", gap: 8, marginBottom: 28 },
  countBox: {
    flexGrow: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: 10,
  },
  countValue: { fontSize: 18, fontFamily: "Helvetica-Bold" },
  countLabel: { fontSize: 8, color: COLORS.sub, textTransform: "uppercase" },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 16, marginBottom: 28 },
  metaItem: { width: "45%" },
  metaLabel: { fontSize: 8, color: COLORS.sub, textTransform: "uppercase" },
  metaValue: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 12,
    marginTop: 8,
  },
  finding: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  findingHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  findingTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", flexShrink: 1 },
  badge: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
    textTransform: "uppercase",
  },
  tag: { fontSize: 8, color: COLORS.sub, marginBottom: 6 },
  fieldLabel: {
    fontSize: 8,
    color: COLORS.sub,
    textTransform: "uppercase",
    marginTop: 6,
    marginBottom: 2,
  },
  body: { fontSize: 9.5 },
  code: {
    fontFamily: "Courier",
    fontSize: 8.5,
    backgroundColor: COLORS.bg,
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: COLORS.sub,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
})

function formatDate(date: Date | null) {
  if (!date) return "—"
  return new Date(date).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export function ScanReportDocument({
  scan,
  findings,
}: {
  scan: PdfScan
  findings: PdfFinding[]
}) {
  const security = toSecurityScore(scan.riskScore)
  const grade = security.grade
  const counts = [
    { label: "Critical", value: scan.criticalCount, color: COLORS.critical },
    { label: "High", value: scan.highCount, color: COLORS.high },
    { label: "Medium", value: scan.mediumCount, color: COLORS.medium },
    { label: "Low", value: scan.lowCount, color: COLORS.low },
  ]

  return (
    <Document
      title={`${scan.appName} Security Report`}
      author="RASMISER"
      subject="Mobile Application Security Assessment"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.brandRow} fixed>
          <Text style={styles.brand}>RASMISER</Text>
          <Text style={styles.brandSub}>Mobile Security Assessment</Text>
        </View>

        <Text style={styles.title}>{scan.appName}</Text>
        <Text style={styles.subtitle}>
          {scan.platform === "ios" ? "iOS" : "Android"} security assessment
          report
        </Text>

        <View style={styles.scoreRow}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Security Score</Text>
            <Text style={styles.scoreValue}>{security.score}/100</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Grade</Text>
            <Text style={[styles.scoreValue, { color: GRADE_HEX[security.tone] }]}>
              {grade}
            </Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Total Findings</Text>
            <Text style={styles.scoreValue}>{findings.length}</Text>
          </View>
        </View>

        <View style={styles.countRow}>
          {counts.map((c) => (
            <View key={c.label} style={styles.countBox}>
              <Text style={[styles.countValue, { color: c.color }]}>
                {c.value}
              </Text>
              <Text style={styles.countLabel}>{c.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Package</Text>
            <Text style={styles.metaValue}>{scan.packageName ?? "—"}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Version</Text>
            <Text style={styles.metaValue}>{scan.versionName ?? "—"}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Scanned</Text>
            <Text style={styles.metaValue}>
              {formatDate(scan.completedAt ?? scan.createdAt)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Platform</Text>
            <Text style={styles.metaValue}>
              {scan.platform === "ios" ? "iOS" : "Android"}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Findings</Text>
        {findings.length === 0 ? (
          <Text style={styles.body}>
            No findings were detected in this assessment.
          </Text>
        ) : (
          findings.map((f, i) => (
            <View key={i} style={styles.finding} wrap={false}>
              <View style={styles.findingHead}>
                <Text style={styles.findingTitle}>{f.title}</Text>
                <Text
                  style={[
                    styles.badge,
                    { backgroundColor: severityColor(f.severity) },
                  ]}
                >
                  {f.severity}
                </Text>
              </View>
              <Text style={styles.tag}>
                {f.category}
                {f.masvs ? `  •  MASVS ${f.masvs}` : ""}
              </Text>
              <Text style={styles.fieldLabel}>Description</Text>
              <Text style={styles.body}>{f.description}</Text>
              <Text style={styles.fieldLabel}>Remediation</Text>
              <Text style={styles.body}>{f.remediation}</Text>
              {f.aiFixSummary ? (
                <>
                  <Text style={styles.fieldLabel}>AI Fix Recommendation</Text>
                  <Text style={styles.body}>{f.aiFixSummary}</Text>
                </>
              ) : null}
              {f.aiFixCode ? (
                <Text style={styles.code}>{f.aiFixCode}</Text>
              ) : null}
            </View>
          ))
        )}

        <View style={styles.footer} fixed>
          <Text>
            RASMISER • Confidential security report for {scan.appName}
          </Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  )
}
