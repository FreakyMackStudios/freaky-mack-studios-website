import type { Metadata } from "next";
import { CONTACT, STUDIO } from "@/shared/config";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import s from "@/components/site/site.module.css";
import { ContactRow, PhoneIcon, PhoneLine, WhatsAppIcon } from "@/components/site/ContactDetails";
import { H1, Intro, Kicker, Label, PX } from "@/components/site/ui";
import { EnquiryForm } from "./_components/EnquiryForm";

export const metadata: Metadata = {
  title: "Start a project",
  description: "Tell us what you’re making. We read every brief and come back to you personally.",
  alternates: { canonical: "/start-a-project" },
};

const NEXT_STEPS = [
  "We read your brief — every word of it.",
  `We set up a call to talk it through, within ${CONTACT.replyTime}.`,
  "We come back with an approach and a quote. There’s no fixed budget: every quote is built around your project.",
];

/** design/boards/Contact.dc.html */
export default function StartAProjectPage() {
  return (
    <>
      <Reveal
        as="section"
        onMount
        stagger={0.12}
        delay={0.1}
        className={`flex flex-col gap-[24px] pt-[64px] pb-[48px] lg:gap-[28px] lg:pt-[120px] lg:pb-[80px] ${PX}`}
      >
        <RevealItem>
          <Kicker>Chapter 06 — Your turn</Kicker>
        </RevealItem>
        <RevealItem from={{ y: 60, blur: 8 }} duration={1.1}>
        <H1 big balance={false} tracking="tracking-[-0.035em]" className="max-w-[1150px]">
          Got a story?{" "}
          <span
            className={`${s.it} text-[clamp(44px,7.222vw,104px)] font-normal tracking-normal text-[var(--accent-text)] normal-case`}
          >
            Let’s shoot it.
          </span>
        </H1>
        </RevealItem>
        <RevealItem>
          <Intro>Tell us what you’re making. We read every brief and come back to you personally.</Intro>
        </RevealItem>
      </Reveal>

      <section className={`grid grid-cols-1 items-start gap-y-[72px] pb-[96px] lg:pb-[160px] xl:grid-cols-12 xl:gap-x-[32px] ${PX}`}>
        <Reveal onMount delay={0.45} from={{ y: 70 }} duration={1} className="xl:col-span-8">
          <EnquiryForm />
        </Reveal>

        <Reveal
          as="aside"
          stagger={0.14}
          delay={0.6}
          onMount
          className="grid grid-cols-1 items-start gap-[48px] md:grid-cols-2 xl:col-span-4 xl:col-start-9 xl:flex xl:flex-col xl:gap-[64px] xl:pt-[64px]">
          <RevealItem className="flex flex-col gap-[20px]">
            <Label size="text-[20px] lg:text-[24px]">Rather talk?</Label>
            <a
              href={`mailto:${CONTACT.email}`}
              className={`${s.link} self-start border-b-[3px] border-[var(--accent)] pb-[4px] text-[19px] font-semibold break-all sm:break-normal lg:text-[22px]`}
            >
              {CONTACT.email}
            </a>
            <ul className="m-0 flex list-none flex-col gap-[14px] p-0 text-[17px] lg:text-[18px]">
              <ContactRow icon={<WhatsAppIcon />}>
                <a href={CONTACT.whatsapp} className={s.link}>
                  WhatsApp · {CONTACT.whatsappNumber} ↗
                </a>
              </ContactRow>
              <ContactRow icon={<PhoneIcon />}>
                <span className="sr-only">Call: </span>
                <PhoneLine />
              </ContactRow>
            </ul>
          </RevealItem>
          <RevealItem className="flex flex-col gap-[16px]">
            <Label size="text-[20px] lg:text-[24px]">The studio</Label>
            <address className="text-[17px] leading-[1.6] not-italic lg:text-[18px]">
              {STUDIO.address[0]}
              <br />
              {STUDIO.address[1]}, India
            </address>
          </RevealItem>
          <RevealItem from={{ y: 60 }} className="md:col-span-2 md:max-w-[520px] xl:max-w-none">
          <div className="flex flex-col gap-[28px] rounded-[28px] border border-[var(--ink)] p-[32px] [transform:rotate(1.5deg)] lg:p-[40px]">
            <Label size="text-[20px] lg:text-[24px]">What happens next</Label>
            <ol className="m-0 flex list-none flex-col gap-[26px] p-0">
              {NEXT_STEPS.map((t, i) => (
                <li key={t} className="flex items-baseline gap-[16px]">
                  <span className="text-[26px] font-extrabold text-[var(--accent-text)]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[16px] leading-[1.5]">{t}</span>
                </li>
              ))}
            </ol>
          </div>
          </RevealItem>
        </Reveal>
      </section>
    </>
  );
}
