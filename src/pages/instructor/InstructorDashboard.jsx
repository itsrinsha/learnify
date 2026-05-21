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
  const { dashboardData, loading } = useSelector((state) => state.instructor);
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
    { label: 'Total Courses', value: dashboardData?.totalCourses || 0, icon: <BookOpen className="text-blue-600" />, bg: 'bg-blue-50', sub: `${dashboardData?.publishedCourses || 0} Published` },
    { label: 'Total Students', value: dashboardData?.totalStudents || 0, icon: <Users className="text-purple-600" />, bg: 'bg-purple-50', sub: 'Unique learners' },
    { label: 'Total Earnings', value: `₹${dashboardData?.totalEarnings?.toLocaleString() || 0}`, icon: <DollarSign className="text-green-600" />, bg: 'bg-green-50', sub: 'Total Revenue' },
    { label: 'Total Enrollments', value: dashboardData?.enrolledStudents || 0, icon: <Users className="text-red-600" />, bg: 'bg-red-50', sub: 'Course purchases' },
  ];

  const recentApprovals = (dashboardData?.courses || []).slice(0, 3).map(c => ({
    id: c._id,
    course: c.title,
    status: c.status === 'published' ? 'Approved' : c.status === 'draft' ? 'Draft' : 'Pending',
    date: new Date(c.updatedAt).toLocaleDateString()
  }));

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Instructor Dashboard</h2>
          <p className="text-slate-500 mt-1 font-medium">Hello, {user?.name || 'Instructor'}. Here is your teaching overview.</p>
        </div>
        <button onClick={() => navigate('/instructor/earnings')} className="btn-primary flex items-center gap-2">
          <TrendingUp size={18} />
          View Earnings
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="card p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className={`w-10 h-10 ${stat.bg} rounded flex items-center justify-center border border-slate-100`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global</span>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 text-[10px] font-bold text-primary-600 uppercase tracking-widest">
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Live Classes Snapshot */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Upcoming Live Sessions</h3>
              <button className="text-primary-600 text-xs font-bold hover:text-primary-700">Manage Sessions</button>
            </div>
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded flex items-center justify-center text-slate-300 mx-auto border border-slate-100">
                <Video size={32} />
              </div>
              <div>
                <p className="font-bold text-slate-900">No active live sessions</p>
                <p className="text-xs text-slate-500 mt-1">Ready to engage? Start a live session with your students.</p>
              </div>
              <button className="btn-primary py-2 px-6 text-sm">
                New Live Class
              </button>
            </div>
          </div>

          {/* Course Performance */}
          <div className="card p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Course Performance</h3>
            <div className="space-y-6">
              {(dashboardData?.courses || []).length > 0 ? (
                dashboardData.courses.slice(0, 3).map((course, i) => (
                  <div key={course._id || i} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-slate-900">{course.title}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase ml-2">Enrolled: {course.enrolledCount || 0}</span>
                      </div>
                      <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">{course.status}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-600" style={{ width: course.status === 'published' ? '100%' : '20%' }}></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center bg-slate-50 rounded border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500 font-medium italic">No performance data available.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
          {/* Recent Course List */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Recent Courses</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {recentApprovals.length > 0 ? recentApprovals.map((item) => (
                <div key={item.id} className="p-4 space-y-2 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-slate-900 truncate max-w-[140px]">{item.course}</h4>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                      item.status === 'Approved' ? 'bg-success-50 text-success-600 border border-success-200' : 
                      item.status === 'Pending' ? 'bg-warning-50 text-warning-600 border border-warning-200' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Updated: {item.date}</p>
                </div>
              )) : (
                <div className="p-6 text-center text-[10px] font-bold text-slate-400 uppercase italic">No records</div>
              )}
            </div>
          </div>

          {/* Financial Card */}
          <div className="bg-primary-900 rounded-lg p-6 text-white space-y-6 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary-100">Revenue Overview</h3>
              <TrendingUp size={16} className="text-primary-300" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs font-medium text-primary-300 uppercase tracking-wider">Gross Earnings</span>
                <span className="text-2xl font-bold">₹{dashboardData?.totalEarnings?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center border-t border-primary-800 pt-4">
                <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">Next Settlement</span>
                <span className="text-[10px] font-bold text-success-400 uppercase tracking-widest">Monthly</span>
              </div>
            </div>
            <button className="w-full py-2.5 bg-white text-primary-900 rounded font-bold text-sm hover:bg-primary-50 transition-colors shadow-sm">
              Request Payout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
