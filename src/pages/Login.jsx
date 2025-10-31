import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/signin", {
        username,
        password,
      });

      const { accessToken, email, roles } = res.data;

      // Save token and user info
      localStorage.setItem("token", accessToken); // ✅ Correct key
      localStorage.setItem("userEmail", email || username);
      localStorage.setItem("roles", JSON.stringify(roles || []));
      localStorage.setItem("isLoggedIn", "true");

      toast.success("✅ Login successful!");
      onLogin();
      navigate("/"); // redirect to dashboard/home
    } catch (error) {
      console.error("Login error:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "❌ Invalid username or password!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white p-2 rounded ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-500 text-center">
          Test Login: <strong>hradmin@unilac.ac.rw / 12345678</strong>
        </p>
      </div>
    </div>
  );
};

export default Login;
