import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function UploadClassAttendance() {
  const [lectures, setLectures] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState("");
  const [attendance, setAttendance] = useState({});
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Fetch lectures
  useEffect(() => {
    fetch("http://localhost:5000/api/lectures")
      .then((res) => res.json())
      .then(setLectures)
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load lectures.");
      });
  }, []);

  // Fetch classes when a lecture is selected
  useEffect(() => {
    if (!selectedLecture) {
      setClasses([]);
      setAttendance({});
      return;
    }

    setLoadingClasses(true);
    fetch(`http://localhost:5000/api/classes?excludeAttendedForLecture=${selectedLecture}`)
      .then((res) => res.json())
      .then((data) => {
        setClasses(data);
        setAttendance({});
        setLoadingClasses(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingClasses(false);
        toast.error("Failed to load classes.");
      });
  }, [selectedLecture]);

  const toggleClassAttendance = (classId) => {
    setAttendance((prev) => ({
      ...prev,
      [classId]: !prev[classId],
    }));
  };

  const submitAttendance = () => {
    if (!selectedLecture) {
      toast.error("Please select a lecture.");
      return;
    }

    const attendedClasses = Object.entries(attendance)
      .filter(([_, isPresent]) => isPresent)
      .map(([classId]) => classId);

    if (attendedClasses.length === 0) {
      toast("Please select at least one class.", { icon: "⚠️" });
      return;
    }

    fetch("http://localhost:5000/api/class-attendance/mark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lectureId: selectedLecture,
        attendedClasses,
        date: new Date(),
      }),
    })
      .then((res) => {
        if (res.ok) {
          toast.success("Attendance marked successfully!");
          setClasses((prevClasses) =>
            prevClasses.filter((cls) => !attendedClasses.includes(cls._id))
          );
          setAttendance({});
        } else {
          toast.error("Failed to submit.");
        }
      })
      .catch(() => toast.error("Something went wrong."));
  };

  return (
    <>
      <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-10 pt-24 md:pt-12 pb-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center text-red-700">
            Upload Class Attendance
          </h1>

          {/* Lecture Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Lecture
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={selectedLecture}
              onChange={(e) => setSelectedLecture(e.target.value)}
            >
              <option value="">-- Select Lecture --</option>
              {lectures.map((lec) => (
                <option key={lec._id} value={lec._id}>
                  {lec.topic} - {lec.class}
                </option>
              ))}
            </select>
          </div>

          {/* Class Attendance List */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mark Classes Attended
            </label>

            {loadingClasses ? (
              <p className="text-gray-500">Loading classes...</p>
            ) : classes.length === 0 ? (
              <p className="text-gray-500">No classes to mark attendance for.</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {classes.map((cls) => (
                  <li key={cls._id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`cls-${cls._id}`}
                      checked={attendance[cls._id] || false}
                      onChange={() => toggleClassAttendance(cls._id)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    <label htmlFor={`cls-${cls._id}`} className="text-gray-800">
                      {cls.name}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <button
              onClick={submitAttendance}
              disabled={loadingClasses || classes.length === 0}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              Submit Attendance
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}
