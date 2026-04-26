import { use, useState } from "react";
import { AuthContext } from "../context/AuthContex";
import { configEnv } from "../config";
import { useLocalStorage } from "./useLocalStorage";
import { buildAuthHeaders } from "../utils/buildAuthHeaders";

const useAuth = () => {
  const authContext = use(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  const { setUser, setToken, token, isAuthenticated } = authContext;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState<string | null>(null);
  const [isLoadingLogin, setIsLoadingLogin] = useState<boolean>(false);
  const [isLoadingRegister, setIsLoadingRegister] = useState<boolean>(false);
  const [errorRegister, setErrorRegister] = useState<string | null>(null);

  const [, setStoredUser] = useLocalStorage("auth_user", null);
  const [, setStoredToken] = useLocalStorage("auth_token", null);

  const login = async () => {
    try {
      setIsLoadingLogin(true);
      const headers = buildAuthHeaders(token, isAuthenticated());
      const response = await fetch(`${configEnv.apiUrl}/api/auth/login`, {
        method: "POST",
        headers,
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        setUser(data.user);
        setToken(data.token);
        setStoredUser(data.user);
        setStoredToken(data.token);
        return true;
      }
      const errorData = await response.json();
      setErrorLogin(errorData.message || "Login failed");
      return false;
    } catch (err) {
      console.error(err);
      setErrorLogin("An unexpected error occurred");
      return false;
    } finally {
      setIsLoadingLogin(false);
    }
  };

  const register = async () => {
    try {
      setIsLoadingRegister(true);
      const headers = buildAuthHeaders(token, isAuthenticated());
      const response = await fetch(`${configEnv.apiUrl}/api/auth/register`, {
        method: "POST",
        headers,
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(data.token);

        setStoredUser(data.user);
        setStoredToken(data.token);
        return true;
      }
      const errorData = await response.json();
      setErrorRegister(errorData.message || "Registration failed");
      return false;
    } catch (err) {
      console.error(err);
      setErrorRegister("An unexpected error occurred");
      return false;
    } finally {
      setIsLoadingRegister(false);
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    errorLogin,
    errorRegister,
    isLoadingLogin,
    isLoadingRegister,
    login,
    register,
  };
};

export { useAuth };
