import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaClipboardList,
  FaTachometerAlt,
} from "react-icons/fa";

export default function StudentSidebar({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Lock scroll when sidebar is open (mobile)
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  // Auto close sidebar when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
        document.body.style.overflow = "";
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("isAuthenticated");
    if (onLogout) onLogout();
    navigate("/student-login");
    setIsOpen(false);
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Hamburger button - mobile only */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-red-600 text-white rounded-md shadow-lg"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0  bg-opacity-40 z-40 transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto visible" : "opacity-0 pointer-events-none invisible"}
          md:hidden`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-lg z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static flex flex-col`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-4 p-6 border-b border-gray-200">
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.8QJtVK0wbirPqNFnD6ebWQHaHa?cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="PCTE Logo"
            className="w-14 h-14 rounded-full border border-gray-300 shadow-sm"
          />
          <div>
            <h1 className="font-bold text-lg leading-tight">Student</h1>
            <p className="text-sm text-gray-500">Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-grow gap-1 mt-2 overflow-y-auto">
          {/* Dashboard */}
          <Link
            to="/student-dashboard"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-5 py-3 mx-2 rounded-md font-medium transition-colors duration-200
              text-gray-700 hover:bg-red-100
            `}
          >
            <FaTachometerAlt className={`text-lg text-gray-600`} />
            Dashboard
          </Link>

          {/* Give Feedback */}
          <Link
            to="/student-feedback"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-5 py-3 mx-2 rounded-md font-medium transition-colors duration-200
              text-gray-700 hover:bg-red-100
            `}
          >
            <FaEye className={`text-lg text-gray-600`} />
            Give Feedback / Rate Lectures
          </Link>

          {/* Request Add/Edit Lecture */}
          <Link
            to="/student/request-lecture"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-5 py-3 mx-2 rounded-md font-medium transition-colors duration-200
              text-gray-700 hover:bg-red-100
            `}
          >
            <FaClipboardList className={`text-lg text-gray-600`} />
            Request Add/Edit Lecture
          </Link>
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-800 font-medium hover:bg-red-100 w-full px-3 py-2 rounded-md transition-colors duration-200"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
