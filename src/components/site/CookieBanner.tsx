"use client";

import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ANALYTICS } from "@/shared/config";
import { COOKIE_SETTINGS_EVENT, clearAnalyticsCookies, readConsent, saveConsent, subscribeConsent, type Consent } from "@/shared/consent";
import s from "./site.module.css";

type GtagWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void } & Record<string, unknown>;

/** Google Analytics 4 (gtag.js), loaded only after the visitor accepts. Page changes are tracked by GA itself. */
function loadGoogleAnalytics(id: string) {
  const w = window as unknown as GtagWindow;
  w[`ga-disable-${id}`] = false;
  if (document.getElementById("fm-ga")) return;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // gtag.js reads the arguments object itself, so it is pushed as is.
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", id);
  const tag = document.createElement("script");
  tag.id = "fm-ga";
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(tag);
}

const BTN = `${s.pill} flex h-[44px] cursor-pointer items-center rounded-full border px-[22px] text-[14px] font-semibold whitespace-nowrap [font-family:inherit]`;

/**
 * The cookie banner: asks once, before any analytics run (India's DPDP Act: consent first, as easy to
 * withdraw as to give). "Cookie settings" in the footer brings it back. Sits bottom-left on wider screens
 * and above the theme switch on phones.
 */
export function CookieBanner() {
  // "server" while pre-rendering and hydrating (nothing shows), then the saved choice, or null if none yet.
  const choice = useSyncExternalStore<Consent | null | "server">(subscribeConsent, readConsent, () => "server");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const open = settingsOpen || choice === null;

  useEffect(() => {
    const onSettings = () => setSettingsOpen(true);
    window.addEventListener(COOKIE_SETTINGS_EVENT, onSettings);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, onSettings);
  }, []);

  useEffect(() => {
    if (choice === "granted" && ANALYTICS.gaId) loadGoogleAnalytics(ANALYTICS.gaId);
  }, [choice]);

  const decide = (next: Consent) => {
    const withdrawn = choice === "granted" && next === "denied";
    saveConsent(next);
    setSettingsOpen(false);
    if (withdrawn) {
      // Stop measuring at once, clear Google's cookies, and reload so no analytics script stays loaded.
      if (ANALYTICS.gaId) (window as unknown as GtagWindow)[`ga-disable-${ANALYTICS.gaId}`] = true;
      clearAnalyticsCookies();
      window.location.reload();
    }
  };

  return (
    <>
      {choice === "granted" && <Analytics />}
      {open && (
        <section
          role="region"
          aria-label="Cookie choices"
          data-cookie-banner
          className="fixed right-4 bottom-[72px] left-4 z-[1001] flex flex-col gap-[14px] rounded-[24px] border border-[var(--line-2)] bg-[var(--ground)] p-[20px] text-[var(--ink)] shadow-[0_20px_60px_rgba(0,0,0,0.3)] sm:right-auto sm:bottom-4 sm:max-w-[420px] sm:p-[24px]"
        >
          <p className={`${s.it} m-0 text-[22px] leading-[1.1]`}>Cookies, quickly.</p>
          <p className="m-0 text-[14px] leading-[1.55] text-[var(--ink-2)]">
            We’d like to use analytics (Google Analytics and Vercel Analytics) to see how the site is used. They stay
            off unless you accept. You can change your mind any time from Cookie settings at the foot of the page.{" "}
            <Link href="/privacy#p7" className={`${s.link} underline underline-offset-2`}>
              Privacy policy
            </Link>
          </p>
          <div className="flex flex-wrap gap-[10px]">
            <button type="button" onClick={() => decide("granted")} className={`${BTN} border-[var(--accent)] bg-[var(--accent)] text-[var(--on-accent)]`}>
              Accept
            </button>
            <button type="button" onClick={() => decide("denied")} className={`${BTN} border-[var(--ink)] bg-transparent text-[var(--ink)]`}>
              Decline
            </button>
          </div>
        </section>
      )}
    </>
  );
}
