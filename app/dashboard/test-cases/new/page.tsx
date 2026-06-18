import Link from "next/link"
import { CoTesterAuthor } from "@/components/dashboard/cotester-author"
import { ArrowLeft } from "lucide-react"

export default function NewTestCasePage() {
  return (
    <div className="px-6 py-8 md:px-10">
      <Link
        href="/dashboard/test-cases"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Test case library
      </Link>

      <div className="mt-4">
        <h1 className="font-display text-4xl tracking-tight text-foreground">
          New test case
        </h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Describe the behavior you want to verify and let CoTester generate the
          structured steps, or build the case manually.
        </p>
      </div>

      <div className="mt-8">
        <CoTesterAuthor />
      </div>
    </div>
  )
}
