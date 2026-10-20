/**
 * Freaky Mack Studios: website enquiries → Google Sheet + email.
 *
 * Paste this whole file into the Apps Script editor of the "Website enquiries" Google Sheet, owned by
 * zellarinternational@gmail.com (Extensions → Apps Script), then deploy it as a web app from that account.
 * Step-by-step: docs/enquiry-form-google-sheet.md.
 *
 * Both website forms (homepage and /start-a-project) POST a JSON enquiry here. For each one it:
 *   1. checks it (name, a valid email and the brief are required; the hidden "website" field must be empty),
 *   2. adds a row to the "Enquiries" tab (made, with a header row, on the first enquiry),
 *   3. emails NOTIFY_TO (the studio's inbox; sent from the account that owns the script), with Reply-To
 *      set to the sender so the studio can answer straight from Gmail,
 *   4. answers {"ok": true}. The website only shows its "Thanks" page after that answer.
 *
 * Free: it runs on the zellarinternational@gmail.com Google account. Gmail lets a script send about 100
 * emails a day on a personal account; every enquiry is still saved in the sheet if that is ever reached.
 */

/** Who gets an email for each enquiry. Several addresses: separate them with commas. */
const NOTIFY_TO = "freakymackstudios@gmail.com";
const SHEET_NAME = "Enquiries";

/** Sheet columns, in order: [field sent by the website, column heading]. */
const COLUMNS = [
  ["received", "Received"],
  ["name", "Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["company", "Brand, label or agency"],
  ["format", "Format"],
  ["audience", "Who it’s for"],
  ["timing", "When"],
  ["links", "Links"],
  ["brief", "The story so far"],
  ["source", "Sent from"],
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000); // one enquiry at a time, so rows never collide
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    // The website's hidden field: people never see it, bots fill it in. Pretend all is well, keep nothing.
    if (data.website) return reply({ ok: true });

    const field = (k) => String(data[k] == null ? "" : data[k]).trim().slice(0, 5000);
    const email = field("email");
    if (!field("name") || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !field("brief")) {
      return reply({ ok: false, error: "Name, a valid email and the brief are required." });
    }

    // 1. Save it.
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS.map((c) => c[1]));
      sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    sheet.appendRow(COLUMNS.map(([k]) => (k === "received" ? new Date() : asText(field(k)))));

    // 2. Email it.
    const subject = field("subject") || `New enquiry from ${field("name")}`;
    const lines = COLUMNS.filter(([k]) => k !== "received" && k !== "brief" && field(k)).map(([k, label]) => `${label}: ${field(k)}`);
    MailApp.sendEmail({
      to: NOTIFY_TO,
      replyTo: email,
      name: "Freaky Mack website",
      subject: subject,
      body: [...lines, "", "The story so far:", field("brief"), "", `Saved in: ${book.getUrl()}`].join("\n"),
    });

    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Opening the web app address in a browser shows this: a quick check that the deployment is live. */
function doGet() {
  return reply({ ok: true, service: "Freaky Mack enquiries" });
}

/** Text that starts with = + - or @ would be run as a formula in Sheets; store it as plain text instead. */
function asText(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
