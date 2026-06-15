import { Link } from "react-router";

function PrimaryLink({
  to,
  children,
}: {
  to: string;
  children?: React.ReactNode;
}) {
  return (
    <Link
      className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded hover:brightness-50 transition-all"
      to={to}
    >
      {children}
    </Link>
  );
}

export { PrimaryLink };
