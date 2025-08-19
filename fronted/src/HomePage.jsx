import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaEye,
  FaFileExcel,
} from "react-icons/fa";

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-[Poppins] scroll-smooth">

      <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50 border-b border-gray-200 transition-all duration-300">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          
          <div className="flex items-center gap-4">
            <img
              src="https://tse3.mm.bing.net/th/id/OIP.8QJtVK0wbirPqNFnD6ebWQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
              alt="Logo"
              className="h-16 w-16 rounded-md shadow-md"
            />
            <h1 className="text-xl md:text-2xl font-extrabold tracking-wide"
                style={{ color: "#9B1C1C" }}>
              Guest Lecture Management
            </h1>
          </div>

          <nav className="hidden md:flex">
            <ul className="flex gap-8 text-lg text-gray-800">
              {["Home", "About", "Features"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="hover:relative after:absolute after:content-[''] after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
                    style={{
                      color: "inherit",
                      "--tw-after-bg": "#9B1C1C",
                    }}
                  >
                    {item}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/login"
                  className="text-white px-5 py-2 rounded-lg shadow-lg transition duration-300"
                  style={{ backgroundColor: "#9B1C1C" }}
                >
                  Login
                </a>
              </li>
            </ul>
          </nav>

          <button
            className="md:hidden text-3xl"
            style={{ color: "#9B1C1C" }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {menuOpen && (
          <div className="bg-white md:hidden border-t border-gray-200">
            <ul className="flex flex-col items-center gap-4 py-4 text-lg text-gray-800">
              {["Home", "About", "Features"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMenuOpen(false)}
                    className="hover:text-red-500"
                    style={{ color: "#9B1C1C" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/login"
                  className="text-white px-4 py-2 rounded-lg shadow transition"
                  style={{ backgroundColor: "#9B1C1C" }}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>

      <section
        id="home"
        className="flex flex-col md:flex-row items-center justify-center text-center md:text-left py-32 px-6 mt-20 gap-10"
        style={{
          background: `linear-gradient(to right, ${"#9B1C1C"}20, white, ${"#9B1C1C"}20)`,
        }}
      >
        <div className="max-w-xl animate-fadeIn">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Manage Guest Lectures Easily
          </h2>
          <p className="text-lg md:text-xl mb-8 text-gray-600">
            Organize, track, and stay updated on guest lectures with ease using a
            modern and intuitive system.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
  <a
    href="/admin-login"
    className="text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition duration-300 w-full md:w-auto text-center"
    style={{ backgroundColor: "#9B1C1C" }}
  >
    Login as Admin
  </a>
  <a
    href="/student-login"
    className="text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition duration-300 w-full md:w-auto text-center"
    style={{ backgroundColor: "#9B1C1C" }}
  >
    Login as Student
  </a>
</div>

        </div>

        <div className="flex justify-center animate-fadeIn delay-300">
          <img
            src="/undraw_working-together_r43a.svg"
            alt="Guest Lecture Illustration"
            className="w-80 md:w-[400px] drop-shadow-lg"
          />
        </div>
      </section>

      <section id="features" className="py-20 bg-white text-center px-4">
        <h3 className="text-4xl font-bold mb-12">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <FaCalendarAlt className="text-6xl mb-4" style={{ color: "#9B1C1C" }} />,
              title: "Add & Manage Lectures",
              desc: "Easily schedule and update guest lectures with a smooth interface.",
            },
            {
              icon: <FaEye className="text-6xl mb-4" style={{ color: "#9B1C1C" }} />,
              title: "View Upcoming Lectures",
              desc: "Keep track of all upcoming guest lectures in real time.",
            },
            {
              icon: <FaFileExcel className="text-6xl mb-4" style={{ color: "#9B1C1C" }} />,
              title: "Attendance Reports via Excel",
              desc: "Generate attendance reports in Excel format instantly.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-8 bg-white rounded-2xl shadow-md hover:shadow-2xl hover:scale-105 border transition duration-300 flex flex-col items-center text-center"
              style={{ borderColor: "#9B1C1C" }}
            >
              {feature.icon}
              <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="about"
        className="bg-gray-100 text-gray-900 py-16 text-center px-4"
      >
        <h3 className="text-4xl font-bold mb-6" style={{ color: "#9B1C1C" }}>
          About
        </h3>
        <p className="max-w-3xl mx-auto text-gray-700 text-lg">
          A professional system designed to help colleges manage and streamline
          guest lectures effectively with a modern, intuitive interface.
        </p>
      </section>

      <section
        className="text-white text-center py-16"
        style={{
          background: `linear-gradient(to right, #9B1C1C, #9B1C1C)`,
        }}
      >
        <h3 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Simplify Guest Lectures?
        </h3>
        <a
          href="/signup"
          className="bg-white font-bold px-8 py-4 rounded-full shadow hover:bg-gray-100 hover:scale-105 transition duration-300"
          style={{ color: "#9B1C1C" }}
        >
          Get Started
        </a>
      </section>

      <footer
        className="bg-white text-gray-500 py-6 text-center text-sm md:text-base border-t"
        style={{ borderColor: "#9B1C1C" }}
      >
        <p>© 2025 Guest Lecture Management</p>
        <div className="flex justify-center gap-6 mt-3">
          <a href="/contact" className="hover:transition" style={{ color: "#9B1C1C" }}>
            Contact
          </a>
          <a href="/terms" className="hover:transition" style={{ color: "#9B1C1C" }}>
            Terms
          </a>
          <a href="/privacy" className="hover:transition" style={{ color: "#9B1C1C" }}>
            Privacy
          </a>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
