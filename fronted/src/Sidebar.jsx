import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaEye,
  FaUpload,
  FaFileAlt,
  FaSignOutAlt,
  FaPlus,
  FaEdit,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

export default function Sidebar() {
  const [openManage, setOpenManage] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleManage = () => {
    setOpenManage((prev) => !prev);
  };

  const menuItem = (name, icon, isActive = false, onClick) => (
    <li
      role="button"
      tabIndex={0}
      className={`flex items-center gap-3 px-5 py-3 cursor-pointer font-medium rounded-md mx-2 transition-all duration-200 ease-in-out
      ${
        isActive
          ? "bg-red-100 text-red-600 font-semibold shadow-sm"
          : "text-gray-700 hover:bg-gray-50"
      }`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick();
      }}
    >
      <span className="text-lg">{icon}</span>
      {name}
    </li>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        aria-label="Toggle sidebar"
        onClick={() => setSidebarOpen((v) => !v)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600"
      >
        {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 flex flex-col shadow-lg transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static z-40`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
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

        {/* Menu */}
        <nav className="flex flex-col gap-1 flex-1 mt-2 overflow-y-auto">
          {menuItem(
            "Dashboard",
            <FaTachometerAlt />,
            active === "Dashboard",
            () => {
              setActive("Dashboard");
              setSidebarOpen(false);
            }
          )}

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
              <li
                role="button"
                tabIndex={0}
                className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded-md"
                onClick={() => {
                  setActive("Add Lectures");
                  setSidebarOpen(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && setActive("Add Lectures")}
              >
                <FaPlus className="text-gray-500" /> Add Lectures
              </li>
              <li
                role="button"
                tabIndex={0}
                className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded-md"
                onClick={() => {
                  setActive("Edit Lectures");
                  setSidebarOpen(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && setActive("Edit Lectures")}
              >
                <FaEdit className="text-gray-500" /> Edit Lectures
              </li>
            </ul>
          </div>

          {menuItem(
            "View Lectures",
            <FaEye />,
            active === "View Lectures",
            () => {
              setActive("View Lectures");
              setSidebarOpen(false);
            }
          )}
          {menuItem(
            "Upload Attendance",
            <FaUpload />,
            active === "Upload Attendance",
            () => {
              setActive("Upload Attendance");
              setSidebarOpen(false);
            }
          )}
          {menuItem(
            "Report",
            <FaFileAlt />,
            active === "Report",
            () => {
              setActive("Report");
              setSidebarOpen(false);
            }
          )}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <button className="flex items-center gap-2 text-red-600 font-medium hover:bg-red-50 w-full px-3 py-2 rounded-md transition-all duration-200">
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
