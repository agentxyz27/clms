import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    // Mock login - store token in localStorage
    localStorage.setItem("token", "mock-token-12345");
    setLocation("/"); // Redirect to dashboard
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md space-y-4 rounded-lg border bg-white p-8 shadow">
        <h1 className="text-2xl font-bold">Login</h1>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button onClick={handleLogin} className="w-full">
          Sign In
        </Button>
      </div>
    </div>
  );
}