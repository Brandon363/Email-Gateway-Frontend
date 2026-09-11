export class BirthCertificateParser {

  private static ORDINAL_WORDS: { [key: string]: number } = {
    "FIRST": 1, "1ST": 1,
    "SECOND": 2, "2ND": 2,
    "THIRD": 3, "3RD": 3,
    "FOURTH": 4, "4TH": 4,
    "FIFTH": 5, "5TH": 5,
    "SIXTH": 6, "6TH": 6,
    "SEVENTH": 7, "7TH": 7,
    "EIGHTH": 8, "8TH": 8,
    "NINTH": 9, "9TH": 9,
    "TENTH": 10, "10TH": 10,
    "ELEVENTH": 11, "11TH": 11,
    "TWELFTH": 12, "12TH": 12,
    "THIRTEENTH": 13, "13TH": 13,
    "FOURTEENTH": 14, "14TH": 14,
    "FIFTEENTH": 15, "15TH": 15,
    "SIXTEENTH": 16, "16TH": 16,
    "SEVENTEENTH": 17, "17TH": 17,
    "EIGHTEENTH": 18, "18TH": 18,
    "NINETEENTH": 19, "19TH": 19,
    "TWENTIETH": 20, "20TH": 20,
    "TWENTY-FIRST": 21, "TWENTY FIRST": 21, "21ST": 21,
    "TWENTY-SECOND": 22, "TWENTY SECOND": 22, "22ND": 22,
    "TWENTY-THIRD": 23, "TWENTY THIRD": 23, "23RD": 23,
    "TWENTY-FOURTH": 24, "TWENTY FOURTH": 24, "24TH": 24,
    "TWENTY-FIFTH": 25, "TWENTY FIFTH": 25, "25TH": 25,
    "TWENTY-SIXTH": 26, "TWENTY SIXTH": 26, "26TH": 26,
    "TWENTY-SEVENTH": 27, "TWENTY SEVENTH": 27, "27TH": 27,
    "TWENTY-EIGHTH": 28, "TWENTY EIGHTH": 28, "28TH": 28,
    "TWENTY-NINTH": 29, "TWENTY NINTH": 29, "29TH": 29,
    "THIRTIETH": 30, "30TH": 30,
    "THIRTY-FIRST": 31, "THIRTY FIRST": 31, "31ST": 31,
  };

  private static MONTHS_MAP: { [key: string]: number } = {
    "JANUARY": 1, "JAN": 1,
    "FEBRUARY": 2, "FEB": 2,
    "MARCH": 3, "MAR": 3,
    "APRIL": 4, "APR": 4,
    "MAY": 5,
    "JUNE": 6, "JUN": 6,
    "JULY": 7, "JUL": 7,
    "AUGUST": 8, "AUG": 8,
    "SEPTEMBER": 9, "SEP": 9, "SEPT": 9,
    "OCTOBER": 10, "OCT": 10,
    "NOVEMBER": 11, "NOV": 11,
    "DECEMBER": 12, "DEC": 12,
  };

  private static NUMBER_WORDS: { [key: string]: number } = {
    "ZERO": 0, "ONE": 1, "TWO": 2, "THREE": 3, "FOUR": 4, "FIVE": 5,
    "SIX": 6, "SEVEN": 7, "EIGHT": 8, "NINE": 9, "TEN": 10,
    "ELEVEN": 11, "TWELVE": 12, "THIRTEEN": 13, "FOURTEEN": 14,
    "FIFTEEN": 15, "SIXTEEN": 16, "SEVENTEEN": 17, "EIGHTEEN": 18,
    "NINETEEN": 19, "TWENTY": 20, "THIRTY": 30, "FORTY": 40,
    "FIFTY": 50, "SIXTY": 60, "SEVENTY": 70, "EIGHTY": 80,
    "NINETY": 90, "HUNDRED": 100, "THOUSAND": 1000
  };

  /**
   * Parses raw extracted date text (e.g. "SEVENTEENTH DAY OF SEPTEMBER TWO THOUSAND AND THIRTEEN")
   * into clean ISO format "YYYY-MM-DD".
   */
  public static parseDate(text?: string | null): string | null {
    if (!text) return null;
    const str = text.trim();
    if (!str) return null;

    // Check if already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      return str;
    }

    const upper = str.toUpperCase().replace(/,/g, " ").replace(/\s+/g, " ").trim();

    // Find month
    let monthVal: number | null = null;
    let monthName: string | null = null;
    for (const [mName, mVal] of Object.entries(BirthCertificateParser.MONTHS_MAP)) {
      const regex = new RegExp(`\\b${mName}\\b`);
      if (regex.test(upper)) {
        monthVal = mVal;
        monthName = mName;
        break;
      }
    }

    if (!monthVal || !monthName) return null;

    const parts = upper.split(monthName);
    const beforeMonth = parts[0];
    const afterMonth = parts.length > 1 ? parts[1] : "";

    // Find day
    let dayVal: number | null = null;
    const sortedOrdinals = Object.entries(BirthCertificateParser.ORDINAL_WORDS).sort((a, b) => b[0].length - a[0].length);
    for (const [ordStr, dVal] of sortedOrdinals) {
      if (beforeMonth.includes(ordStr) || beforeMonth.includes(ordStr.replace(/-/g, " "))) {
        dayVal = dVal;
        break;
      }
    }

    if (dayVal === null) {
      const dayMatch = beforeMonth.match(/\b([1-9]|[12]\d|3[01])(?:ST|ND|RD|TH)?\b/);
      if (dayMatch) {
        dayVal = parseInt(dayMatch[1], 10);
      }
    }

    if (dayVal === null) return null;

    // Find year
    const yearVal = BirthCertificateParser.parseWordYear(afterMonth) || BirthCertificateParser.parseWordYear(upper);
    if (!yearVal) return null;

    const mm = monthVal.toString().padStart(2, "0");
    const dd = dayVal.toString().padStart(2, "0");
    return `${yearVal}-${mm}-${dd}`;
  }

  private static parseWordYear(text: string): number | null {
    const yearMatch = text.match(/\b(19\d\d|20\d\d)\b/);
    if (yearMatch) {
      return parseInt(yearMatch[1], 10);
    }

    const cleanText = text.toUpperCase().replace(/-/g, " ");
    const tokens = cleanText.split(/\s+/).filter(t => t in BirthCertificateParser.NUMBER_WORDS || t === "AND");
    if (!tokens.length) return null;

    const vals = tokens.filter(t => t in BirthCertificateParser.NUMBER_WORDS).map(t => BirthCertificateParser.NUMBER_WORDS[t]);
    if (!vals.length) return null;

    if (vals.includes(1000)) {
      const thousandIdx = vals.indexOf(1000);
      const thousands = thousandIdx > 0 ? vals.slice(0, thousandIdx).reduce((a, b) => a + b, 0) : 1;
      const rest = vals.slice(thousandIdx + 1).reduce((a, b) => a + b, 0);
      const year = thousands * 1000 + rest;
      if (year >= 1900 && year <= 2100) return year;
    }

    if (vals.length >= 2 && vals[0] >= 10 && vals[0] <= 20) {
      const century = vals[0] * 100;
      const rest = vals.slice(1).reduce((a, b) => a + b, 0);
      const year = century + rest;
      if (year >= 1900 && year <= 2100) return year;
    }

    const total = vals.reduce((a, b) => a + b, 0);
    if (total >= 1900 && total <= 2100) return total;

    return null;
  }

  /**
   * Parses raw extracted sex text (e.g. "M", "BOY", "MALE", "FEMALE", "GIRL")
   * into standardized "Male" or "Female".
   */
  public static parseSex(text?: string | null): string | null {
    if (!text) return null;
    const clean = text.trim().toUpperCase();

    if (clean === "MALE") return "Male";
    if (clean === "FEMALE") return "Female";

    // Female matches (e.g. Female, Femal, Femala, Girl, F)
    if (/^(FEM|FEMAL|FEMALA|FEMAIE|GIRL|DAUGHTER|WOMAN|F)$/.test(clean) || clean.startsWith("FEM")) {
      return "Female";
    }

    // Male matches & OCR typos (e.g. Male, Malo, Mal, Mael, Boy, M)
    if (/^(MAL|MALE|MALO|MAEL|MAIE|MILE|BOY|SON|MAN|M)$/.test(clean) || clean.startsWith("MAL")) {
      return "Male";
    }

    if (/\b(FEMALE|FEMAL|GIRL|DAUGHTER|WOMAN)\b/.test(clean)) {
      return "Female";
    }

    if (/\b(MALE|MALO|BOY|SON|MAN)\b/.test(clean)) {
      return "Male";
    }

    return null;
  }
}
