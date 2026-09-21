/**
 * Google Apps Script endpoint for the Pavan & Sanjana RSVP sheet.
 * Attach this script to the Google Sheet that should receive responses.
 */

const RSVP_SPREADSHEET_ID = "1G1f8eb4aZinJL6uR1hx7z_Q_lToSoAz8-K9n5Kt-Mmc";
const RSVP_SHEET_NAME = "RSVP";
const RSVP_HEADERS = [
  "Timestamp",
  "Full Name",
  "Family Side",
  "Attending",
  "Number of Guests",
  "Message",
];

function doGet() {
  return jsonResponse({ ok: true, service: "Pavan & Sanjana RSVP" });
}

function doPost(event) {
  try {
    const payload = parsePayload(event);
    const response = appendRsvp(payload);
    return jsonResponse({ ok: true, id: response.id });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message });
  }
}

function parsePayload(event) {
  if (!event || !event.postData || !event.postData.contents) {
    throw new Error("Request body is missing.");
  }

  const payload = JSON.parse(event.postData.contents);
  const fullName = cleanText(payload.fullName, 100);
  const side = cleanText(payload.side, 20).toLowerCase();
  const attending = cleanText(payload.attending, 20).toLowerCase();
  const message = cleanText(payload.message, 500);
  const guests = Number(payload.guests);

  if (!fullName) throw new Error("Full name is required.");
  if (side !== "pavan" && side !== "sanjana") {
    throw new Error("Family side must be Pavan or Sanjana.");
  }
  if (attending !== "accept" && attending !== "decline") {
    throw new Error("Attending must be accept or decline.");
  }
  if (!Number.isInteger(guests) || guests < 0 || guests > 8) {
    throw new Error("Number of guests must be between 0 and 8.");
  }

  return {
    fullName: fullName,
    side: side,
    attending: attending,
    guests: attending === "accept" ? guests : 0,
    message: message,
  };
}

function appendRsvp(payload) {
  const spreadsheet = SpreadsheetApp.openById(RSVP_SPREADSHEET_ID);
  const sheet = getOrCreateSheet(spreadsheet);
  const lock = LockService.getScriptLock();

  lock.waitLock(10000);
  try {
    const id = Utilities.getUuid();
    sheet.appendRow([
      new Date(),
      payload.fullName,
      payload.side === "pavan" ? "Pavan" : "Sanjana",
      payload.attending === "accept" ? "Yes" : "No",
      payload.guests,
      payload.message,
    ]);
    return { id: id };
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(RSVP_SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(RSVP_SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(RSVP_HEADERS);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function cleanText(value, maxLength) {
  return String(value == null ? "" : value)
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
