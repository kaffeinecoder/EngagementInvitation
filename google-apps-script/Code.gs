/**
 * Google Apps Script endpoint for the Pavan & Sanjana RSVP sheet.
 * Attach this script to the Google Sheet that should receive responses.
 */

const RSVP_SPREADSHEET_ID = "1G1f8eb4aZinJL6uR1hx7z_Q_lToSoAz8-K9n5Kt-Mmc";
const RSVP_SHEET_NAME = "RSVP";

const RSVP_HEADERS = [
  "Timestamp",
  "Full Name",
  "Phone Number",
  "Family Side",
  "Attending",
  "Number of Guests",
  "Breakfast",
  "Lunch",
  "Message",
];

function doGet() {
  return jsonResponse({
    ok: true,
    service: "Pavan & Sanjana RSVP"
  });
}

function doPost(event) {
  try {
    const payload = parsePayload(event);
    const response = appendRsvp(payload);

    return jsonResponse({
      ok: true,
      id: response.id,
      action: response.action
    });

  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error.message
    });
  }
}

function parsePayload(event) {
  if (!event || !event.postData || !event.postData.contents) {
    throw new Error("Request body is missing.");
  }

  const payload = JSON.parse(event.postData.contents);

  const fullName = cleanText(payload.fullName, 100);
  const phone = cleanText(payload.phone, 20);
  const side = cleanText(payload.side, 20).toLowerCase();
  const attending = cleanText(payload.attending, 20).toLowerCase();
  const breakfast = cleanText(payload.breakfast, 20).toLowerCase();
  const lunch = cleanText(payload.lunch, 20).toLowerCase();
  const message = cleanText(payload.message, 500);
  const guests = Number(payload.guests);

  if (!fullName) {
    throw new Error("Full name is required.");
  }

  if (!phone) {
    throw new Error("Phone number is required.");
  }

  if (side !== "pavan" && side !== "sanjana") {
    throw new Error("Family side must be Pavan or Sanjana.");
  }

  if (attending !== "accept" && attending !== "decline") {
    throw new Error("Attending must be accept or decline.");
  }

  if (!Number.isInteger(guests) || guests < 0 || guests > 8) {
    throw new Error("Number of guests must be between 0 and 8.");
  }

  const normalizedBreakfast =
    attending === "accept" ? breakfast : "";

  const normalizedLunch =
    attending === "accept" ? lunch : "";

  if (attending === "accept") {

    if (
      normalizedBreakfast !== "yes" &&
      normalizedBreakfast !== "no"
    ) {
      throw new Error("Breakfast choice is required.");
    }

    if (
      normalizedLunch !== "yes" &&
      normalizedLunch !== "no"
    ) {
      throw new Error("Lunch choice is required.");
    }
  }

  return {
    fullName,
    phone,
    side,
    attending,
    guests: attending === "accept" ? guests : 0,
    breakfast: normalizedBreakfast,
    lunch: normalizedLunch,
    message,
  };
}


/**
 * Adds a new RSVP or updates an existing RSVP
 * based on the phone number.
 *
 * Phone Number is treated as the unique identifier.
 */
