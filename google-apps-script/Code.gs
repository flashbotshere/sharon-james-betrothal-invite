// Paste this whole file into Extensions > Apps Script > Code.gs, then Deploy as a Web app.
// After any change: Deploy > Manage deployments > Edit (pencil) > Version: New version > Deploy.

var SHEET_NAME = '';    // tab to write to; leave '' to use the first tab
var NOTIFY_EMAIL = '';  // optional: email address to notify on every RSVP
var HEADERS = ['Timestamp', 'Full Name', 'Attendance', 'Number of Guests', 'Dietary / Notes', 'Contact / Email'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return json_({ status: 'error', message: 'Busy, please try again.' });

  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (data.website) return json_({ status: 'success' }); // honeypot

    var name = String(data.name || '').trim();
    var attending = data.attending === 'Yes' ? 'Yes' : data.attending === 'No' ? 'No' : '';
    if (!name || !attending) return json_({ status: 'error', message: 'Name and attendance are required.' });

    var guests = attending === 'Yes' ? Math.max(1, parseInt(data.guests, 10) || 1) : 0;

    getSheet_().appendRow([new Date(), safe_(name), attending, guests, safe_(data.notes), safe_(data.contact)]);

    if (NOTIFY_EMAIL) {
      try {
        MailApp.sendEmail(
          NOTIFY_EMAIL,
          'New RSVP: ' + name + ' (' + attending + ')',
          name + ' replied ' + attending + (attending === 'Yes' ? ' for ' + guests + ' guest(s)' : '') +
            '.\nContact: ' + (data.contact || '-') + '\nNotes: ' + (data.notes || '-')
        );
      } catch (mailErr) {}
    }

    return json_({ status: 'success' });
  } catch (err) {
    return json_({ status: 'error', message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

// Open the Web App URL in a browser to check it's live.
function doGet() {
  return json_({ status: 'ok', message: 'RSVP endpoint is live' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = SHEET_NAME ? (ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME)) : ss.getSheets()[0];
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sh;
}

// Stores text as text: stops values starting with = + - @ being treated as formulas
// (also keeps phone numbers like +91... intact).
function safe_(v) {
  var s = String(v == null ? '' : v).trim().slice(0, 1000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
