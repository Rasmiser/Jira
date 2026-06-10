import { NextResponse } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"
import { getScan, getFindings } from "@/app/actions/scans"
import {
  ScanReportDocument,
  type PdfFinding,
} from "@/lib/pdf/scan-report-document"

export const runtime = "nodejs"

const SEVERITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  let scan
  try {
    scan = await getScan(id)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!scan) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const rawFindings = await getFindings(id)
  const findings: PdfFinding[] = [...rawFindings]
    .sort(
      (a, b) =>
        (SEVERITY_ORDER[a.severity.toLowerCase()] ?? 9) -
        (SEVERITY_ORDER[b.severity.toLowerCase()] ?? 9),
    )
    .map((f) => ({
      title: f.title,
      severity: f.severity,
      category: f.category,
      masvs: f.masvs,
      description: f.description,
      remediation: f.remediation,
      aiFixSummary: f.aiFixSummary,
      aiFixCode: f.aiFixCode,
    }))

  const buffer = await renderToBuffer(
    <ScanReportDocument
      scan={{
        appName: scan.appName,
        platform: scan.platform,
        packageName: scan.packageName,
        versionName: scan.versionName,
        riskScore: scan.riskScore ?? 0,
        criticalCount: scan.criticalCount,
        highCount: scan.highCount,
        mediumCount: scan.mediumCount,
        lowCount: scan.lowCount,
        completedAt: scan.completedAt,
        createdAt: scan.createdAt,
      }}
      findings={findings}
    />,
  )

  const safeName = scan.appName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="rasmiser-${safeName}-report.pdf"`,
      "Cache-Control": "no-store",
    },
  })
}
