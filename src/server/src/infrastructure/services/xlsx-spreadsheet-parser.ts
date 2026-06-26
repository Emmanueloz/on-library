import * as XLSX from "xlsx";
import type { ISpreadsheetParserRepo } from "../../application/common/spreadsheet-parser-repo.ts";

function stripBom(buf: Buffer): Buffer {
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    return buf.subarray(3);
  }
  return buf;
}

class XlsxSpreadsheetParser implements ISpreadsheetParserRepo {
  async parseChaptersFromBuffer(
    buffer: Buffer,
  ): Promise<Array<{ title: string; number: number; groupNum?: number | null; groupTitle?: string | null }>> {
    const clean = stripBom(buffer);
    const text = clean.toString("utf-8");
    const workbook = XLSX.read(text, { type: "string", codepage: 65001 });

    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new Error("Empty spreadsheet");
    }

    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      throw new Error("Empty spreadsheet");
    }

    const rows = XLSX.utils.sheet_to_json<{
      title?: string;
      number?: number;
      groupNum?: number;
      groupTitle?: string;
    }>(sheet);

    if (rows.length === 0) {
      throw new Error("Spreadsheet has no data rows");
    }

    const firstRow: Record<string, unknown> = rows[0] ?? {};
    const headers = Object.keys(firstRow).map((h) => h.toLowerCase().trim());
    if (!headers.includes("title") || !headers.includes("number")) {
      throw new Error('Spreadsheet must have "title" and "number" columns');
    }

    const chapters: Array<{ title: string; number: number; groupNum?: number | null; groupTitle?: string | null }> = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i] as Record<string, unknown>;

      const title =
        typeof row.title === "string"
          ? row.title.trim()
          : String(row.title ?? "").trim();
      const number =
        typeof row.number === "number"
          ? row.number
          : parseFloat(String(row.number ?? ""));

      if (!title) {
        throw new Error(`Row ${i + 2}: title is required`);
      }
      if (isNaN(number) || number < 0) {
        throw new Error(`Row ${i + 2}: number must be a positive number`);
      }

      const rawGroupNum = typeof row.groupNum === "number"
        ? row.groupNum
        : parseFloat(String(row.groupNum ?? ""));
      const groupNum = !isNaN(rawGroupNum) ? rawGroupNum : null;

      const rawGroupTitle = typeof row.groupTitle === "string"
        ? row.groupTitle.trim()
        : String(row.groupTitle ?? "").trim();
      const groupTitle = rawGroupTitle !== "" ? rawGroupTitle : null;

      chapters.push({ title, number, groupNum, groupTitle });
    }

    return chapters;
  }
}

export { XlsxSpreadsheetParser };
