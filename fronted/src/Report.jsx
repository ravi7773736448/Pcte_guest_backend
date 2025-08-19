import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Report() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch("http://localhost:5000/api/lectures")
    .then((res) => res.json())
    .then((data) => {
      const attendedLectures = data.filter(lec => lec.attendanceMarked);
      setLectures(attendedLectures);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to fetch lectures:", err);
      setLoading(false);
    });
}, []);


  const downloadExcel = () => {
    if (lectures.length === 0) {
      alert("No lecture data to export");
      return;
    }

    const formattedData = lectures.map((lec) => ({
      Teacher: lec.teacher || "",
      Venue: lec.venue || "",
      Class: lec.class || "",
      Time: lec.time || "",
      Strength: lec.strength || "",
      "Resource Person": lec.resourcePerson || "",
      Company: lec.company || "",
      Location: lec.location || "",
      Designation: lec.designation || "",
      Topic: lec.topic || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lectures");

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "LecturesReport.xlsx"
    );
  };

  if (loading) {
    return (
      <p className="p-6 text-center text-red-700 font-bold text-lg">
        Loading lectures...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-red-700 mb-8 text-center">
          Lecture Reports
        </h1>

        <div className="flex justify-center mb-6">
          <button
            onClick={downloadExcel}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-md transition duration-200"
          >
            Download Full Lectures Report (Excel)
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          {lectures.length === 0 ? (
            <p className="p-4 text-gray-500">No lectures found.</p>
          ) : (
            <table className="min-w-full bg-white text-sm text-gray-800">
              <thead className="bg-gray-100 text-xs uppercase sticky top-0 z-10">
                <tr>
                  {[
                    "Teacher",
                    "Venue",
                    "Class",
                    "Time",
                    "Strength",
                    "Resource Person",
                    "Company",
                    "Location",
                    "Designation",
                    "Topic",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left whitespace-nowrap font-semibold border-b"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lectures.map((lec, idx) => (
                  <tr
                    key={lec._id || idx}
                    className="even:bg-gray-50 border-b last:border-none"
                  >
                    <td className="px-4 py-2 whitespace-nowrap">{lec.teacher}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lec.venue}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lec.class}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lec.time}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lec.strength}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lec.resourcePerson}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lec.company}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lec.location}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lec.designation}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{lec.topic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
