"use server"

import { db } from "@/lib/db"
import { localizationProjects, localizationTranslations } from "@/lib/db/schema"
import { and, asc, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "@/lib/subscription"
import { localeLabel, type ContentType, type Tone } from "@/lib/locales"

export interface Segment {
  key: string
  text: string
}

export interface TranslatedSegment {
  key: string
  source: string
  translated: string
  note: string | null
}

export async function getProjects() {
  const userId = await getUserId()
  const projects = await db
    .select()
    .from(localizationProjects)
    .where(eq(localizationProjects.userId, userId))
    .orderBy(desc(localizationProjects.updatedAt))

  const translations = await db
    .select()
    .from(localizationTranslations)
    .where(eq(localizationTranslations.userId, userId))

  return projects.map((p) => ({
    ...p,
    translations: translations.filter((t) => t.projectId === p.id),
  }))
}

export async function getProject(id: string) {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(localizationProjects)
    .where(and(eq(localizationProjects.id, id), eq(localizationProjects.userId, userId)))
    .limit(1)
  const project = rows[0]
  if (!project) return null

  const translations = await db
    .select()
    .from(localizationTranslations)
    .where(
      and(
        eq(localizationTranslations.projectId, id),
        eq(localizationTranslations.userId, userId),
      ),
    )
    .orderBy(asc(localizationTranslations.localeName))

  return { project, translations }
}

interface CreateProjectInput {
  name: string
  contentType: ContentType
  platform: string
  sourceLocale: string
  tone: Tone
  segments: Segment[]
  targetLocales: string[]
}

export async function createProject(input: CreateProjectInput) {
  const userId = await getUserId()

  const name = input.name.trim()
  const segments = input.segments
    .map((s) => ({ key: s.key.trim(), text: s.text.trim() }))
    .filter((s) => s.key && s.text)
  const targetLocales = [...new Set(input.targetLocales)].filter(Boolean)

  if (!name || segments.length === 0 || targetLocales.length === 0) {
    return { error: "invalid" as const }
  }

  const projectId = crypto.randomUUID()

  await db.insert(localizationProjects).values({
    id: projectId,
    userId,
    name,
    contentType: input.contentType,
    platform: input.platform,
    sourceLocale: input.sourceLocale,
    targetLocales,
    segments,
    tone: input.tone,
  })

  await db.insert(localizationTranslations).values(
    targetLocales.map((locale) => ({
      id: crypto.randomUUID(),
      projectId,
      userId,
      locale,
      localeName: localeLabel(locale),
      status: "draft" as const,
      segments: segments.map((s) => ({
        key: s.key,
        source: s.text,
        translated: "",
        note: null,
      })),
    })),
  )

  revalidatePath("/dashboard/localization")
  return { id: projectId }
}

export async function addLocale(projectId: string, locale: string) {
  const userId = await getUserId()

  const rows = await db
    .select()
    .from(localizationProjects)
    .where(
      and(
        eq(localizationProjects.id, projectId),
        eq(localizationProjects.userId, userId),
      ),
    )
    .limit(1)
  const project = rows[0]
  if (!project) return { error: "not_found" as const }

  const current = (project.targetLocales as string[]) ?? []
  if (current.includes(locale)) return { error: "exists" as const }

  const segments = (project.segments as Segment[]) ?? []

  await db
    .update(localizationProjects)
    .set({ targetLocales: [...current, locale], updatedAt: new Date() })
    .where(
      and(
        eq(localizationProjects.id, projectId),
        eq(localizationProjects.userId, userId),
      ),
    )

  await db.insert(localizationTranslations).values({
    id: crypto.randomUUID(),
    projectId,
    userId,
    locale,
    localeName: localeLabel(locale),
    status: "draft",
    segments: segments.map((s) => ({
      key: s.key,
      source: s.text,
      translated: "",
      note: null,
    })),
  })

  revalidatePath(`/dashboard/localization/${projectId}`)
  return { ok: true as const }
}

export async function deleteProject(id: string) {
  const userId = await getUserId()
  await db
    .delete(localizationTranslations)
    .where(
      and(
        eq(localizationTranslations.projectId, id),
        eq(localizationTranslations.userId, userId),
      ),
    )
  await db
    .delete(localizationProjects)
    .where(and(eq(localizationProjects.id, id), eq(localizationProjects.userId, userId)))
  revalidatePath("/dashboard/localization")
}
