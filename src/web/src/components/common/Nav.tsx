import { Link } from "react-router";

export function Nav() {
  return (
    <nav className="bg-background px-6 py-4 flex items-center justify-between border-b border-border">
      <div className="flex items-center gap-4">
        <div className="text-foreground text-xl font-semibold">On Library</div>
        <div className="hidden md:flex gap-6">
          <Link
            to="/"
            className="text-medium-gray hover:text-white transition-opacity duration-200 text-sm font-medium"
          >
            Home
          </Link>
          <Link
            to="/library"
            className="text-medium-gray hover:text-white transition-opacity duration-200 text-sm font-medium"
          >
            Library
          </Link>
          <Link
            to="/titles"
            className="text-medium-gray hover:text-white transition-opacity duration-200 text-sm font-medium"
          >
            Titles
          </Link>
        </div>
      </div>
      <div className="hidden md:flex gap-6">
        <Link
          to="/dashboard"
          className="bg-white/20 text-foreground px-4 py-2 rounded-full hover:bg-white/30 transition-opacity duration-200 text-sm font-medium"
        >
          Dashboard
        </Link>
        <Link
          to="/auth/profile"
          className="bg-white/20 text-foreground px-4 py-2 rounded-full hover:bg-white/30 transition-opacity duration-200 text-sm font-medium"
        >
          Profile
        </Link>
      </div>
    </nav>
  );
}
