"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/** Fired on the homepage to bring the visitor to Chapter 06 and point out what to fill in (Contact.tsx). */
export const SAY_HELLO_EVENT = "fm:say-hello";
/** The same, from another page: the homepage reads ?hello=podcast when it loads. */
export const SAY_HELLO_HREF = "/?hello=podcast#contact";

/**
 * "Want to be on it? Say hello": takes the visitor to the homepage enquiry form (Chapter 06), which then
 * shows small speech bubbles by the fields. On the homepage it scrolls there; elsewhere it goes there.
 */
export function SayHelloLink({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <Link
      href={SAY_HELLO_HREF}
      scroll={false}
      className={className}
      onClick={(e) => {
        if (window.location.pathname !== "/") return;
        e.preventDefault();
        window.dispatchEvent(new CustomEvent(SAY_HELLO_EVENT));
      }}
    >
      {children}
    </Link>
  );
}
