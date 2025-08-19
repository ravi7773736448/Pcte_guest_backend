import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaEye,
  FaUpload,
  FaFileAlt,
  FaSignOutAlt,
  FaPlus,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

export default function Sidebar({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openManage, setOpenManage] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleManage = () => setOpenManage((prev) => !prev);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAuthenticated");

    if (onLogout) onLogout();

    navigate("/admin-login");
  };

  return (
    <>
      {/* === TOP BAR for Mobile (Logo + Toggle) === */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.8QJtVK0wbirPqNFnD6ebWQHaHa?cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="PCTE Logo"
            className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
          />
          <div>
            <h2 className="font-semibold text-base">PCTE</h2>
            <p className="text-gray-600 text-xs">LUDHIANA</p>
          </div>
        </div>

        <button
          aria-label="Toggle sidebar"
          onClick={() => setSidebarOpen((v) => !v)}
          className="text-[#9B1C1C] focus:outline-none focus:ring-2 focus:ring-[#9B1C1C]"
        >
          {sidebarOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* === Sidebar === */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 flex flex-col shadow-lg transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static z-40 pt-16 md:pt-0`}
      >
        {/* Desktop Logo (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-3 p-4 border-b border-gray-200">
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.8QJtVK0wbirPqNFnD6ebWQHaHa?cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="PCTE Logo"
            className="w-14 h-14 rounded-full border border-gray-300 shadow-sm"
          />
          <div>
            <h2 className="font-semibold text-lg">PCTE</h2>
            <p className="text-gray-600">LUDHIANA</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1 flex-1 mt-2 overflow-y-auto">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-5 py-3 mx-2 rounded-md font-medium ${
              isActive("/dashboard")
                ? "bg-[#9B1C1C] text-[#fff] font-semibold shadow-sm"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <FaTachometerAlt className="text-lg" />
            Dashboard
          </Link>

          {/* Manage Lectures */}
          <div>
            <button
              onClick={toggleManage}
              className="flex items-center justify-between px-5 py-3 w-full cursor-pointer font-semibold text-gray-700 hover:bg-gray-50 rounded-md mx-2 transition-all"
              aria-expanded={openManage}
              aria-controls="manage-lectures-submenu"
            >
              <div className="flex items-center gap-3">
                <FaChalkboardTeacher className="text-lg" />
                Manage Lectures
              </div>
              {openManage ? <IoIosArrowDown /> : <IoIosArrowForward />}
            </button>
            <ul
              id="manage-lectures-submenu"
              className={`pl-14 flex flex-col gap-1 overflow-hidden transition-all duration-300 ease-in-out ${
                openManage ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <li>
                <Link
                  to="/add-lecture"
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md ${
                    isActive("/add-lecture")
                      ? "bg-[#9B1C1C] text-[#fff] font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <FaPlus className="text-gray-500" />
                  Add Lectures
                </Link>
              </li>
              <li>
                <Link
                  to="/edit-lectures"
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md ${
                    isActive("/edit-lectures")
                      ? "bg-[#9B1C1C] text-[#fff] font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <FaChalkboardTeacher className="text-gray-500" />
                  Edit Lectures
                </Link>
              </li>
            </ul>
          </div>

          <Link
            to="/view-lectures"
            className={`flex items-center gap-3 px-5 py-3 mx-2 rounded-md font-medium ${
              isActive("/view-lectures")
                ? "bg-[#9B1C1C] text-[#fff] font-semibold shadow-sm"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <FaEye className="text-lg" />
            View Lectures
          </Link>

          {/* === New Approval Requests Link === */}
          <Link
            to="/approval-requests"
            className={`flex items-center gap-3 px-5 py-3 mx-2 rounded-md font-medium ${
              isActive("/approval-requests")
                ? "bg-[#9B1C1C] text-[#fff] font-semibold shadow-sm"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <FaChalkboardTeacher className="text-lg" />
            Approval Requests
          </Link>

          <Link
            to="/upload-attendance"
            className={`flex items-center gap-3 px-5 py-3 mx-2 rounded-md font-medium ${
              isActive("/upload-attendance")
                ? "bg-[#9B1C1C] text-[#fff] font-semibold shadow-sm"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <FaUpload className="text-lg" />
            Upload Attendance
          </Link>

          <Link
            to="/report"
            className={`flex items-center gap-3 px-5 py-3 mx-2 rounded-md font-medium ${
              isActive("/report")
                ? "bg-[#9B1C1C] text-[#fff] font-semibold shadow-sm"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <FaFileAlt className="text-lg" />
            Report
          </Link>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[#fff] font-medium hover:bg-red-50 w-full px-3 py-2 rounded-md transition-all duration-200"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
