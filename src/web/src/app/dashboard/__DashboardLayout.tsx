import { Outlet, Navigate } from "react-router";
import { Drawer } from "../../components/Dashboard/Drawer";
import { use } from "react";
import { AuthContext } from "../../context/AuthContex";

function DashboardLayout() {
  const authContext = use(AuthContext);

  if (!authContext) {
    throw new Error("AuthButton must be used within a AuthProvider");
  }

  const { isAuthenticated } = authContext;

  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <div className="flex h-[calc(100vh-56px)]">
      <Drawer />
      <section className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </section>
    </div>
  );
}

export { DashboardLayout };
