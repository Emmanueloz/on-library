import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router";

function Register() {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    errorRegister,
    register,
    isLoadingRegister,
  } = useAuth();

  const [isSuccessful, setIsSuccessful] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const isSuccessful = await register();
    setIsSuccessful(isSuccessful);
  };

  if (isSuccessful) {
    return <Navigate to="/" />;
  }

  return (
    <section className="flex flex-col gap-5 items-center m-5 w-full md:w-3/5 md lg:w-2/5 p-6 py-5 rounded-xl bg-surface">
      <h1 className="text-2xl font-bold text-primary">Register</h1>
      {errorRegister && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
          {errorRegister}
        </div>
      )}
      <form className="flex flex-col gap-6 w-full">
        <label htmlFor="username" className="space-y-1">
          <span className="text-xs font-medium text-medium-gray block">
            Username
          </span>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-background border  rounded px-3 py-2 text-sm  focus:outline-none "
          />
        </label>
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
          disabled={isLoadingRegister}
          onClick={handleRegister}
        >
          {isLoadingRegister ? "Logging in..." : "Register"}
        </button>
      </form>
    </section>
  );
}

export { Register };
