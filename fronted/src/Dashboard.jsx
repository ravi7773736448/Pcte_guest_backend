import React, { useState, useEffect, useMemo } from "react";
import { FaTrash, FaTimes, FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

// Utility to format ISO date strings to readable format
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// --- Lecture Detail Modal WITHOUT backdrop ---
function LectureDetailModal({ lecture, onClose }) {
  if (!lecture) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl"
          aria-label="Close details"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-4">{lecture.topic || "N/A"}</h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Banner Image */}
          <div className="flex-shrink-0 w-full md:w-1/3 h-48 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
            {lecture.banner ? (
              <img
                src={`http://localhost:5000/uploads/${lecture.banner}`}
                alt={lecture.topic}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            ) : (
              <span className="text-gray-400">No Banner</span>
            )}
          </div>

          {/* Details */}
          <div className="flex-grow space-y-2 text-gray-800">
            <p>
              <strong>Teacher:</strong> {lecture.resourcePerson || "N/A"}
            </p>
            <p>
              <strong>Venue:</strong> {lecture.venue || "N/A"}
            </p>
            <p>
              <strong>Class:</strong> {lecture.class || "N/A"}
            </p>
            <p>
              <strong>Time:</strong> {lecture.time || "N/A"}
            </p>
            <p>
              <strong>Strength:</strong> {lecture.strength || "N/A"}
            </p>
            <p>
              <strong>Company:</strong> {lecture.company || "N/A"}
            </p>
            <p>
              <strong>Location:</strong> {lecture.location || "N/A"}
            </p>
            <p>
              <strong>Designation:</strong> {lecture.designation || "N/A"}
            </p>
            <p>
              <strong>Date:</strong> {formatDate(lecture.date)}
            </p>

            {/* Images (if any) */}
            {lecture.images && (
              <div>
                <strong>Images:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {lecture.images.split(",").map((img, idx) => (
                    <img
                      key={idx}
                      src={`http://localhost:5000/uploads/${img.trim()}`}
                      alt={`Image ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Lecture Card ---
const LectureCard = React.memo(
  ({
    id,
    title,
    instructor,
    time,
    date,
    className,
    bannerUrl,
    onClick,
    onDeleteClick,
    isDeleting,
  }) => {
    return (
      <article
        onClick={onClick}
        className={`lecture-card w-full max-w-xs bg-white rounded-xl border border-gray-200 shadow-sm transform transition-all duration-300 cursor-pointer flex flex-col overflow-hidden mx-auto
          ${
            isDeleting
              ? "opacity-50 pointer-events-none"
              : "hover:shadow-2xl hover:scale-105"
          }
        `}
      >
        {/* Banner image */}
        <div className="h-40 bg-gray-100 rounded-t-xl overflow-hidden flex items-center justify-center">
          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt={title}
              className="w-full h-full object-cover max-w-full transition-transform duration-500 ease-in-out hover:scale-110"
              loading="lazy"
            />
          ) : (
            <span className="text-gray-400">No Banner</span>
          )}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-3 break-words">
            {title}
          </h3>

          <p className="text-sm text-gray-600 mb-1">
            <strong>Guest:</strong> {instructor || "N/A"}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Date:</strong> {formatDate(date)}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Time:</strong> {time || "N/A"}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Class:</strong> {className || "N/A"}
          </p>

          <div className="flex justify-between mt-auto items-center">
            {/* Edit Button */}
            <Link
              to={`/edit-lecture/${id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-blue-600 font-semibold text-sm hover:text-blue-800"
            >
              <FaEdit /> Edit
            </Link>

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick();
              }}
              className="btn flex items-center gap-1 text-gray-600 font-semibold text-sm hover:text-black"
              type="button"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-gray-600 rounded-full" />
              ) : (
                <>
                  <FaTrash /> Delete
                </>
              )}
            </button>
          </div>
        </div>
      </article>
    );
  }
);

// --- Dashboard Section ---
function DashboardSection({
  title,
  lectures,
  onViewAllClick,
  onDelete,
  deletingId,
  onCardClick,
}) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-black pb-1">
          {title}
        </h2>
        <button
          onClick={onViewAllClick}
          className="text-red-600 hover:text-red-700 font-medium flex items-center space-x-1 transition-colors"
        >
          <span>View All</span>
          <span></span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {lectures.map((lecture) => (
          <LectureCard
            key={lecture._id}
            id={lecture._id}
            title={lecture.topic}
            instructor={lecture.resourcePerson}
            time={lecture.time}
            date={lecture.date}
            className={lecture.class}
            bannerUrl={
              lecture.banner
                ? `http://localhost:5000/uploads/${lecture.banner}`
                : ""
            }
            onClick={() => onCardClick(lecture)}
            onDeleteClick={() => onDelete(lecture._id, lecture.topic)}
            isDeleting={deletingId === lecture._id}
          />
        ))}
      </div>
    </div>
  );
}

