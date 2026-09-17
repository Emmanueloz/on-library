import Type from "typebox";
import { MediaType } from "@on-library/shared";

export const CreateBookmarkBody = Type.Object({
  idChapter: Type.String(),
  type: Type.Enum(MediaType),
  page: Type.Number(),
});

export type CreateBookmarkBodyType = Type.Static<typeof CreateBookmarkBody>;
