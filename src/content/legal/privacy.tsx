import { CONTACT } from "@/shared/config";

/**
 * From design/boards/Privacy.dc.html, with the blanks filled in from the studio's answers (Oct 2026). The
 * lawyer reviews the final wording before launch.
 */
export const SUBTITLE = "What we collect on this website, why, and what you can do about it.";

export const TOC: [id: string, label: string][] = [
  ["p1", "Who we are"],
  ["p2", "What we collect"],
  ["p3", "How we use it"],
  ["p4", "Consent"],
  ["p5", "Who we share it with"],
  ["p6", "Videos & links"],
  ["p7", "Cookies"],
  ["p8", "How long we keep it"],
  ["p9", "Keeping it safe"],
  ["p10", "Your rights"],
  ["p11", "Children"],
  ["p12", "Changes"],
  ["p13", "Contact & grievances"],
];

export function Body() {
  return (
    <>
      <section id="p1"><h2><span>01</span>Who we are</h2><p>This website is run by Freaky Mack Studios Pvt. Ltd., 1402, Arc One, Oshiwara, Andheri West, Mumbai 400053, India (“we”, “us”). This policy explains what personal data we collect through this website, why we collect it, and the choices you have.</p></section>
      <section id="p2"><h2><span>02</span>What we collect</h2><ul><li><strong>When you send an enquiry:</strong> your name and email, and your phone number only if you choose to give it, plus anything else you choose to share — company, project details and links.</li><li><strong>When you email, call or WhatsApp us:</strong> your contact details and the messages you send.</li><li><strong>When you browse:</strong> basic technical data such as device, browser, pages visited and approximate location, collected through Google Analytics and Vercel Analytics — only if you accept analytics in the cookie banner.</li></ul></section>
      <section id="p3"><h2><span>03</span>How we use it</h2><ul><li>To reply to your enquiry and talk about your project.</li><li>To prepare proposals and quotes you ask for.</li><li>To understand how the site is used and make it better.</li><li>To keep records the law requires us to keep.</li></ul><p>We don’t use your data for anything unrelated to these purposes, and we don’t sell it.</p></section>
      <section id="p4"><h2><span>04</span>Consent</h2><p>We process your personal data on the basis of your consent, which you give when you submit the form or contact us, in line with India’s Digital Personal Data Protection Act, 2023. You can withdraw consent at any time by writing to us. Withdrawing won’t affect anything we did before you withdrew.</p></section>
      <section id="p5"><h2><span>05</span>Who we share it with</h2><p>We don’t sell your data or share it with anyone else: it stays with us. The only exceptions are the service providers that run the site for us, which handle only what they need to: Vercel, which hosts the website; Google, which stores the enquiries you send through our forms (in Google Sheets) and delivers them to us by email; and, if you accept analytics, Google Analytics and Vercel Analytics. We may also disclose data where the law requires it.</p></section>
      <section id="p6"><h2><span>06</span>Videos &amp; links</h2><p>Our films play through YouTube and Vimeo. When you watch one, those platforms may set cookies and collect data under their own privacy policies. The same applies when you follow links to Instagram, LinkedIn or WhatsApp.</p></section>
      <section id="p7"><h2><span>07</span>Cookies</h2><p>We use cookies that are essential for the site to work. With your permission, we also use analytics cookies (Google Analytics) to understand how the site is used; you can accept or decline them in the cookie banner, and change your choice at any time with “Cookie settings” at the foot of every page. Vercel Analytics doesn’t use cookies, and it also runs only if you accept. You can block or delete cookies in your browser settings at any time.</p></section>
      <section id="p8"><h2><span>08</span>How long we keep it</h2><p>Enquiries are kept for 12 months after our last conversation and then deleted. If we go on to work together, project records are kept for as long as the law requires.</p></section>
      <section id="p9"><h2><span>09</span>Keeping it safe</h2><p>We use reasonable security measures, including encrypted connections (HTTPS) and access limited to the people who need it. No system is perfectly secure, so please don’t send passwords, ID documents or other sensitive information through the form.</p></section>
      <section id="p10"><h2><span>10</span>Your rights</h2><p>You can ask us to:</p><ul><li>tell you what personal data we hold about you and how we use it;</li><li>correct, complete or update it;</li><li>delete it;</li><li>stop using it, by withdrawing your consent;</li><li>let someone else exercise these rights for you if you’re unable to.</li></ul><p>You can also raise a grievance with us using the details below. If you’re not satisfied with our response, you may approach the Data Protection Board of India.</p></section>
      <section id="p11"><h2><span>11</span>Children</h2><p>This site isn’t aimed at children, and we don’t knowingly collect personal data from anyone under 18.</p></section>
      <section id="p12"><h2><span>12</span>Changes</h2><p>If we update this policy, we’ll change the date at the top of this page. If the changes are significant, we’ll flag them on the site.</p></section>
      <section id="p13"><h2><span>13</span>Contact &amp; grievances</h2><p>Grievance officer: Izaan Khan, <a href="tel:+919318465829">+91 93184 65829</a><br /><a href={`mailto:${CONTACT.email}`}>freakymackstudios@gmail.com</a> · 1402, Arc One, Oshiwara, Andheri West, Mumbai 400053, India</p><p>We aim to respond within 7 to 14 days.</p></section>
      
    </>
  );
}
