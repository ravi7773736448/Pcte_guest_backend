import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminLectureRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get admin JWT token from localStorage (adjust if you use a context or different storage)
  const token = localStorage.getItem("adminToken");

  // Fetch all lecture requests
  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/api/lecture-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      setError("Failed to fetch requests.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Approve or Reject a lecture request
  const handleDecision = async (id, decision) => {
    // Confirm admin wants to proceed
    if (!window.confirm(`Are you sure you want to ${decision} this request?`)) return;

    // Optional: get admin comments
    const adminComments = window.prompt("Add any comments (optional):") || "";

    try {
      await axios.put(
        `http://localhost:5000/api/lecture-requests/${id}/${decision}`,
        { adminComments },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh list after decision
      fetchRequests();
    } catch (err) {
      alert("Failed to update request status.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Lecture Requests Approval</h2>

      {loading && <p>Loading requests...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && requests.length === 0 && (
        <p>No lecture requests found.</p>
      )}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Student Roll Number</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Lecture Title</th>
            <th className="border p-2">Lecture Date</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Admin Comments</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id} className="hover:bg-gray-50">
              <td className="border p-2">{req.studentRollNumber}</td>
              <td className="border p-2">{req.type}</td>
              <td className="border p-2">{req.lectureTitle}</td>
              <td className="border p-2">
                {new Date(req.lectureDate).toLocaleString()}
              </td>
              <td className="border p-2">{req.description}</td>
              <td
                className={`border p-2 font-semibold ${
                  req.status === "approved"
                    ? "text-green-600"
                    : req.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {req.status}
              </td>
              <td className="border p-2">{req.adminComments || "-"}</td>
              <td className="border p-2 text-center space-x-2">
                {req.status === "pending" ? (
                  <>
                    <button
                      onClick={() => handleDecision(req._id, "approve")}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecision(req._id, "reject")}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
