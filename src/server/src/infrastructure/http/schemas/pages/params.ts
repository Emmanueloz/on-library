import Type from "typebox";

export const PageIdParams = Type.Object({
  pageId: Type.String(),
});

export type PageIdParamsType = Type.Static<typeof PageIdParams>;
