import {
  ModulePermission,
  TypePermission,
  type IUserPayload,
} from "@on-library/shared";
import { createContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface AuthContextType {
  user: IUserPayload | null;
  token: string | null;
  setUser: (user: IUserPayload) => void;
  setToken: (token: string) => void;
  isAuthenticated: () => boolean;
  hasSinglePermission: (
    module: ModulePermission,
    permission: TypePermission | TypePermission[],
  ) => boolean;
  hasAllPermissions: (
    module: ModulePermission,
    requiredPermissions: TypePermission[],
  ) => boolean;
  logout: () => void;
  isEditor: boolean;
}
const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUserPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  const [storedUser, setStoredUser] = useLocalStorage<IUserPayload | null>(
    "auth_user",
    null,
  );
  const [storedToken, setStoredToken] = useLocalStorage<string | null>(
    "auth_token",
    null,
  );

  const loadAuthFromStorage = () => {
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
  };

  // Load auth state from localStorage on initial render
  useState(() => {
    loadAuthFromStorage();
  });

  const logout = () => {
    setUser(null);
    setToken(null);
    setStoredUser(null);
    setStoredToken(null);
  };

  const hasSinglePermission = (
    module: ModulePermission,
    permission: TypePermission | TypePermission[],
  ): boolean => {
    // 1. Obtenemos los permisos del usuario para ese módulo
    const modulePermissions = user?.permissions?.[module];

    // 2. Si el usuario no tiene permisos en ese módulo, es false de inmediato
    if (!modulePermissions) return false;

    // 3. Normalizamos la entrada: si no es un array, lo metemos en uno
    const permissionsToCheck = Array.isArray(permission)
      ? permission
      : [permission];

    // 4. Usamos .some() para el comportamiento "OR"
    // Retorna true si al menos uno de los permisos requeridos está en el módulo
    return permissionsToCheck.some((p) => modulePermissions.includes(p));
  };

  const hasAllPermissions = (
    module: ModulePermission,
    requiredPermissions: TypePermission[],
  ): boolean => {
    const modulePermissions = user?.permissions[module];

    if (!modulePermissions) return false;

    return requiredPermissions.every((perm) =>
      modulePermissions.includes(perm),
    );
  };

  // Esta constante será true si el usuario tiene permisos de edición/borrado
  // en cualquiera de los módulos de gestión de contenido.
  const canAccessDashboard = (): boolean => {
    if (!user?.permissions) return false;

    const managementModules: ModulePermission[] = [
      ModulePermission.Series,
      ModulePermission.Categories,
      ModulePermission.Tags,
    ];

    const privilegedTypes: TypePermission[] = [
      TypePermission.Write,
      TypePermission.Delete,
    ];

    return managementModules.some((module) => {
      const userPerms = user.permissions[module] || [];

      return userPerms.some((p) => privilegedTypes.includes(p));
    });
  };

  const isEditor = canAccessDashboard();

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setUser,
        setToken,
        isAuthenticated,
        logout,
        hasSinglePermission,
        hasAllPermissions,
        isEditor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
