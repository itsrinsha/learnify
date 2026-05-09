import React from 'react';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  ChevronRight, 
  Video,
  BookOpen,
  Calendar,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const students = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://i.pravatar.cc/160?u=alice',
    courseName: 'Advanced React 19 Patterns',
    purchaseDate: 'May 01, 2026',
    progress: 80,
    completedLessons: 12,
    totalLessons: 15,
    liveAttendance: '92%',
    reviewStatus: 'Pending'
  }
];

const StudentsList = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Student Directory</h2>
          <p className="text-slate-500 mt-1 font-medium">Manage only students who have purchased your courses.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-4 py-2 border-r border-slate-100 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connected</p>
            <p className="text-sm font-black text-blue-600">2,845</p>
          </div>
          <div className="px-4 py-2 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Now</p>
            <p className="text-sm font-black text-green-600">42</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search students by name, email or course..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 shadow-sm transition-all outline-none"
          />
        </div>
        <div className="flex gap-4">
          <select className="px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 outline-none shadow-sm cursor-pointer hover:bg-slate-50 transition-all">
            <option>All Courses</option>
            <option>Advanced React 19 Patterns</option>
            <option>Node.js Microservices</option>
          </select>
          <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
            <Filter size={18} />
            Filters
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Course Context</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Activity</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
             
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing {students.length} students</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsList;
