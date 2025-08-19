import React, { useState } from "react";
import axios from "axios";

export default function RequestLecture() {
  const [form, setForm] = useState({
    type: "add", // "add" or "edit"
    lectureTitle: "",
    lectureDate: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit lecture request
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.lectureTitle || !form.lectureDate || !form.description) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // Get logged-in student's roll number or ID (adjust according to your auth)
      const studentRollNumber = localStorage.getItem("studentRollNumber"); 
      if (!studentRollNumber) {
        setMessage("Student not logged in!");
        setLoading(false);
        return;
      }

      // POST request to backend API to create a lecture request
      const response = await axios.post("http://localhost:5000/api/lecture-requests", {
        studentRollNumber,   // backend uses this to identify student
        type: form.type,
        lectureTitle: form.lectureTitle,
        lectureDate: form.lectureDate,
        description: form.description,
      });

      if (response.status === 201) {
        setMessage("Request submitted successfully! Waiting for admin approval.");
        setForm({
          type: "add",
          lectureTitle: "",
          lectureDate: "",
          description: "",
        });
      }
    } catch (error) {
      setMessage("Error submitting request. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border border-gray-300 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Request to Add/Edit Lecture</h2>
      {message && (
        <p
          className={`mb-4 ${
            message.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">Type of Request</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        >
          <option value="add">Add Lecture</option>
          <option value="edit">Edit Lecture</option>
        </select>

        <label className="block mb-2 font-medium">Lecture Title</label>
        <input
          type="text"
          name="lectureTitle"
          value={form.lectureTitle}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Enter lecture title"
          required
        />

        <label className="block mb-2 font-medium">Lecture Date & Time</label>
        <input
          type="datetime-local"
          name="lectureDate"
          value={form.lectureDate}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <label className="block mb-2 font-medium">Description / Notes</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Add any details for the request"
          required
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
