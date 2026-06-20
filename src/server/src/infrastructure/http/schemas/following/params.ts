import Type from "typebox";

export const SerieId = Type.Object({
  idSerie: Type.String(),
});

export type SerieIdType = Type.Static<typeof SerieId>;