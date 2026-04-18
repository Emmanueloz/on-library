import { Outlet } from "react-router";
import { Nav } from "../components/common/Nav";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="grow">
        <Outlet />
      </main>
    </div>
  );
}

export { Layout };