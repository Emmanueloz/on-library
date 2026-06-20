import Type from "typebox";

export const SerieId = Type.Object({
  idSerie: Type.String(),
});

export const ChapterId = Type.Object({
  idChapter: Type.String(),
});

export const SerieAndChapterId = Type.Intersect([
  SerieId,
  ChapterId,
]);

export type SerieIdType = Type.Static<typeof SerieId>;
export type ChapterIdType = Type.Static<typeof ChapterId>;
export type SerieAndChapterIdType = Type.Static<typeof SerieAndChapterId>;