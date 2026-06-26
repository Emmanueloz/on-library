interface ISpreadsheetParserRepo {
  parseChaptersFromBuffer(
    buffer: Buffer,
  ): Promise<Array<{ title: string; number: number; groupNum?: number | null; groupTitle?: string | null }>>;
}

export type { ISpreadsheetParserRepo };
