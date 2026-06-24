import { use } from "react";
import { AuthContext } from "../../context/AuthContex";
import { ModulePermission, TypePermission } from "@on-library/shared";

interface PermissionGateProps {
  module: ModulePermission;
  permission: TypePermission;
  children: React.ReactNode;
}

function PermissionGate({ module, permission, children }: PermissionGateProps) {
  const authContext = use(AuthContext);

  if (!authContext) return null;

  if (!authContext.hasSinglePermission(module, permission)) return null;

  return <>{children}</>;
}

export { PermissionGate };
