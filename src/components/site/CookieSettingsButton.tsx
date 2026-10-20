"use client";

import { openCookieSettings } from "@/shared/consent";

/** "Cookie settings" in the footer: brings the cookie banner back to change the analytics choice. */
export function CookieSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={`cursor-pointer border-0 bg-transparent p-0 text-inherit [font:inherit] ${className}`}>
      Cookie settings
    </button>
  );
}
