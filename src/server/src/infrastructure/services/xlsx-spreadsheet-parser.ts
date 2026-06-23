import * as XLSX from "xlsx";
import type { ISpreadsheetParserRepo } from "../../application/common/spreadsheet-parser-repo.ts";

class XlsxSpreadsheetParser implements ISpreadsheetParserRepo {
  async parseChaptersFromBuffer(
    buffer: Buffer,
  ): Promise<Array<{ title: string; number: number }>> {
    const workbook = XLSX.read(buffer, { type: "buffer" });

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
    }>(sheet);

    if (rows.length === 0) {
      throw new Error("Spreadsheet has no data rows");
    }

    const firstRow: Record<string, unknown> = rows[0] ?? {};
    const headers = Object.keys(firstRow).map((h) => h.toLowerCase().trim());
    if (!headers.includes("title") || !headers.includes("number")) {
      throw new Error('Spreadsheet must have "title" and "number" columns');
    }

    const chapters: Array<{ title: string; number: number }> = [];
    const seenNumbers = new Set<number>();

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
      if (isNaN(number) || number <= 0) {
        throw new Error(`Row ${i + 2}: number must be a positive number`);
      }
      if (seenNumbers.has(number)) {
        throw new Error(`Row ${i + 2}: duplicate chapter number ${number}`);
      }

      seenNumbers.add(number);
      chapters.push({ title, number });
    }

    return chapters;
  }
}

export { XlsxSpreadsheetParser };
