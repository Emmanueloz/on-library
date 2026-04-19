import Type from "typebox";

export const CreateLibraryBody = Type.Object({
  name: Type.String(),
  isPublic: Type.Optional(Type.Boolean()),
});

export type CreateLibraryBodyType = Type.Static<typeof CreateLibraryBody>;

export const UpdateLibraryBody = Type.Object({
  name: Type.Optional(Type.String()),
  isPublic: Type.Optional(Type.Boolean()),
});

export type UpdateLibraryBodyType = Type.Static<typeof UpdateLibraryBody>;

export const AddSeriesBody = Type.Object({
  idSerie: Type.String(),
});

export type AddSeriesBodyType = Type.Static<typeof AddSeriesBody>;