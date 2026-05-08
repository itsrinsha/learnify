import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentDashboard } from "../../features/student/studentThunk";
import {
  CheckCircle2,
  Clock,
  PlayCircle,
  FileText,
  Award,
  ChevronRight,
  ArrowRight,
  Loader2,
} from "lucide-react";

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardData, loading, error } = useSelector((state) => state.student);

  // Fetch Dashboard Data
  useEffect(() => {
    dispatch(fetchStudentDashboard());
  }, [dispatch]);

  // Loading State
  if (loading && !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Preparing your personalized dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 max-w-md">
          <p className="text-red-600 font-bold text-xl">Oops! Something went wrong</p>
          <p className="text-red-500 mt-2">{error}</p>
          <button 
            onClick={() => dispatch(fetchStudentDashboard())}
            className="mt-6 px-8 py-3 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-200"
          >
            Retry Fetching
          </button>
        </div>
      </div>
    );
  }

  // Summary Cards
  const summaryCards = [
    {
      label: "Courses Completed",
      value: dashboardData?.completedCourses || 0,
      icon: <CheckCircle2 className="text-green-600" />,
      bg: "bg-green-50",
    },
    {
      label: "Courses Enrolled",
      value: dashboardData?.totalCourses || 0,
      icon: <Clock className="text-yellow-600" />,
      bg: "bg-yellow-50",
    },
    {
      label: "Courses Pending",
      value: dashboardData?.pendingCourses || 0,
      icon: <PlayCircle className="text-blue-600" />,
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome back, {dashboardData?.studentName || "Student"} 👋
        </h2>

        <p className="text-slate-500">
          Keep learning and complete your courses.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {summaryCards.map((card, idx) => (

          <div
            key={idx}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center gap-5"
          >

            <div
              className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center shrink-0`}
            >
              {card.icon}
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                {card.label}
              </p>
              <p className="text-3xl font-black text-slate-900 mt-0.5">
                {card.value}
              </p>
            </div>

          </div>
        ))}

      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">

          <div className="flex items-center justify-between">

            <h3 className="text-xl font-bold text-slate-900">
              Your Learning Journey
            </h3>

            <button onClick={() => navigate('/student/courses')} className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
              View All Enrolled <ChevronRight size={16} />
            </button>

          </div>

          {/* Courses */}
          <div className="grid sm:grid-cols-2 gap-6">

            {dashboardData?.enrolledCourses?.length > 0 ? (
              dashboardData.enrolledCourses.map((item, index) => {
                const course = item.course || item;

                return (
                  <div
                    key={index}
                    className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:border-blue-300 transition-all group"
                  >
                    <div className="relative aspect-video">
                      <img
                        src={course.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                          <PlayCircle size={32} fill="currentColor" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-5">
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {course.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                          Instructor: {course.instructor?.name || "Expert"}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-blue-600">
                            {item.progress || 0}% Completed
                          </span>
                          <span className="text-slate-400">
                            {course.lessonsCount || course.lessons?.length || 0} Lessons
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${item.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      <button 
                        onClick={() => navigate(`/student/player/${course._id}`)}
                        className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-100"
                      >
                        Continue Learning
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                <p className="text-slate-500 font-medium italic">You haven't enrolled in any courses yet.</p>
                <button 
                  onClick={() => navigate('/student/buy-courses')}
                  className="mt-4 text-blue-600 font-bold hover:underline"
                >
                  Explore Courses
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-8">

          {/* Quick Stats / Info */}
          <div className="bg-blue-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <Award size={20} />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em]">Learning Goal</span>
              </div>
              <div>
                <h4 className="text-xl font-bold leading-tight">
                  You're doing great! Keep going to earn your first certificate.
                </h4>
                <p className="text-blue-100 text-sm mt-3 opacity-80 leading-relaxed">
                  Completing courses consistently improves your skill rating and visibility to recruiters.
                </p>
              </div>
              <button 
                onClick={() => navigate('/student/courses')}
                className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20"
              >
                My Certifications
              </button>
            </div>
          </div>

          {/* Tips for Students */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <PlayCircle size={20} className="text-blue-600" />
              Pro Tips
            </h3>
            <div className="space-y-5">
              {[
                { title: "Schedule Study Time", desc: "Set aside 30 mins daily." },
                { title: "Take Notes", desc: "Helps in long-term retention." },
                { title: "Practice Coding", desc: "Apply what you learn immediately." }
              ].map((tip, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{tip.title}</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;