import React from 'react';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  ChevronRight, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  Video,
  BookOpen,
  Calendar,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentsList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

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
              {students.length > 0 ? students.map((student) => (
                <tr 
                  key={student.id} 
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => navigate('/instructor/student-details')}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm" />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{student.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold truncate uppercase tracking-widest">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-700 leading-tight">{student.courseName}</p>
                      <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                        <Calendar size={12} /> Bought: {student.purchaseDate}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="w-40 space-y-2">
                      <div className="flex justify-between text-[10px] font-black">
                        <span className="text-blue-600">{student.progress}%</span>
                        <span className="text-slate-400">{student.completedLessons}/{student.totalLessons}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${student.progress}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4 text-slate-500">
                      <div className="flex flex-col items-center">
                        <Video size={16} className={student.liveAttendance === '100%' ? 'text-green-500' : 'text-slate-400'} />
                        <span className="text-[9px] font-black mt-1">{student.liveAttendance}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <BookOpen size={16} className="text-slate-400" />
                        <span className="text-[9px] font-black mt-1">L:{student.completedLessons}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      student.reviewStatus === 'Pending' ? 'bg-yellow-50 text-yellow-600' : 
                      student.reviewStatus === 'Passed' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'
                    }`}>
                      {student.reviewStatus}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/instructor/messages');
                        }}
                      >
                        <MessageSquare size={18} />
                      </button>
                      <button className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl border border-transparent hover:border-slate-100 transition-all">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                        <Users size={32} />
                      </div>
                      <div>
                        <p className="text-slate-900 font-bold">No students found</p>
                        <p className="text-slate-500 text-sm">Once students enroll in your courses, they will appear here.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
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
