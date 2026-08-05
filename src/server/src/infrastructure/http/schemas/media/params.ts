import Type from "typebox";

export const MediaIdParams = Type.Object({
  mediaId: Type.String(),
});

export type MediaIdParamsType = Type.Static<typeof MediaIdParams>;
