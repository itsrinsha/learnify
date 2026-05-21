import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchStudentDashboard } from "../../features/student/studentThunk";
import {
  CheckCircle2,
  Clock,
  PlayCircle,
  FileText,
  Award,
  ChevronRight,
  Loader2,
} from "lucide-react";

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      icon: <CheckCircle2 className="text-success-500" />,
      bg: "bg-slate-50",
    },
    {
      label: "Enrolled Courses",
      value: dashboardData?.totalCourses || 0,
      icon: <Clock className="text-primary-600" />,
      bg: "bg-slate-50",
    },
    {
      label: "Active Lessons",
      value: dashboardData?.pendingCourses || 0,
      icon: <PlayCircle className="text-primary-600" />,
      bg: "bg-slate-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome back, {dashboardData?.studentName || "Student"}!
        </h2>
        <p className="text-slate-500 mt-1">
          Track your progress and continue your learning journey.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryCards.map((card, idx) => (
          <div
            key={idx}
            className="card p-6 flex items-center gap-5"
          >
            <div className={`w-12 h-12 ${card.bg} rounded flex items-center justify-center shrink-0 border border-slate-100`}>
              {card.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.label}
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h3 className="text-lg font-bold text-slate-900">
              Continue Learning
            </h3>
            <button onClick={() => navigate('/student/courses')} className="text-primary-600 text-sm font-semibold flex items-center gap-1 hover:text-primary-700 transition-colors">
              View All <ChevronRight size={16} />
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
                    className="card group flex flex-col"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={course.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-5 flex-1 flex flex-col space-y-4">
                      <div>
                        <h4 className="font-bold text-slate-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                          {course.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          By {course.instructor?.name || "Expert"}
                        </p>
                      </div>

                      <div className="mt-auto space-y-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-primary-600">
                            {item.progress || 0}% Complete
                          </span>
                          <span className="text-slate-400 uppercase tracking-tighter">
                            {course.lessonsCount || course.lessons?.length || 0} Lessons
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-600 transition-all duration-500"
                            style={{ width: `${item.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      <button 
                        onClick={() => navigate(`/student/player/${course._id}`)}
                        className="btn-primary w-full py-2.5 text-sm"
                      >
                        Resume Course
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center bg-white border border-dashed border-slate-300 rounded-lg">
                <p className="text-slate-500 font-medium">You haven't enrolled in any courses yet.</p>
                <button 
                  onClick={() => navigate('/student/buy-courses')}
                  className="mt-4 btn-primary"
                >
                  Explore Courses
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-primary-900 rounded-lg p-6 text-white space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-800 rounded flex items-center justify-center">
                <Award size={20} className="text-primary-100" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Achieve Your Goals</span>
            </div>
            <div>
              <h4 className="text-lg font-bold leading-tight text-white">
                Complete your courses to earn industry-recognized certificates.
              </h4>
              <p className="text-primary-200 text-xs mt-3 leading-relaxed">
                Adding certificates to your profile increases your credibility and helps you stand out to employers.
              </p>
            </div>
            <button 
              onClick={() => navigate('/student/certificates')}
              className="w-full py-2.5 bg-white text-primary-900 rounded font-bold text-sm hover:bg-primary-50 transition-colors shadow-sm"
            >
              View My Certificates
            </button>
          </div>

          <div className="card p-6 space-y-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <PlayCircle size={18} className="text-primary-600" />
              Learning Tips
            </h3>
            <div className="space-y-5">
              {[
                { title: "Consistent Practice", desc: "Spend at least 30 minutes every day to build a habit." },
                { title: "Active Note-taking", desc: "Summarize key concepts in your own words." },
                { title: "Hands-on Projects", desc: "Build real projects to apply what you've learned." }
              ].map((tip, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-primary-600 font-bold text-xs shrink-0 border border-slate-100">
                    {i + 1}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{tip.title}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{tip.desc}</p>
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
