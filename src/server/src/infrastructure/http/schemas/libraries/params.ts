import Type from "typebox";

export const LibraryId = Type.Object({
    id: Type.String(),
});

export type LibraryIdType = Type.Static<typeof LibraryId>;
