import { useState } from "react";
import { Link, useLocation } from "react-router";

function Drawer() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "◫" },
    { path: "/dashboard/content", label: "Content", icon: "☰" },
    { path: "/dashboard/tags", label: "Tags", icon: "🏷" },
    { path: "/dashboard/categories", label: "Categories", icon: "◩" },
  ];

  return (
    <div className={`${collapsed ? "w-16" : "w-64"} bg-surface border-r border-border flex flex-col transition-all duration-300 shrink-0`}>
      <div className="p-4 flex items-center justify-between">
        {!collapsed && (
          <h2 className="text-lg font-semibold text-foreground">Admin</h2>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 text-dim-gray hover:text-white transition-colors"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>
      
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded transition-all ${
                  isActive(item.path) 
                    ? "bg-primary/10 text-primary border-l-2 border-primary" 
                    : "text-medium-gray hover:text-white hover:bg-stone-800"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export { Drawer };