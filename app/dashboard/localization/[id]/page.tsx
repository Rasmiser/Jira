import { notFound } from "next/navigation"
import { Languages } from "lucide-react"
import { getFeatureAccess } from "@/lib/feature-access"
import { FeatureLocked, FeaturePageHeader } from "@/components/dashboard/feature-gate"
import { getProject } from "@/app/actions/localization"
import { CONTENT_TYPES, localeLabel } from "@/lib/locales"
import { ProjectWorkspace } from "@/components/dashboard/localization/project-workspace"

export const dynamic = "force-dynamic"

interface TranslationSegment {
  key: string
  source: string
  translated: string
  note: string | null
}

export default async function LocalizationProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { allowed } = await getFeatureAccess("free")
  if (!allowed) {
    return <FeatureLocked featureName="Translate & Adapt localized content" requiredPlan="free" />
  }

  const { id } = await params
  const data = await getProject(id)
  if (!data) notFound()

  const { project, translations } = data
  const contentTypeLabel =
    CONTENT_TYPES.find((c) => c.id === project.contentType)?.label ?? project.contentType

  return (
    <div className="px-6 py-8 md:px-10">
      <FeaturePageHeader
        title={project.name}
        description={`${contentTypeLabel} · ${project.platform} · source ${localeLabel(
          project.sourceLocale,
        )} · ${project.tone} tone`}
        icon={Languages}
      />

      <ProjectWorkspace
        project={{
          id: project.id,
          name: project.name,
          contentType: project.contentType,
          platform: project.platform,
          sourceLocale: project.sourceLocale,
          targetLocales: (project.targetLocales as string[]) ?? [],
          tone: project.tone,
        }}
        translations={translations.map((t) => ({
          id: t.id,
          locale: t.locale,
          localeName: t.localeName,
          status: t.status,
          segments: (t.segments as TranslationSegment[]) ?? [],
          adaptationNotes: t.adaptationNotes,
          qualityScore: t.qualityScore,
        }))}
      />
    </div>
  )
}
