import type { ReactNode } from "react";
import { CONTACT, STUDIO } from "@/shared/config";
import s from "./site.module.css";

/** Small line icons for the contact details. They inherit the text colour. */
const svg = (children: ReactNode, fill = false) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill={fill ? "currentColor" : "none"}
    stroke={fill ? "none" : "currentColor"}
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const MailIcon = () =>
  svg(
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </>,
  );

export const PhoneIcon = () =>
  svg(
    <path d="M6.6 3.5h2.3l1.4 4.2-2 1.3a11 11 0 0 0 6.7 6.7l1.3-2 4.2 1.4v2.3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />,
  );

export const WhatsAppIcon = () =>
  svg(
    <path d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.2 21.8l5.1-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.8c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.1 8.1 0 1 1 12 20Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />,
    true,
  );

export const PinIcon = () =>
  svg(
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>,
  );

export const GlobeIcon = () =>
  svg(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
    </>,
  );

/** One contact line: an icon in a small ring, then the detail. */
export function ContactRow({ icon, children, className = "" }: { icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <li className={`flex items-start gap-[12px] ${className}`}>
      <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-[var(--line-2)] text-[var(--muted)]">
        {icon}
      </span>
      <span className="min-w-0 pt-[5px]">{children}</span>
    </li>
  );
}

/**
 * Items on one line, split by "|". Where they don't fit (phones), they wrap and the divider at the start of a
 * wrapped line is clipped away, so no line begins with a bar.
 */
function DividedLine({ items, className = "" }: { items: { key: string; node: ReactNode }[]; className?: string }) {
  return (
    <span className={`block overflow-hidden py-[3px] -my-[3px] ${className}`}>
      <span className="-ml-[29px] flex flex-wrap gap-y-[6px]">
        {items.map((it) => (
          <span key={it.key} className="flex items-baseline whitespace-nowrap">
            <span aria-hidden="true" className="w-[29px] text-center text-[var(--muted-2)]">
              |
            </span>
            {it.node}
          </span>
        ))}
      </span>
    </span>
  );
}

/** The studio's three numbers on one line, split by "|". */
export function PhoneLine({ className = "" }: { className?: string }) {
  return (
    <DividedLine
      className={className}
      items={CONTACT.phones.map((ph) => ({
        key: ph.href,
        node: (
          <a href={ph.href} className={s.link}>
            {ph.label}
          </a>
        ),
      }))}
    />
  );
}

/** Where the studio works ("India | UAE | France"), split by "|" like the phones. */
export function LocationLine({ className = "" }: { className?: string }) {
  return <DividedLine className={className} items={STUDIO.locations.map((l) => ({ key: l, node: <span>{l}</span> }))} />;
}

/** "Say hello" in the footers: email, the three phones, WhatsApp, the address and the countries, each with its icon. */
export function ContactDetails() {
  return (
    <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
      <ContactRow icon={<MailIcon />}>
        <a href={`mailto:${CONTACT.email}`} className={`${s.link} break-all md:break-normal`}>
          {CONTACT.email}
        </a>
      </ContactRow>
      <ContactRow icon={<PhoneIcon />}>
        <span className="sr-only">Phone: </span>
        <PhoneLine />
      </ContactRow>
      <ContactRow icon={<WhatsAppIcon />}>
        <a href={CONTACT.whatsapp} className={s.link}>
          WhatsApp · {CONTACT.whatsappNumber}
        </a>
      </ContactRow>
      <ContactRow icon={<PinIcon />}>
        <address className="text-[var(--muted)] not-italic">{STUDIO.address.join(", ")}</address>
      </ContactRow>
      <ContactRow icon={<GlobeIcon />}>
        <span className="sr-only">Locations: </span>
        <LocationLine className="text-[var(--muted)]" />
      </ContactRow>
    </ul>
  );
}
