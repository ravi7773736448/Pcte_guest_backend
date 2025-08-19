import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ For navigation

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Save JWT token in localStorage under 'adminToken'
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("isAuthenticated", "true");

      setSuccess("Login successful! Redirecting...");
      console.log("JWT Token:", data.token);

      // ✅ Redirect to Dashboard after 1s
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-[Poppins] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        {/* Logo + Title */}
        <div className="text-center mb-6">
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.8QJtVK0wbirPqNFnD6ebWQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="Logo"
            className="h-16 w-16 mx-auto rounded-md shadow-md"
          />
          <h2 className="text-2xl font-bold mt-4 text-[#9B1C1C]">
            Admin Login
          </h2>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9B1C1C]"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9B1C1C]"
              placeholder="Enter your password"
            />
          </div>

          {/* Error / Success messages */}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-2 rounded-lg shadow-lg hover:scale-105 transition duration-300 disabled:opacity-50"
            style={{ backgroundColor: "#9B1C1C" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Back link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          <a href="/" className="hover:underline" style={{ color: "#9B1C1C" }}>
            ← Back to Home
          </a>
        </p>
      </div>
    </div>
  );
}