// --- Main Dashboard ---
export default function Dashboard() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedLecture, setSelectedLecture] = useState(null);

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/lectures");
      const data = await res.json();
      setLectures(data);
    } catch (error) {
      toast.error("Failed to fetch lectures.", { position: "bottom-left" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLecture = (id, topic) => {
    const ToastConfirm = ({ closeToast }) => (
      <div>
        <p>Delete lecture "{topic}"?</p>
        <div className="flex justify-end gap-2 mt-2">
          <button
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => closeToast()}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={async () => {
              closeToast();
              setDeletingId(id);
              try {
                const res = await fetch(`http://localhost:5000/api/lectures/${id}`, {
                  method: "DELETE",
                });
                if (!res.ok) throw new Error("Failed to delete lecture");
                setLectures((prev) => prev.filter((l) => l._id !== id));
                toast.success("Lecture deleted successfully.", {
                  position: "bottom-left",
                });
              } catch (error) {
                toast.error("Error deleting lecture.", { position: "bottom-left" });
              } finally {
                setDeletingId(null);
              }
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    );

    toast.info(<ToastConfirm />, {
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
      position: "bottom-left",
    });
  };

  // Unique classes for filter dropdown
  const uniqueClasses = useMemo(() => {
    const classes = lectures.map((l) => l.class).filter(Boolean);
    return ["all", ...Array.from(new Set(classes))];
  }, [lectures]);

  // Filter by search and class
  const filteredLectures = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return lectures.filter(({ topic, resourcePerson, class: lectureClass }) => {
      const matchesSearch =
        topic.toLowerCase().includes(q) ||
        resourcePerson.toLowerCase().includes(q) ||
        (lectureClass && lectureClass.toLowerCase().includes(q));

      const matchesClass = selectedClass === "all" || lectureClass === selectedClass;

      return matchesSearch && matchesClass;
    });
  }, [lectures, searchQuery, selectedClass]);

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <p className="text-red-700 font-bold text-xl">Loading lectures...</p>
      </main>
    );
  }

  return (
    <>
      <style>
        {`
          /* Mobile adjustments */
          @media (max-width: 640px) {
            .header-row {
              flex-direction: column;
              align-items: stretch;
              gap: 1rem;
            }
            input[type="text"], select {
              width: 100%;
              margin-bottom: 0;
            }
            .lecture-card {
              padding: 1rem;
            }
            .lecture-card h3 {
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-word;
            }
            .btn {
              min-width: 48px;
              padding: 0.5rem 1rem;
            }
          }
        `}
      </style>

      <main className="bg-gray-100 min-h-screen px-4 sm:px-6 py-10 w-full max-w-screen-xl mx-auto overflow-x-hidden">
        {/* Header with title and search bar in same row */}
        <div className="flex items-center justify-between mb-8 header-row">
          <h1 className="text-4xl font-extrabold text-[#9B1C1C]">Dashboard</h1>

          <div className="flex items-center gap-4 w-full max-w-xl">
            <input
              type="text"
              placeholder="Search by topic, guest or class"
              className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 flex-grow min-w-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls === "all" ? "All Classes" : cls}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DashboardSection
          title="Guest Lectures"
          lectures={filteredLectures}
          onViewAllClick={() => console.log("View all clicked")}
          onDelete={handleDeleteLecture}
          deletingId={deletingId}
          onCardClick={(lecture) => setSelectedLecture(lecture)}
        />

        {/* Lecture Detail Modal WITHOUT backdrop */}
        <LectureDetailModal
          lecture={selectedLecture}
          onClose={() => setSelectedLecture(null)}
        />

        <ToastContainer />
      </main>
    </>
  );
}
