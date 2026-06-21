import Type from "typebox";

export const CreateChapterBodySchema = Type.Object({
  title: Type.String({ minLength: 2, maxLength: 200 }),
  number: Type.Number({ minimum: 0 }),
  idSeries: Type.String(),
});

export type CreateChapterBody = Type.Static<typeof CreateChapterBodySchema>;

export const UpdateChapterBodySchema = Type.Object({
  title: Type.String({ minLength: 2, maxLength: 200 }),
  number: Type.Optional(Type.Number({ minimum: 0 })),
  //idSeries: Type.String(),
});

export type UpdateChapterBody = Type.Static<typeof UpdateChapterBodySchema>;
