import Type from "typebox";

export const CategoryId = Type.Object({
    id: Type.String(),
});

export type CategoryIdType = Type.Static<typeof CategoryId>;
