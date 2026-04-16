import { NavLink } from "react-router";

function Drawer() {
  return (
    <div className="flex flex-col h-screen w-1/6 p-2 gap-2">
      <h1>On Library</h1>
      <hr />
      <NavLink to="/">
        <p>Home</p>
      </NavLink>
      <NavLink to="/library">
        <p>Library</p>
      </NavLink>
      <NavLink to="/titles">
        <p>Advanced search</p>
      </NavLink>
      <hr />
      <h2>Dashboard</h2>
      <NavLink to="/dashboard/series">
        <p>Series</p>
      </NavLink>
      <NavLink to="/dashboard/tags">
        <p>Tags</p>
      </NavLink>
      <NavLink to="/dashboard/categories">
        <p>Categories</p>
      </NavLink>
    </div>
  );
}

export { Drawer };
