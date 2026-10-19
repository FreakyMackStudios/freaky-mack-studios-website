# Enquiry form → Google Sheet + Gmail (free)

Both forms on the website (the homepage "Got a story?" form and **Start a project**) send each enquiry to a
small Google Apps Script that runs on the studio's own Google account. For every enquiry it:

- adds a row to a Google Sheet (a permanent list of every enquiry), and
- emails **freakymackstudios@gmail.com**, with Reply-To set to the sender, so you can reply from Gmail.

It costs nothing. Gmail lets a script send about 100 emails a day on a personal account, and every enquiry
is saved in the sheet even if that is ever reached.

Setup takes about 10 minutes and is done once. Use the **freakymackstudios@gmail.com** Google account.

## 1. Make the sheet

1. Go to [sheets.new](https://sheets.new) (signed in as freakymackstudios@gmail.com).
2. Name it **Website enquiries** (top left).

## 2. Add the script

1. In the sheet: **Extensions → Apps Script**. A code editor opens in a new tab.
2. Delete everything in the editor (`function myFunction() {}`).
3. Open [`scripts/google-apps-script/enquiry.gs`](../scripts/google-apps-script/enquiry.gs) from this
   repository, copy all of it and paste it into the editor.
4. Click the **Save** icon (or Ctrl/Cmd + S). Name the project **Freaky Mack enquiries** if asked.

## 3. Deploy it as a web app

1. Click **Deploy → New deployment**.
2. Next to "Select type", click the gear icon and choose **Web app**.
3. Fill in:
   - **Description:** Website enquiries
   - **Execute as:** **Me (freakymackstudios@gmail.com)**
   - **Who has access:** **Anyone**. The website's visitors aren't signed in to Google, so this has to be
     "Anyone". It only lets people *send* an enquiry; nobody can read the sheet through it.
4. Click **Deploy**.
5. Google asks for permission: **Authorize access** → choose the account → if you see "Google hasn't
   verified this app", click **Advanced → Go to Freaky Mack enquiries (unsafe)**. It is your own script, so
   this is expected. → **Allow**. It asks to manage your spreadsheets (to add rows) and to send email as you
   (to notify you).
6. Copy the **Web app URL**. It looks like
   `https://script.google.com/macros/s/AKfy…/exec`.

Check it: open that URL in a browser. It should show `{"ok":true,"service":"Freaky Mack enquiries"}`.

## 4. Connect the website

Send the Web app URL to whoever maintains the site. It goes in one place:
`src/shared/config.ts` → `CONTACT.enquiryEndpoint`. Alternatively set the environment variable
`NEXT_PUBLIC_ENQUIRY_ENDPOINT` to it in the hosting settings and redeploy. The URL is not a secret: it is
visible in the website's code either way.

Then send a test enquiry from the live site. Within a few seconds you should see the row in the sheet and
the email in Gmail.

## Changing the script later

Edit it in the Apps Script editor, then **Deploy → Manage deployments → (pencil) Edit → Version: New
version → Deploy**. The URL stays the same, so the website needs no change.

## If something goes wrong

- **The website says "That didn't go through"**: open the Web app URL in a browser. If it doesn't show
  `{"ok":true,…}`, redeploy (step 3) and check "Who has access" is **Anyone**.
- **Rows appear but no email**: check Gmail's Spam folder, and the daily email limit (see the top of the
  page). In Apps Script, **Executions** (left sidebar) lists every run and any error.
- **Without a URL configured** the forms still work: "Send it over" opens the visitor's email app with
  the enquiry filled in, and asks them to press Send there.
