import Type from "typebox";

export const ChaptersQuerySchema = Type.Object({
  title: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
  number: Type.Optional(Type.Number({ minimum: 0 })),
  idSeries: Type.Optional(Type.String({ minLength: 1 })),
  orderBy: Type.Optional(
    Type.Union([Type.Literal("number"), Type.Literal("createdAt")]),
  ),
  orderType: Type.Optional(
    Type.Union([Type.Literal("asc"), Type.Literal("desc")]),
  ),
});

export type ChaptersQuerySchemaType = Type.Static<typeof ChaptersQuerySchema>;