import { Navigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    errorLogin,
    login,
    isLoadingLogin,
  } = useAuth();

  const [isSuccessful, setIsSuccessful] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const isSuccessful = await login();
    setIsSuccessful(isSuccessful);
  };

  if (isSuccessful) {
    return <Navigate to="/" />;
  }

  return (
    <section className="flex flex-col gap-5 items-center m-5 w-full md:w-3/5 md lg:w-2/5 p-6 py-5 rounded-xl bg-surface">
      <h1 className="text-2xl font-bold text-primary">Login</h1>
      {errorLogin && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
          {errorLogin}
        </div>
      )}
      <form className="flex flex-col gap-6 w-full">
        <label htmlFor="email" className="space-y-1">
          <span className="text-xs font-medium text-medium-gray block">
            Email
          </span>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-background border  rounded px-3 py-2 text-sm  focus:outline-none "
          />
        </label>
        <label htmlFor="password" className="space-y-1">
          <span className="text-xs font-medium text-medium-gray block">
            Password
          </span>
          <input
            type="text"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-background border  rounded px-3 py-2 text-sm  focus:outline-none "
          />
        </label>
        <button
          type="button"
          className="w-full bg-primary text-white py-3 text-sm font-semibold rounded hover:brightness-110 transition-all disabled:opacity-50"
          disabled={isLoadingLogin}
          onClick={handleLogin}
        >
          {isLoadingLogin ? "Logging in..." : "Login"}
        </button>
      </form>
    </section>
  );
}

export { Login };
