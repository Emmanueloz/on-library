import Type from "typebox";

export const TagId = Type.Object({
    id: Type.String(),
});

export type TagIdType = Type.Static<typeof TagId>;
