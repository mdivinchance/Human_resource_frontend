import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simple static login (you can replace with API later)
    if (email === "admin@example.com" && password === "1234567890") {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/");
    } else {
      alert("Invalid email or password!");
    }

    onLogin()
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-vscode-bg text-vscode-text">
      <div className="bg-vscode-bg-light p-8 rounded-lg shadow-vscode w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-vscode-accent">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input w-full"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input w-full"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