function appendRsvp(payload) {

  const spreadsheet = SpreadsheetApp.openById(
    RSVP_SPREADSHEET_ID
  );

  const sheet = getOrCreateSheet(spreadsheet);

  const lock = LockService.getScriptLock();

  lock.waitLock(10000);

  try {

    const id = Utilities.getUuid();

    // Normalize phone number before comparing/storing
    const phone = normalizePhone(payload.phone);

    const rowData = [
      new Date(),
      payload.fullName,
      phone,
      payload.side === "pavan"
        ? "Pavan"
        : "Sanjana",

      payload.attending === "accept"
        ? "Yes"
        : "No",

      payload.guests,

      payload.breakfast === "yes"
        ? "Yes"
        : payload.breakfast === "no"
        ? "No"
        : "",

      payload.lunch === "yes"
        ? "Yes"
        : payload.lunch === "no"
        ? "No"
        : "",

      payload.message,
    ];


    /*
     * If the sheet only contains headers,
     * directly add the first RSVP.
     */
    const lastRow = sheet.getLastRow();

    if (lastRow <= 1) {

      sheet.appendRow(rowData);

      return {
        id: id,
        action: "created"
      };
    }


    /*
     * Phone Number is Column C.
     *
     * Read all existing phone numbers
     * and find a matching phone number.
     */
    const phoneValues = sheet
      .getRange(
        2,              // Start row
        3,              // Column C
        lastRow - 1,    // Number of rows
        1               // One column
      )
      .getValues();


    let existingRow = -1;


    for (let i = 0; i < phoneValues.length; i++) {

      const existingPhone =
        normalizePhone(phoneValues[i][0]);

      if (existingPhone === phone) {

        existingRow = i + 2;

        break;
      }
    }


    /*
     * Existing phone number found.
     *
     * Replace the entire old row with
     * the latest RSVP.
     */
    if (existingRow !== -1) {

      sheet
        .getRange(
          existingRow,
          1,
          1,
          rowData.length
        )
        .setValues([rowData]);

      return {
        id: id,
        action: "updated",
        row: existingRow
      };
    }


    /*
     * Phone number doesn't exist.
     *
     * Create a new RSVP row.
     */
    sheet.appendRow(rowData);

    return {
      id: id,
      action: "created"
    };


  } finally {

    lock.releaseLock();

  }
}


/**
 * Normalize phone numbers so that:
 *
 * 8197760715
 * +91 8197760715
 * +91-8197760715
 * 918197760715
 *
 * are treated as the same phone number.
 */
function normalizePhone(phone) {

  if (!phone) {
    return "";
  }

  let value = String(phone)
    .replace(/\D/g, "");

  /*
   * Keep only the last 10 digits.
   */
  if (value.length > 10) {
    value = value.slice(-10);
  }

  return value;
}


function getOrCreateSheet(spreadsheet) {

  let sheet =
    spreadsheet.getSheetByName(RSVP_SHEET_NAME);

  if (!sheet) {
    sheet =
      spreadsheet.insertSheet(RSVP_SHEET_NAME);
  }


  if (sheet.getLastRow() === 0) {

    sheet.appendRow(RSVP_HEADERS);

    sheet.setFrozenRows(1);

    return sheet;
  }


  const existingHeaders = sheet
    .getRange(
      1,
      1,
      1,
      Math.max(
        sheet.getLastColumn(),
        RSVP_HEADERS.length
      )
    )
    .getValues()[0];


  const normalizedExisting =
    existingHeaders.map((header) =>
      String(header || "")
        .trim()
        .toLowerCase()
    );


  const missingHeaders =
    RSVP_HEADERS.filter(
      (header) =>
        !normalizedExisting.includes(
          header.trim().toLowerCase()
        )
    );


  if (missingHeaders.length > 0) {

    const mergedHeaders = [
      ...existingHeaders.filter(
        (value) => value !== ""
      ),
      ...missingHeaders,
    ];


    sheet
      .getRange(
        1,
        1,
        1,
        mergedHeaders.length
      )
      .setValues([mergedHeaders]);


    sheet.setFrozenRows(1);
  }


  return sheet;
}


function cleanText(value, maxLength) {

  return String(
    value == null ? "" : value
  )
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}


function jsonResponse(value) {

  return ContentService
    .createTextOutput(
      JSON.stringify(value)
    )
    .setMimeType(
      ContentService.MimeType.JSON
    );
}


/**
 * Utility function to force RSVP headers.
 */
function forceRsvpHeaders() {

  const spreadsheet =
    SpreadsheetApp.openById(
      "1G1f8eb4aZinJL6uR1hx7z_Q_lToSoAz8-K9n5Kt-Mmc"
    );

  const sheet =
    spreadsheet.getSheetByName("RSVP") ||
    spreadsheet.insertSheet("RSVP");


  const headers = [
    "Timestamp",
    "Full Name",
    "Phone Number",
    "Family Side",
    "Attending",
    "Number of Guests",
    "Breakfast",
    "Lunch",
    "Message",
  ];


  sheet
    .getRange(
      1,
      1,
      1,
      headers.length
    )
    .setValues([headers]);


  sheet.setFrozenRows(1);
}