import {
  CheckCircle2,
  Smartphone,
  Gauge,
  Lock,
  LayoutTemplate,
  Bot,
  type LucideIcon,
} from "lucide-react"

// Maps the icon names stored in the test-engine metadata to lucide components.
export const TEST_ICONS: Record<string, LucideIcon> = {
  CheckCircle2,
  Smartphone,
  Gauge,
  Lock,
  LayoutTemplate,
  Bot,
}

export function getTestIcon(name: string): LucideIcon {
  return TEST_ICONS[name] ?? CheckCircle2
}
