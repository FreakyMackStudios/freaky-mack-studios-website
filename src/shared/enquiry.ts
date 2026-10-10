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
export type EnquiryStatus = "idle" | "sending" | "sent" | "error";

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
 * With NEXT_PUBLIC_FORMSPREE_ENDPOINT set (e.g. https://formspree.io/f/xxxx) it posts there;
 * otherwise it opens a pre-filled email so nothing is lost on a static deploy.
 */
export async function submitEnquiry(e: Enquiry): Promise<void> {
  const subject = `New enquiry${e.format ? ` — ${e.format}` : ""}${e.name ? ` from ${e.name}` : ""}`;
  const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
  const filled = LABELS.filter(([k]) => e[k]?.trim());
  if (endpoint) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...Object.fromEntries(filled.map(([k, l]) => [l, e[k]])), Brief: e.brief, _subject: subject, _replyto: e.email }),
    });
    if (!res.ok) throw new Error(`Enquiry failed (${res.status})`);
    return;
  }
  const body = [...filled.map(([k, l]) => `${l}: ${e[k]}`), "", e.brief].join("\n");
  window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
    setStatus("sending");
    try {
      await submitEnquiry(enquiry);
      setStatus("sent");
      router.push("/thanks");
    } catch {
      setStatus("error");
    }
  };
  const message =
    status === "sending" ? "Sending…" : status === "error" ? `Something went wrong. Email us at ${CONTACT.email}.` : "";
  return { status, onSubmit, message, errors };
}
