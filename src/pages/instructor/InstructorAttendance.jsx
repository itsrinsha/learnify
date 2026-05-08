import React from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Users, 
  Calendar, 
  CheckCircle2, 
  XCircle,
  Video,
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';

const InstructorAttendance = () => {
  const attendanceData = [
    { id: 1, student: 'Alice Johnson', course: 'Advanced React 19', class: 'Server Components Deep Dive', date: 'May 02, 2026', status: 'Attended', duration: '55m', percentage: '98%' },
    { id: 2, student: 'Bob Smith', course: 'Node.js Microservices', class: 'Kafka Architecture', date: 'May 02, 2026', status: 'Missed', duration: '0m', percentage: '45%' },
    { id: 3, student: 'Charlie Brown', course: 'Advanced React 19', class: 'Server Components Deep Dive', date: 'May 02, 2026', status: 'Attended', duration: '48m', percentage: '92%' },
    { id: 4, student: 'David Miller', course: 'UI/UX Fundamentals', class: 'Color Theory', date: 'May 01, 2026', status: 'Attended', duration: '60m', percentage: '100%' },
    { id: 5, student: 'Eva Green', course: 'Node.js Microservices', class: 'Docker Containerization', date: 'May 01, 2026', status: 'Missed', duration: '0m', percentage: '78%' },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Attendance Tracking</h2>
          <p className="text-slate-500 mt-1 font-medium">Monitor student participation across your live sessions.</p>
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-100 hover:bg-blue-600 transition-all flex items-center gap-3 active:scale-95">
          <Download size={20} />
          Export Report
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg. Attendance', value: '82%', icon: <TrendingUp size={24} className="text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Today Attendance', value: '94%', icon: <Users size={24} className="text-purple-600" />, bg: 'bg-purple-50' },
          { label: 'Live Sessions', value: '12', icon: <Video size={24} className="text-red-600" />, bg: 'bg-red-50' },
          { label: 'Total Hours', value: '450h', icon: <Clock size={24} className="text-green-600" />, bg: 'bg-green-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-6">
            <div className={`w-16 h-16 ${stat.bg} rounded-2xl flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-2xl font-black text-slate-900">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search student or class name..."
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-4">
          <select className="px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
            <option>All Courses</option>
            <option>Advanced React 19</option>
            <option>Node.js Microservices</option>
          </select>
          <select className="px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
            <option>Status: All</option>
            <option>Attended</option>
            <option>Missed</option>
          </select>
          <button className="p-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Course & Class</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Duration</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Rate</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {attendanceData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-black text-sm">
                        {row.student.charAt(0)}
                      </div>
                      <p className="text-sm font-black text-slate-900">{row.student}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-900">{row.class}</p>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{row.course}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-900">{row.date}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.duration} Session</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      row.status === 'Attended' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[60px]">
                        <div 
                          className={`h-full rounded-full ${parseInt(row.percentage) > 80 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                          style={{ width: row.percentage }}
                        ></div>
                      </div>
                      <span className="text-xs font-black text-slate-900">{row.percentage}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-8 border-t border-slate-50 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing 5 of 1,245 records</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all">Previous</button>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-100 active:scale-95 transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorAttendance;
