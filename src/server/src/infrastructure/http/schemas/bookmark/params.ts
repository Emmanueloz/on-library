import Type from "typebox";

export const ChapterId = Type.Object({
  idChapter: Type.String(),
});

export type ChapterIdType = Type.Static<typeof ChapterId>;

export const BookmarkId = Type.Object({
  id: Type.String(),
});

export type BookmarkIdType = Type.Static<typeof BookmarkId>;
