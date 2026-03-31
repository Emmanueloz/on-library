import Type from "typebox";

export const SerieId = Type.Object({
    id: Type.String(),
});

export const SerieIdChapters = Type.Intersect([
    SerieId,
    Type.Object({
        chapterNumber: Type.Number(),
    })
]);

export type SerieIdType = Type.Static<typeof SerieId>;
export type SerieIdChaptersType = Type.Static<typeof SerieIdChapters>;