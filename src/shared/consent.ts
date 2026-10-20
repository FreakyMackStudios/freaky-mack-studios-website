/**
 * Analytics consent. Nothing is measured until the visitor accepts in the cookie banner; the choice is
 * kept in this browser (localStorage) and can be changed at any time from "Cookie settings" in the footer.
 * Accepted: Google Analytics (when ANALYTICS.gaId is set) and Vercel Analytics load. Declined: neither does.
 */
export type Consent = "granted" | "denied";

const KEY = "fm-consent";
/** Fired on window when the choice changes, or when "Cookie settings" asks for the banner again. */
export const CONSENT_EVENT = "fm:consent";
export const COOKIE_SETTINGS_EVENT = "fm:cookie-settings";

/** The choice made in this page view, for browsers that block storage (it then holds until reload). */
let remembered: Consent | null = null;

export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : remembered;
  } catch {
    return remembered;
  }
}

export function saveConsent(choice: Consent) {
  remembered = choice;
  try {
    localStorage.setItem(KEY, choice);
  } catch {
    // Storage blocked (private mode): `remembered` keeps it for this page view.
  }
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: choice }));
}

/** For useSyncExternalStore: re-read whenever the choice changes (here, or in another tab). */
export function subscribeConsent(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent(COOKIE_SETTINGS_EVENT));
}

/** Google Analytics' own cookies (_ga, _ga_<id>), cleared when consent is withdrawn. */
export function clearAnalyticsCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim();
    if (!name.startsWith("_ga")) continue;
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
  }
}
