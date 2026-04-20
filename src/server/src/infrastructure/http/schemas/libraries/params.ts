import Type from "typebox";

export const LibraryId = Type.Object({
    id: Type.String(),
});

export type LibraryIdType = Type.Static<typeof LibraryId>;

export const LibraryIdAndSerieId = Type.Intersect([
    LibraryId,
    Type.Object({
        idSerie: Type.String(),
    }),
]);

export type LibraryIdAndSerieIdType = Type.Static<typeof LibraryIdAndSerieId>;