import { Outlet } from "react-router";
import { Drawer } from "../../components/Dashboard/Drawer";

function DashboardLayout() {
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