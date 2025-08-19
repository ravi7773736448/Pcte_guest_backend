import React, { useEffect, useState } from "react";
import axios from "axios";

// --- Lecture Card ---
function LectureCard({ lecture, onLike, onView }) {
  const imageUrl = lecture.banner
    ? `http://localhost:5000/uploads/${lecture.banner}`
    : "https://via.placeholder.com/400x200?text=No+Image";

  return (
    <div className="lecture-card bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col">
      {/* 1. Image */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={lecture.topic}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        {/* 2. Title */}
        <h3 className="text-lg font-bold text-[#9B1C1C] mb-2">{lecture.topic}</h3>

        {/* 3. Date */}
        <p className="text-gray-800 mb-1">
          <span className="font-semibold">Date:</span> {lecture.date || "N/A"}
        </p>

        {/* 4. Time */}
        <p className="text-gray-800 mb-3">
          <span className="font-semibold">Time:</span> {lecture.time || "N/A"}
        </p>

        {/* Optional Fields */}
        <p className="text-gray-800 mb-1">
          <span className="font-semibold">Resource Person:</span>{" "}
          {lecture.resourcePerson || "N/A"}
        </p>

        <p className="text-gray-800 mb-1">
          <span className="font-semibold">Class:</span> {lecture.class || "N/A"}
        </p>

        <p className="text-gray-800 mb-1">
          <span className="font-semibold">Venue:</span> {lecture.venue || "N/A"}
        </p>

        <div className="flex gap-3 mt-auto">
          <button
            onClick={onLike}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 font-medium rounded hover:bg-red-200"
          >
            ❤️ Like
          </button>

          <button
            onClick={onView}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            📄 View Details
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---
export default function StudentDashboard() {
  const [lectures, setLectures] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedLecture, setSelectedLecture] = useState(null);

  const student = JSON.parse(localStorage.getItem("student"));

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/lectures");
        setLectures(res.data);
      } catch (error) {
        console.error("Error fetching lectures:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, []);

  // ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedLecture(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!student) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">
          No student info found. Please login first.
        </h2>
      </div>
    );
  }

  const filteredLectures = lectures.filter((lecture) => {
    const q = searchQuery.toLowerCase();
    return (
      lecture.topic?.toLowerCase().includes(q) ||
      lecture.resourcePerson?.toLowerCase().includes(q) ||
      lecture.venue?.toLowerCase().includes(q) ||
      lecture.class?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 font-[Poppins] max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="mt-4 md:mt-0 w-full md:w-96">
          <input
            type="text"
            placeholder="Search lectures..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-semibold mb-6 text-[#9B1C1C]">Guest Lectures</h2>

      {/* Lectures */}
      {loading ? (
        <p className="text-gray-600">Loading lectures...</p>
      ) : filteredLectures.length === 0 ? (
        <p className="text-gray-600">No lectures found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLectures.map((lecture, index) => (
            <LectureCard
              key={index}
              lecture={lecture}
              onLike={() => alert(`You liked "${lecture.topic}"!`)}
              onView={() => setSelectedLecture(lecture)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedLecture && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 lecture-modal bg-black bg-opacity-30"
          onClick={() => setSelectedLecture(null)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl relative border border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-3 text-gray-500 text-xl hover:text-black"
              onClick={() => setSelectedLecture(null)}
            >
              ✖
            </button>

            {/* 2. Title */}
            <h3 className="text-2xl font-bold text-[#9B1C1C] mb-4">
              {selectedLecture.topic}
            </h3>

            {/* 1. Image */}
            {selectedLecture.banner && (
              <img
                src={`http://localhost:5000/uploads/${selectedLecture.banner}`}
                alt="Lecture Banner"
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}

            <div className="space-y-2 text-sm text-gray-800">
              {/* 3. Date */}
              <p><strong>Date:</strong> {selectedLecture.date || "N/A"}</p>

              {/* 4. Time */}
              <p><strong>Time:</strong> {selectedLecture.time || "N/A"}</p>

              {/* Optional Fields */}
              <p><strong>Resource Person:</strong> {selectedLecture.resourcePerson || "N/A"}</p>
              <p><strong>Teacher:</strong> {selectedLecture.teacher || "N/A"}</p>
              <p><strong>Class:</strong> {selectedLecture.class || "N/A"}</p>
              <p><strong>Venue:</strong> {selectedLecture.venue || "N/A"}</p>
              <p><strong>Description:</strong> {selectedLecture.description || "No description available."}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
