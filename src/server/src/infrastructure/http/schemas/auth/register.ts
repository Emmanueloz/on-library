import Type from "typebox";

const RegisterSchema = Type.Object({
  username: Type.String(),
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 6 }),
});

type RegisterType = Type.Static<typeof RegisterSchema>;

export { RegisterSchema, type RegisterType };
