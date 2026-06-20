import { Link } from "react-router";
import { AuthContext } from "../../context/AuthContex";
import { use } from "react";

export function Nav() {
  const authContext = use(AuthContext);

  if (!authContext) {
    throw new Error("AuthButton must be used within a AuthProvider");
  }

  const { isAuthenticated, isEditor } = authContext;

  return (
    <nav className="bg-background px-6 py-4 flex h-14 items-center justify-between border-b border-border">
      <div className="flex items-center gap-4">
        <div className="text-foreground text-xl font-semibold">On Library</div>
        <div className="hidden md:flex gap-6">
          <Link
            to="/"
            className="text-medium-gray hover:text-white transition-opacity duration-200 text-sm font-medium"
          >
            Home
          </Link>

          {isAuthenticated() && (
            <Link
              to="/libraries"
              className="text-medium-gray hover:text-white transition-opacity duration-200 text-sm font-medium"
            >
              Library
            </Link>
          )}
          <Link
            to="/titles"
            className="text-medium-gray hover:text-white transition-opacity duration-200 text-sm font-medium"
          >
            Titles
          </Link>
        </div>
      </div>

      {isAuthenticated() ? (
        <div className="hidden md:flex gap-6">
          {isEditor && (
            <Link
              to="/dashboard"
              className="bg-white/20 text-foreground px-4 py-2 rounded-full hover:bg-white/30 transition-opacity duration-200 text-sm font-medium"
            >
              Dashboard
            </Link>
          )}
          <Link
            to="/auth/profile"
            className="bg-white/20 text-foreground px-4 py-2 rounded-full hover:bg-white/30 transition-opacity duration-200 text-sm font-medium"
          >
            Profile
          </Link>
          <button
            onClick={authContext.logout}
            className="bg-white/20 text-foreground px-4 py-2 rounded-full hover:bg-white/30 transition-opacity duration-200 text-sm font-medium"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="hidden md:flex gap-6">
          <Link
            to="/auth/login"
            className="bg-white/20 text-foreground px-4 py-2 rounded-full hover:bg-white/30 transition-opacity duration-200 text-sm font-medium"
          >
            Login
          </Link>
          <Link
            to="/auth/register"
            className="bg-white/20 text-foreground px-4 py-2 rounded-full hover:bg-white/30 transition-opacity duration-200 text-sm font-medium"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
