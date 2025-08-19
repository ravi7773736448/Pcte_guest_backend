import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// Components
import Sidebar from "./Sidebar";
import StudentSidebar from "./components/Student_Slide";
import HomePage from "./HomePage";
import AdminLogin from "./AdminLogin";
import StudentLogin from "./StudentLogin";
import StudentDashboard from "./components/StudentDashboard";
import Dashboard from "./Dashboard";
import AddLecture from "./AddLecture";
import EditLecture from "./EditLecture";
import ViewLectures from "./ViewLectures";
import LectureDetails from "./components/LectureDetails";
import FeedbackForm from "./components/feedbackForm";
import Report from "./Report";
import UploadClassAttendance from "./UploadClassAttendance";
import RequestLecture from "./components/RequestLecture";
import AdminLectureRequests from "./components/AdminLectureRequests";

// Toast notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Admin route protection
const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin-login" />;
};

// Wrapper to handle sidebars
function AppWrapper() {
  const location = useLocation();

  // Hide all sidebars on login + homepage
  const hideSidebarPaths = ["/", "/admin-login", "/student-login"];

  // Student-only sidebar
  const showStudentSidebarPaths = [
    "/student-dashboard",
    "/student-view-lectures",
    "/student-view-lecture-details",
    "/student-feedback",
    "/student/request-lecture",
  ];

  const showSidebar = !hideSidebarPaths.includes(location.pathname);
  const showStudentSidebar = showStudentSidebarPaths.includes(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ✅ Sidebar handling */}
      {showSidebar && (showStudentSidebar ? <StudentSidebar /> : <Sidebar />)}

      <div className="flex-grow overflow-auto">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />

          {/* Login routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/student-login" element={<StudentLogin />} />

          {/* Student routes */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student-view-lectures" element={<ViewLectures />} />
          <Route path="/student-view-lecture-details" element={<LectureDetails />} />
          <Route path="/student-feedback" element={<FeedbackForm />} />
          <Route path="/student/request-lecture" element={<RequestLecture />} />

          {/* Admin routes (protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedAdminRoute>
                <Dashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/add-lecture"
            element={
              <ProtectedAdminRoute>
                <AddLecture />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/edit-lecture/:id"
            element={
              <ProtectedAdminRoute>
                <EditLecture />
              </ProtectedAdminRoute>
            }
          />
          {/* redirect /edit-lecture without ID */}
          <Route path="/edit-lecture" element={<Navigate to="/dashboard" />} />

          <Route
            path="/view-lectures"
            element={
              <ProtectedAdminRoute>
                <ViewLectures />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/upload-attendance"
            element={
              <ProtectedAdminRoute>
                <UploadClassAttendance />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedAdminRoute>
                <Report />
              </ProtectedAdminRoute>
            }
          />

          {/* Admin approval requests */}
          <Route
            path="/approval-requests"
            element={
              <ProtectedAdminRoute>
                <AdminLectureRequests />
              </ProtectedAdminRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}
