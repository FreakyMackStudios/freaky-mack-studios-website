"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CONTACT } from "./config";

/** Everything an enquiry can carry: the chip answers and every field (CLAUDE.md → Enquiry form). */
export type Enquiry = {
  name: string;
  email: string;
  brief: string;
  format?: string;
  audience?: string;
  timing?: string;
  company?: string;
  phone?: string;
  links?: string;
  source?: string;
};
export type EnquiryErrors = Partial<Record<"name" | "email" | "brief", string>>;
/** "email": no endpoint is set, so the visitor's email app was opened with the enquiry filled in. */
export type EnquiryStatus = "idle" | "sending" | "sent" | "email" | "error";

/** How this build sends enquiries: straight to the studio ("post"), or through the visitor's email app. */
export const SEND_MODE: "post" | "email" = CONTACT.enquiryEndpoint ? "post" : "email";

const LABELS: [keyof Enquiry, string][] = [
  ["format", "Format"],
  ["audience", "Who it’s for"],
  ["timing", "When"],
  ["name", "Name"],
  ["email", "Email"],
  ["company", "Brand, label or agency"],
  ["phone", "Phone"],
  ["links", "Links"],
  ["source", "Sent from"],
];

/** Name, email and the brief are required. */
export function validateEnquiry(e: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (!e.name.trim()) errors.name = "Please tell us your name.";
  if (!e.email.trim()) errors.email = "We need an email to reply to.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email.trim())) errors.email = "That email doesn’t look quite right.";
  if (!e.brief.trim()) errors.brief = "A line or two about the project, please.";
  return errors;
}

/**
 * Sends an enquiry to freakymackstudios@gmail.com.
 * With an endpoint (CONTACT.enquiryEndpoint: the studio's Google Apps Script web app) it posts there; the
 * script saves a row in the Google Sheet and emails the studio, and answers {"ok": true} once both are done.
 * It is sent as text/plain so the browser makes a simple request (no CORS preflight, which Apps Script
 * can't answer). Without an endpoint it opens a pre-filled email, so nothing is lost on a static deploy.
 * Resolves "sent" or "email"; throws if the studio's endpoint didn't confirm.
 */
export async function submitEnquiry(e: Enquiry): Promise<"sent" | "email"> {
  const subject = `New enquiry${e.format ? ` — ${e.format}` : ""}${e.name ? ` from ${e.name}` : ""}`;
  const endpoint = CONTACT.enquiryEndpoint;
  if (endpoint) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...e, subject }),
    });
    const reply = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    if (!res.ok || !reply?.ok) throw new Error(`Enquiry not confirmed (${res.status})`);
    return "sent";
  }
  const filled = LABELS.filter(([k]) => e[k]?.trim());
  const body = [...filled.map(([k, l]) => `${l}: ${e[k]}`), "", e.brief].join("\n");
  window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return "email";
}

const text = (d: FormData, k: string) => String(d.get(k) ?? "");

/**
 * Form wiring shared by the homepage form and /start-a-project. Reads name/email/brief/company/phone/links
 * from the form, adds `extra` (chip answers), validates, sends, then goes to /thanks.
 */
export function useEnquiryForm(extra?: Partial<Enquiry>) {
  const router = useRouter();
  const [status, setStatus] = useState<EnquiryStatus>("idle");
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const d = new FormData(ev.currentTarget);
    const enquiry: Enquiry = {
      ...extra,
      name: text(d, "name"),
      email: text(d, "email"),
      brief: text(d, "brief"),
      company: text(d, "company"),
      phone: text(d, "phone"),
      links: text(d, "links"),
    };
    const found = validateEnquiry(enquiry);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = ev.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`);
      first?.focus();
      return;
    }
    // A bot filled the hidden "website" field: act as if it went through, send nothing.
    if (text(d, "website")) {
      router.push("/thanks");
      return;
    }
    setStatus("sending");
    try {
      const how = await submitEnquiry(enquiry);
      setStatus(how);
      // Only a confirmed send goes to Thanks. When the email app opens instead, the visitor still has to
      // press Send there, so the page says so rather than thanking them for a message we haven't got.
      if (how === "sent") router.push("/thanks");
    } catch {
      setStatus("error");
    }
  };
  const message =
    status === "sending"
      ? "Sending…"
      : status === "email"
        ? "Your email app should open with your message filled in. Press Send there and it reaches us."
        : status === "error"
          ? `That didn’t go through. Please try again, or email us at ${CONTACT.email}.`
          : "";
  return { status, onSubmit, message, errors };
}
