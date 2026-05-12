import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Download,
  Calendar,
  Filter,
  Loader2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import adminService from '../../services/adminService';

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAdminStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Generating reports...</p>
      </div>
    );
  }

  // Mock data for trends since we only have current month in stats for now
  // In a real app, this would come from a specialized analytics endpoint
  const growthData = stats?.chartData || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Platform Analytics</h2>
          <p className="text-slate-500">Comprehensive reports and data visualizations of platform growth.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
          <Download className="w-5 h-5" /> Export All Reports
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Revenue Growth</h3>
            <div className="flex gap-2">
               <span className="flex items-center gap-1 text-xs font-bold text-blue-600"><div className="w-3 h-3 rounded-full bg-blue-600"></div> Revenue</span>
            </div>
          </div>
          <div className="h-[350px] w-full min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(v) => `₹${v}`} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{r: 4, fill: '#2563eb'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Platform Distribution</h3>
          </div>
          <div className="h-[350px] w-full min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Students', count: stats?.totalStudents || 0 },
                { name: 'Instructors', count: stats?.totalInstructors || 0 },
                { name: 'Courses', count: stats?.totalCourses || 0 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Users', value: (stats?.totalStudents + stats?.totalInstructors) || 0, stat: 'Live across platform', icon: Users, color: 'blue' },
          { label: 'Platform Revenue', value: `₹${stats?.totalRevenue?.toLocaleString()}`, stat: 'Total transactions', icon: TrendingUp, color: 'purple' },
          { label: 'Active Courses', value: stats?.totalCourses || 0, stat: 'Published & Drafts', icon: BookOpen, color: 'green' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="relative">
              <div className="p-3 bg-slate-50 w-fit rounded-xl mb-4">
                <item.icon className="w-6 h-6 text-slate-600" />
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">{item.label}</p>
              <h4 className="text-xl font-bold text-slate-900 mb-1">{item.value}</h4>
              <p className={`text-xs font-bold ${item.color === 'blue' ? 'text-blue-600' : item.color === 'purple' ? 'text-purple-600' : 'text-green-600'}`}>{item.stat}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
