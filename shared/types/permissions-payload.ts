import type { ModulePermission, TypePermission } from "../enums/index.ts";

type PermissionsPayload = Partial<Record<ModulePermission, TypePermission[]>>;

export type { PermissionsPayload };
