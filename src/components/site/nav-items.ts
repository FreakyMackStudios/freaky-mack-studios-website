/** Main navigation (SiteNav board `base`, also the homepage header). */
export const NAV_ITEMS = [
  { key: "work", no: "01", label: "Work", href: "/work" },
  { key: "studio", no: "02", label: "Studio", href: "/studio" },
  { key: "originals", no: "03", label: "Originals", href: "/originals" },
  { key: "people", no: "04", label: "People", href: "/people" },
  { key: "companies", no: "05", label: "Sister companies", href: "/sister-companies" },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]["key"] | "contact" | "";

/** Which nav item a path belongs to (the board's `active` prop). */
export function activeFor(pathname: string): NavKey {
  if (pathname.startsWith("/start-a-project") || pathname.startsWith("/thanks")) return "contact";
  const hit = NAV_ITEMS.find((it) => pathname === it.href || pathname.startsWith(`${it.href}/`));
  return hit ? hit.key : "";
}
