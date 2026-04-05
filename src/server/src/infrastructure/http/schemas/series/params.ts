import Type from "typebox";

export const SerieId = Type.Object({
  id: Type.String(),
});

export type SerieIdType = Type.Static<typeof SerieId>;