import { useState, useEffect } from "react";

type User = {
  firstName: string;
  lastName: string;
  email: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    setIsAuthenticated(!!token);
    setUser(savedUser ? JSON.parse(savedUser) : null);
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = "/login";
  };

  return { isAuthenticated, isLoading, user, logout };
}