import { Outlet } from "react-router";
import { Drawer } from "../components/common/Drawer";

function Layout() {
  return (
    <div className="flex grow w-screen">
      <Drawer />
      <div className="flex flex-col grow">
        <Outlet />
      </div>
    </div>
  );
}

export { Layout };
