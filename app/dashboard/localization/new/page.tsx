import { Languages } from "lucide-react"
import { getFeatureAccess } from "@/lib/feature-access"
import { FeatureLocked, FeaturePageHeader } from "@/components/dashboard/feature-gate"
import { NewProjectForm } from "@/components/dashboard/localization/new-project-form"

export default async function NewLocalizationProjectPage() {
  const { allowed } = await getFeatureAccess("free")
  if (!allowed) {
    return <FeatureLocked featureName="Translate & Adapt localized content" requiredPlan="free" />
  }

  return (
    <div className="px-6 py-8 md:px-10">
      <FeaturePageHeader
        title="New localization project"
        description="Add your source content and pick the markets you want to reach. We'll create a translation workspace for each locale."
        icon={Languages}
      />
      <div className="max-w-3xl">
        <NewProjectForm />
      </div>
    </div>
  )
}
