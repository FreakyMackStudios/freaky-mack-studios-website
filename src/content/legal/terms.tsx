import { CONTACT } from "@/shared/config";

/**
 * From design/boards/Terms.dc.html, with the blanks filled in from the studio's answers (Oct 2026). The
 * lawyer reviews the final wording before launch.
 */
export const SUBTITLE = "The rules for using this website — short, and in plain English.";

export const TOC: [id: string, label: string][] = [
  ["t1", "About these terms"],
  ["t2", "Using the site"],
  ["t3", "Our work & IP"],
  ["t4", "Enquiries & quotes"],
  ["t5", "Pitches & ideas"],
  ["t6", "Third-party links"],
  ["t7", "No guarantees"],
  ["t8", "Liability"],
  ["t9", "Governing law"],
  ["t10", "Changes"],
  ["t11", "Contact"],
];

export function Body() {
  return (
    <>
      <section id="t1"><h2><span>01</span>About these terms</h2><p>These terms cover your use of freakymackstudios.com (“the site”), run by Freaky Mack Studios Pvt. Ltd., 1402, Arc One, Oshiwara, Andheri West, Mumbai 400053, India. By using the site you agree to them. If you don’t agree, please don’t use the site.</p></section>
      <section id="t2"><h2><span>02</span>Using the site</h2><p>You’re welcome to browse, watch and share links to our work. You agree not to:</p><ul><li>copy, download, re-upload or re-edit our films, stills or other content without our written permission;</li><li>use the site for anything unlawful or misleading;</li><li>try to break, overload or gain unauthorised access to the site.</li></ul></section>
      <section id="t3"><h2><span>03</span>Our work &amp; intellectual property</h2><p>The films, stills, text, the Freaky Mack name, logo and blob mark, and everything else on the site belong to Freaky Mack Studios or to the clients and partners we made them with. Client names, brands and trademarks shown on the site belong to their owners and appear with their permission. Nothing on the site gives you a licence to use any of them.</p></section>
      <section id="t4"><h2><span>04</span>Enquiries &amp; quotes</h2><p>Sending an enquiry doesn’t create an agreement between us. Any project we take on is governed by a separate written agreement or quote, which takes priority over anything on this site. Timelines, prices and availability discussed through the site aren’t binding until confirmed in writing.</p></section>
      <section id="t5"><h2><span>05</span>Pitches &amp; ideas</h2><p>We’re a home for ideas, so people pitch us often — and we may already be developing something similar. Sending us an idea doesn’t oblige us to use it, pay for it or keep it confidential, unless we agree otherwise in writing. If your idea is confidential, talk to us before you send the details.</p></section>
      <section id="t6"><h2><span>06</span>Third-party links &amp; embeds</h2><p>The site links to and embeds YouTube, Vimeo, Instagram, LinkedIn and WhatsApp. We don’t control those services and aren’t responsible for their content or how they handle your data.</p></section>
      <section id="t7"><h2><span>07</span>No guarantees</h2><p>We work to keep the site accurate and running, but it’s provided “as is”. We don’t guarantee it will always be available, error-free or up to date.</p></section>
      <section id="t8"><h2><span>08</span>Liability</h2><p>To the extent the law allows, we aren’t liable for any indirect or consequential loss arising from your use of the site. Nothing in these terms limits any liability that can’t be limited by law.</p></section>
      <section id="t9"><h2><span>09</span>Governing law</h2><p>These terms are governed by the laws of India. Any dispute relating to them will be handled by the courts in Mumbai, including the Bombay High Court.</p></section>
      <section id="t10"><h2><span>10</span>Changes</h2><p>We may update these terms from time to time; the date at the top shows the latest version. If you keep using the site after an update, you accept the new terms.</p></section>
      <section id="t11"><h2><span>11</span>Contact</h2><p>Questions about these terms? Write to <a href={`mailto:${CONTACT.email}`}>freakymackstudios@gmail.com</a> or to 1402, Arc One, Oshiwara, Andheri West, Mumbai 400053, India.</p></section>
      
    </>
  );
}
