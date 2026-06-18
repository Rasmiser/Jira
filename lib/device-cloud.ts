// ---------------------------------------------------------------------------
// RASMISER Real Device Cloud
//
// A catalog of real devices and browsers a test case can be executed against,
// mirroring a TestGrid-style device farm. This is a static catalog today; a
// real provider (BrowserStack-style backend) can be swapped in behind the same
// shape later without touching the UI or the execution engine.
// ---------------------------------------------------------------------------

export type DevicePlatform = "android" | "ios" | "web"

export interface CloudDevice {
  id: string
  name: string
  platform: DevicePlatform
  /** e.g. "Android 14", "iOS 17.5", "Windows 11" */
  os: string
  osVersion: string
  /** marketing manufacturer / vendor */
  vendor: string
  /** logical form factor */
  formFactor: "phone" | "tablet" | "desktop"
  /** browser when platform === "web" */
  browser?: string
  /** screen resolution label */
  resolution: string
  /** real availability flag — busy devices queue */
  availability: "available" | "busy"
  /** popularity by user share, drives default sorting (0-100) */
  share: number
}

export const CLOUD_DEVICES: CloudDevice[] = [
  // Android phones
  {
    id: "pixel-8-pro-a14",
    name: "Google Pixel 8 Pro",
    platform: "android",
    os: "Android 14",
    osVersion: "14",
    vendor: "Google",
    formFactor: "phone",
    resolution: "1344 x 2992",
    availability: "available",
    share: 12,
  },
  {
    id: "galaxy-s24-a14",
    name: "Samsung Galaxy S24",
    platform: "android",
    os: "Android 14",
    osVersion: "14",
    vendor: "Samsung",
    formFactor: "phone",
    resolution: "1080 x 2340",
    availability: "available",
    share: 18,
  },
  {
    id: "galaxy-s22-a13",
    name: "Samsung Galaxy S22",
    platform: "android",
    os: "Android 13",
    osVersion: "13",
    vendor: "Samsung",
    formFactor: "phone",
    resolution: "1080 x 2340",
    availability: "busy",
    share: 9,
  },
  {
    id: "pixel-6a-a12",
    name: "Google Pixel 6a",
    platform: "android",
    os: "Android 12",
    osVersion: "12",
    vendor: "Google",
    formFactor: "phone",
    resolution: "1080 x 2400",
    availability: "available",
    share: 6,
  },
  {
    id: "galaxy-tab-s9-a14",
    name: "Samsung Galaxy Tab S9",
    platform: "android",
    os: "Android 14",
    osVersion: "14",
    vendor: "Samsung",
    formFactor: "tablet",
    resolution: "1600 x 2560",
    availability: "available",
    share: 3,
  },
  // iOS
  {
    id: "iphone-15-pro-ios17",
    name: "iPhone 15 Pro",
    platform: "ios",
    os: "iOS 17.5",
    osVersion: "17.5",
    vendor: "Apple",
    formFactor: "phone",
    resolution: "1179 x 2556",
    availability: "available",
    share: 16,
  },
  {
    id: "iphone-14-ios17",
    name: "iPhone 14",
    platform: "ios",
    os: "iOS 17.2",
    osVersion: "17.2",
    vendor: "Apple",
    formFactor: "phone",
    resolution: "1170 x 2532",
    availability: "available",
    share: 11,
  },
  {
    id: "iphone-13-ios16",
    name: "iPhone 13",
    platform: "ios",
    os: "iOS 16.6",
    osVersion: "16.6",
    vendor: "Apple",
    formFactor: "phone",
    resolution: "1170 x 2532",
    availability: "busy",
    share: 8,
  },
  {
    id: "iphone-se-ios16",
    name: "iPhone SE (3rd gen)",
    platform: "ios",
    os: "iOS 16.4",
    osVersion: "16.4",
    vendor: "Apple",
    formFactor: "phone",
    resolution: "750 x 1334",
    availability: "available",
    share: 4,
  },
  {
    id: "ipad-pro-13-ios17",
    name: 'iPad Pro 12.9"',
    platform: "ios",
    os: "iPadOS 17.5",
    osVersion: "17.5",
    vendor: "Apple",
    formFactor: "tablet",
    resolution: "2048 x 2732",
    availability: "available",
    share: 3,
  },
  // Web browsers
  {
    id: "chrome-win11",
    name: "Chrome on Windows 11",
    platform: "web",
    os: "Windows 11",
    osVersion: "11",
    vendor: "Microsoft",
    formFactor: "desktop",
    browser: "Chrome 126",
    resolution: "1920 x 1080",
    availability: "available",
    share: 22,
  },
  {
    id: "safari-macos",
    name: "Safari on macOS Sonoma",
    platform: "web",
    os: "macOS 14",
    osVersion: "14",
    vendor: "Apple",
    formFactor: "desktop",
    browser: "Safari 17",
    resolution: "2560 x 1440",
    availability: "available",
    share: 10,
  },
  {
    id: "edge-win11",
    name: "Edge on Windows 11",
    platform: "web",
    os: "Windows 11",
    osVersion: "11",
    vendor: "Microsoft",
    formFactor: "desktop",
    browser: "Edge 126",
    resolution: "1920 x 1080",
    availability: "busy",
    share: 7,
  },
  {
    id: "firefox-win11",
    name: "Firefox on Windows 11",
    platform: "web",
    os: "Windows 11",
    osVersion: "11",
    vendor: "Microsoft",
    formFactor: "desktop",
    browser: "Firefox 127",
    resolution: "1920 x 1080",
    availability: "available",
    share: 5,
  },
]

export function getDevice(id: string): CloudDevice | undefined {
  return CLOUD_DEVICES.find((d) => d.id === id)
}

/**
 * Devices compatible with a test case's platform. A "cross" platform test can
 * run on any device; otherwise web maps to web and mobile maps to its OS.
 */
export function devicesForPlatform(platform: string): CloudDevice[] {
  const list =
    platform === "cross"
      ? CLOUD_DEVICES
      : CLOUD_DEVICES.filter((d) => d.platform === platform)
  return [...list].sort((a, b) => b.share - a.share)
}

export const PLATFORM_FACETS: Array<{ value: DevicePlatform; label: string }> = [
  { value: "android", label: "Android" },
  { value: "ios", label: "iOS" },
  { value: "web", label: "Web" },
]
