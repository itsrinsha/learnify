import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

// Common Components
import ProtectedRoute from "./components/common/ProtectedRoute";

// Auth Pages (Eagerly loaded as they are entry points)
import Login from "./pages/Student/auth/StudentLogin";
import Register from "./pages/Student/auth/StudentRegister";
import InstructorLogin from "./pages/instructor/auth/InstructorLogin";
import InstructorRegister from "./pages/instructor/auth/InstructorRegister";
import AdminLogin from "./pages/admin/auth/AdminLogin";
import LandingPage from "./pages/Home/LandingPage";
import BlockedPage from "./pages/common/BlockedPage";

// Student Dashboard Components (Lazy loaded)
const DashboardLayout = lazy(() => import("./components/student/DashboardLayout"));
const StudentDashboard = lazy(() => import("./pages/Student/StudentDashboard"));
const StudentCourses = lazy(() => import("./pages/Student/StudentCourses"));
const BuyCourses = lazy(() => import("./pages/Student/BuyCourses"));
const LiveClasses = lazy(() => import("./pages/Student/LiveClasses"));
const StudentMessage = lazy(() => import("./pages/Student/StudentMessage"));
const Exams = lazy(() => import("./pages/Student/Exams"));
const Certificates = lazy(() => import("./pages/Student/Certificates"));
const StudentProfile = lazy(() => import("./pages/Student/StudentProfile"));
const CourseDetails = lazy(() => import("./pages/Student/CourseDetails"));
const CoursePlayer = lazy(() => import("./pages/Student/CoursePlayer"));
const LiveRoom = lazy(() => import("./pages/Student/LiveRoom"));

// Instructor Dashboard Components (Lazy loaded)
const InstructorLayout = lazy(() => import("./components/instructor/InstructorLayout"));
const InstructorDashboard = lazy(() => import("./pages/Instructor/InstructorDashboard"));
const InstructorProfile = lazy(() => import("./pages/Instructor/InstructorProfile"));
const MyCourses = lazy(() => import("./pages/Instructor/MyCourses"));
const CreateCourse = lazy(() => import("./pages/Instructor/CreateCourse"));
const StudentsList = lazy(() => import("./pages/Instructor/StudentsList"));
const StudentDetails = lazy(() => import("./pages/Instructor/StudentDetails"));
const InstructorReviews = lazy(() => import("./pages/Instructor/InstructorReviews"));
const InstructorLiveClasses = lazy(() => import("./pages/Instructor/InstructorLiveClasses"));
const InstructorMessages = lazy(() => import("./pages/Instructor/InstructorMessages"));
const InstructorAttendance = lazy(() => import("./pages/Instructor/InstructorAttendance"));
const InstructorOffers = lazy(() => import("./pages/Instructor/InstructorOffers"));
const InstructorPayments = lazy(() => import("./pages/Instructor/InstructorPayments"));
const InstructorEarnings = lazy(() => import("./pages/Instructor/InstructorEarnings"));
const InstructorVerification = lazy(() => import("./pages/Instructor/InstructorVerification"));
const InstructorPendingApproval = lazy(() => import("./pages/Instructor/InstructorPendingApproval"));

// Admin Dashboard Components (Lazy loaded)
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminStudents = lazy(() => import("./pages/admin/AdminStudents"));
const AdminInstructors = lazy(() => import("./pages/admin/AdminInstructors"));
const AdminCourseApproval = lazy(() => import("./pages/admin/AdminCourseApproval"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminOffers = lazy(() => import("./pages/admin/AdminOffers"));
const AdminLiveClasses = lazy(() => import("./pages/admin/AdminLiveClasses"));
const AdminInstructorAvailability = lazy(() => import("./pages/admin/AdminInstructorAvailability"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments"));
const AdminEarnings = lazy(() => import("./pages/admin/AdminEarnings"));
const AdminUserBlocks = lazy(() => import("./pages/admin/AdminUserBlocks"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));
const AdminProfile = lazy(() => import("./pages/admin/AdminProfile"));

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/instructor/login" element={<InstructorLogin />} />
          <Route path="/instructor/register" element={<InstructorRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/blocked" element={<BlockedPage />} />

          {/* Student Protected Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="buy-courses" element={<BuyCourses />} />
            <Route path="live-classes" element={<LiveClasses />} />
            <Route path="live-chat" element={<LiveRoom />} />
            <Route path="messages" element={<StudentMessage />} />
            <Route path="exams" element={<Exams />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="course-details/:id" element={<CourseDetails />} />
            <Route path="course-player/:id" element={<CoursePlayer />} />
            <Route path="player/:id" element={<CoursePlayer />} />
          </Route>

          {/* Instructor Protected Routes */}
          <Route
            path="/instructor"
            element={
              <ProtectedRoute allowedRoles={["instructor"]}>
                <InstructorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<InstructorDashboard />} />
            <Route path="profile" element={<InstructorProfile />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="add-course" element={<CreateCourse />} />
            <Route path="edit-course/:id" element={<CreateCourse />} />
            <Route path="students/:id?" element={<StudentsList />} />
            <Route path="student-details" element={<StudentDetails />} />
            <Route path="reviews" element={<InstructorReviews />} />
            <Route path="live-classes" element={<InstructorLiveClasses />} />
            <Route path="messages" element={<InstructorMessages />} />
            <Route path="attendance" element={<InstructorAttendance />} />
            <Route path="offers" element={<InstructorOffers />} />
            <Route path="payments" element={<InstructorPayments />} />
            <Route path="earnings" element={<InstructorEarnings />} />
          </Route>

          {/* Instructor Verification Route (Outside Layout but Protected) */}
          <Route
            path="/instructor/verify"
            element={
              <ProtectedRoute allowedRoles={["instructor"]}>
                <InstructorVerification />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/pending"
            element={
              <ProtectedRoute allowedRoles={["instructor"]}>
                <InstructorPendingApproval />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="instructors" element={<AdminInstructors />} />
            <Route path="course-approval" element={<AdminCourseApproval />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="offers" element={<AdminOffers />} />
            <Route path="live-classes" element={<AdminLiveClasses />} />
            <Route path="availability" element={<AdminInstructorAvailability />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="earnings" element={<AdminEarnings />} />
            <Route path="user-blocks" element={<AdminUserBlocks />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
