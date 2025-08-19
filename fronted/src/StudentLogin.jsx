import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentLogin() {
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save student data to localStorage
      localStorage.setItem("student", JSON.stringify(data.student));
      localStorage.setItem("role", "student");

      navigate("/student-dashboard");
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
            Student Login
          </h2>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Roll Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Roll Number
            </label>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9B1C1C]"
              placeholder="Enter your roll number"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9B1C1C]"
              placeholder="Enter your name"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-2 rounded-lg shadow-lg hover:scale-105 transition duration-300 disabled:opacity-50"
            style={{ backgroundColor: "#9B1C1C" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Back to Home */}
        <p className="text-center text-sm text-gray-600 mt-4">
          <a href="/" className="hover:underline" style={{ color: "#9B1C1C" }}>
            ← Back to Home
          </a>
        </p>
      </div>
    </div>
  );
}
