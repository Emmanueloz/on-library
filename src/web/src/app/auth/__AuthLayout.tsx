import { Outlet } from "react-router";

function AuthLayout() {
  return (
    <section className="flex w-full h-full items-center justify-center">
      <Outlet />
    </section>
  );
}

export { AuthLayout };
