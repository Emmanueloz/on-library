import type { ModulePermission, TypePermission } from "../enums";

type PermissionsPayload = Record<ModulePermission, TypePermission[]>;

export type { PermissionsPayload };
