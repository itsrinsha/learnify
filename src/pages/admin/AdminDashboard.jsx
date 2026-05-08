import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Video, 
  DollarSign, 
  UserX, 
  AlertCircle,
  MoreVertical,
  ArrowRight,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import adminService from '../../services/adminService';
import { Link } from 'react-router-dom';

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    pendingApprovals: 0,
  });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [users, courses, pendingReqs] = await Promise.all([
          adminService.getAllUsers(),
          adminService.getAllUsers(), // Assuming we might have a courses API or use generic
          adminService.getInstructorRequests()
        ]);

        // Just fetching users and courses to get counts
        // Note: For now we count from the users array
        const students = users.filter(u => u.role === 'student').length;
        const instructors = users.filter(u => u.role === 'instructor').length;
        
        setStats({
          totalStudents: students,
          totalInstructors: instructors,
          totalCourses: 0, // Placeholder until courses service is fully ready
          pendingApprovals: pendingReqs.length,
        });
        setRequests(pendingReqs.slice(0, 5)); // Show latest 5
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading platform overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h2>
          <p className="text-slate-500 font-medium">Welcome back! Here's what's happening on Learnify today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            Download Report
          </button>
          <button className="px-6 py-3 bg-blue-600 rounded-2xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">
            Platform Settings
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={stats.totalStudents.toLocaleString()} icon={Users} color="blue" />
        <StatCard title="Total Instructors" value={stats.totalInstructors.toLocaleString()} icon={GraduationCap} color="purple" />
        <StatCard title="Pending Approvals" value={stats.pendingApprovals} icon={Clock} color="amber" />
        <StatCard title="Total Revenue" value="₹0" icon={DollarSign} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900">Revenue Overview</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time earnings tracking</p>
            </div>
            <select className="bg-slate-50 border-none text-xs font-black uppercase tracking-widest text-slate-500 rounded-xl focus:ring-0 px-4 py-2 cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%" >
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latest Activity Feed (Mocked but styled) */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900">Activity Feed</h3>
            <button className="text-blue-600 hover:text-blue-700 text-xs font-black uppercase tracking-widest">View All</button>
          </div>
          <div className="space-y-8">
            {[
              { user: 'Sarah Jenkins', action: 'applied as instructor', time: '2 mins ago', type: 'instructor' },
              { user: 'Web Development', action: 'submitted for approval', time: '15 mins ago', type: 'course' },
              { user: 'Mark Thompson', action: 'purchased React 19', time: '1 hour ago', type: 'payment' },
              { user: 'System Update', action: 'completed', time: '4 hours ago', type: 'system' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  activity.type === 'instructor' ? 'bg-purple-50 text-purple-600' :
                  activity.type === 'course' ? 'bg-amber-50 text-amber-600' :
                  activity.type === 'payment' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                }`}>
                   <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    <span className="text-blue-600">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tighter">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructor Requests Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900">Pending Instructor Requests</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Review and approve new teaching talent</p>
          </div>
          <Link to="/admin/instructors" className="p-3 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100">
            <MoreVertical size={20} className="text-slate-400" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Instructor</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Expertise</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {requests.map((req, i) => (
                <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {req.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{req.name}</p>
                        <p className="text-xs text-slate-400 font-medium">{req.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-700">{req.verificationDetails?.expertise || 'N/A'}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{req.verificationDetails?.education}</p>
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status="Pending" />
                  </td>
                  <td className="px-8 py-6">
                    <Link to="/admin/instructors" className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-all">
                      Review Application
                    </Link>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-8 py-10 text-center text-slate-400 font-medium">No pending requests at the moment.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
          <Link to="/admin/instructors" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all">
            Manage All Instructors <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
