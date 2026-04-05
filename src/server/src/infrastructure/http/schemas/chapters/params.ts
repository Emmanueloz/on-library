import Type from "typebox";

export const ChapterIdParams = Type.Object({
  id: Type.String(),
});

export type ChapterIdParamsType = Type.Static<typeof ChapterIdParams>;