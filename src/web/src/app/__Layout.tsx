import { Outlet } from "react-router";
import { Nav } from "../components/common/Nav";

function Layout() {
  return (
    <div
      className="grid h-dvh"
      style={{
        gridTemplateAreas: '"nav" "main"',
        gridTemplateRows: "auto 1fr",
      }}
    >
      <Nav />
      <main className="min-h-0 overflow-y-auto" style={{ gridArea: "main" }}>
        <Outlet />
      </main>
    </div>
  );
}

export { Layout };
