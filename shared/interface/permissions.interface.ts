export interface IPermissions {
  id?: string;
  name: string;
  type: "READ" | "WRITE" | "DELETE";
}