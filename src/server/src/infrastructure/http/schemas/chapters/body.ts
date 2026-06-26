import Type from "typebox";

export const CreateChapterBodySchema = Type.Object({
  title: Type.String({ minLength: 2, maxLength: 200 }),
  number: Type.Number({ minimum: 0 }),
  idSeries: Type.String(),
  groupNum: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  groupTitle: Type.Optional(Type.Union([Type.String({ maxLength: 100 }), Type.Null()])),
});

export type CreateChapterBody = Type.Static<typeof CreateChapterBodySchema>;

export const UpdateChapterBodySchema = Type.Object({
  title: Type.String({ minLength: 2, maxLength: 200 }),
  number: Type.Optional(Type.Number({ minimum: 0 })),
  groupNum: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  groupTitle: Type.Optional(Type.Union([Type.String({ maxLength: 100 }), Type.Null()])),
});

export type UpdateChapterBody = Type.Static<typeof UpdateChapterBodySchema>;
