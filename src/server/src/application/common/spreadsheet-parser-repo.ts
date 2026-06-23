interface ISpreadsheetParserRepo {
  parseChaptersFromBuffer(
    buffer: Buffer,
  ): Promise<Array<{ title: string; number: number }>>;
}

export type { ISpreadsheetParserRepo };
