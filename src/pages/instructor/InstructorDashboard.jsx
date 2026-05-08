import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchInstructorDashboard } from '../../features/instructor/instructorThunk';
import { 
  BookOpen, 
  Users, 
  Video, 
  FileText, 
  DollarSign, 
  ChevronRight,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dashboardData, loading, error } = useSelector((state) => state.instructor);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchInstructorDashboard());
  }, [dispatch]);

  if (loading && !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Crunching your numbers...</p>
      </div>
    );
  }

  const stats = [
    { label: 'Total Courses', value: dashboardData?.stats?.totalCourses || 0, icon: <BookOpen className="text-blue-600" />, bg: 'bg-blue-50', sub: `${dashboardData?.stats?.publishedCourses || 0} Published` },
    { label: 'Total Students', value: dashboardData?.stats?.totalStudents || 0, icon: <Users className="text-purple-600" />, bg: 'bg-purple-50', sub: 'Across all courses' },
    { label: 'Total Earnings', value: `₹${dashboardData?.stats?.totalEarnings?.toLocaleString() || 0}`, icon: <DollarSign className="text-green-600" />, bg: 'bg-green-50', sub: 'Withdraw anytime' },
    { label: 'Enrolled Students', value: dashboardData?.stats?.totalStudents || 0, icon: <Users className="text-red-600" />, bg: 'bg-red-50', sub: 'Across all courses' },
  ];

  const recentApprovals = (dashboardData?.courses || []).slice(0, 3).map(c => ({
    id: c._id,
    course: c.title,
    status: c.status === 'published' ? 'Approved' : 'Pending',
    date: new Date(c.updatedAt).toLocaleDateString()
  }));

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Instructor Dashboard</h2>
          <p className="text-slate-500 mt-1 font-medium">Welcome back, {user?.name || 'Instructor'}! Here's what's happening with your courses today.</p>
        </div>
        <button onClick={() => navigate('/instructor/earnings')} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95">
          <TrendingUp size={18} />
          View Earnings Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Stats</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
              <p className="text-sm font-bold text-slate-500">{stat.label}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-50 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          {/* Upcoming Live Classes placeholder */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Live Classes Schedule</h3>
              <button className="text-blue-600 text-xs font-bold hover:underline">Manage Live</button>
            </div>
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto">
                <Video size={32} />
              </div>
              <div>
                <p className="font-bold text-slate-900">No live classes scheduled</p>
                <p className="text-sm text-slate-500 mt-1">Start a live session to interact with your students in real-time.</p>
              </div>
              <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all">
                Schedule New Class
              </button>
            </div>
          </div>

          {/* Student Progress Snapshot */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-8">Course Performance</h3>
            <div className="space-y-8">
              {(dashboardData?.courses || []).length > 0 ? (
                dashboardData.courses.slice(0, 3).map((course, i) => (
                  <div key={course._id || i} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm font-bold text-slate-900">{course.title}</span>
                        <span className="text-xs text-slate-400 ml-2">Total Enrolled: {course.enrolledCount || 0}</span>
                      </div>
                      <span className="text-xs font-bold text-blue-600">{course.status?.toUpperCase()}</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: course.status === 'published' ? '100%' : '30%' }}></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-500 italic">No courses created yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-10">
          {/* Course Approval Status */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50">
              <h3 className="font-black text-slate-900">Recent Courses</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {recentApprovals.length > 0 ? recentApprovals.map((item) => (
                <div key={item.id} className="p-6 space-y-3 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{item.course}</h4>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                      item.status === 'Approved' ? 'bg-green-50 text-green-600' : 
                      item.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Last Updated: {item.date}</span>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-xs text-slate-400 italic">No courses found</div>
              )}
            </div>
          </div>

          {/* Earnings Summary */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full -mr-16 -mt-16 opacity-50 blur-3xl"></div>
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Financial Overview</h3>
                <TrendingUp size={18} className="text-blue-400" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-400">Total Revenue</span>
                  <span className="text-lg font-black">₹{dashboardData?.stats?.totalEarnings || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-400">Next Payout</span>
                  <span className="text-xs font-bold text-blue-400">Calculated monthly</span>
                </div>
              </div>
              <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all">
                Request Payout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
