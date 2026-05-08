import React, { useState } from 'react';
import { 
  Video, 
  Calendar, 
  Users, 
  Plus, 
  Search, 
  Play, 
  Clock, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  VideoOff
} from 'lucide-react';

const InstructorLiveClasses = () => {
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const classes = [
    {
      id: 1,
      title: 'Advanced React 19 Patterns',
      course: 'Advanced React 19',
      date: 'Today',
      time: '04:00 PM',
      students: 145,
      status: 'Active',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      title: 'Q&A Session: Microservices',
      course: 'Node.js Microservices',
      date: 'Tomorrow',
      time: '10:00 AM',
      students: 82,
      status: 'Scheduled',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      title: 'UI Design Principles Workshop',
      course: 'UI/UX Fundamentals',
      date: 'May 05, 2026',
      time: '02:00 PM',
      students: 210,
      status: 'Scheduled',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Live Classes</h2>
          <p className="text-slate-500 mt-1 font-medium">Host real-time interactive sessions with your enrolled students.</p>
        </div>
        <button 
          onClick={() => setShowScheduleForm(true)}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3 active:scale-95"
        >
          <Plus size={20} />
          Schedule Live Class
        </button>
      </div>

      {/* Tabs / Filters */}
      <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-2">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100">Upcoming</button>
        <button className="px-6 py-3 text-slate-500 hover:bg-slate-100 rounded-xl font-bold text-sm transition-all">Completed</button>
        <div className="flex-1"></div>
        <div className="relative w-full md:w-64">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search classes..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Class List */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {classes.map((item) => (
          <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all group">
            <div className="h-48 relative overflow-hidden">
              <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <div className="absolute bottom-4 left-6">
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                  item.status === 'Active' ? 'bg-red-600 text-white animate-pulse' : 'bg-white/20 backdrop-blur-md text-white border border-white/30'
                }`}>
                  {item.status}
                </span>
              </div>
              {item.status === 'Active' && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                    <Play size={24} fill="currentColor" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest">{item.course}</p>
                <h3 className="text-lg font-black text-slate-900 leading-tight">{item.title}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar size={12} /> Date
                  </p>
                  <p className="text-sm font-bold text-slate-900">{item.date}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Clock size={12} /> Time
                  </p>
                  <p className="text-sm font-bold text-slate-900">{item.time}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i + item.id}`} alt="student" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-500">+{item.students} students</span>
                </div>
                <button className={`px-6 py-3 rounded-2xl font-black text-xs transition-all active:scale-95 shadow-lg ${
                  item.status === 'Active' 
                    ? 'bg-red-600 text-white shadow-red-100 hover:bg-red-700' 
                    : 'bg-slate-900 text-white shadow-slate-100 hover:bg-blue-600'
                }`}>
                  {item.status === 'Active' ? 'Join Now' : 'Manage'}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Create Card */}
        <button 
          onClick={() => setShowScheduleForm(true)}
          className="bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-10 group hover:border-blue-300 hover:bg-white transition-all min-h-[400px]"
        >
          <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm flex items-center justify-center text-slate-300 group-hover:text-blue-600 group-hover:shadow-xl transition-all mb-6">
            <Plus size={32} />
          </div>
          <p className="font-black text-slate-900 uppercase tracking-widest text-sm">Schedule Class</p>
          <p className="text-xs text-slate-400 font-bold mt-2">Maximum 4 live sessions per day</p>
        </button>
      </div>

      {/* Empty State Mockup */}
      {classes.length === 0 && (
        <div className="bg-white rounded-[3rem] border border-slate-200 p-20 flex flex-col items-center text-center space-y-6">
          <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center text-slate-200 mb-4">
            <VideoOff size={64} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">No Live Classes Scheduled</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto mt-2">You haven't scheduled any live sessions yet. Use the button above to create your first class.</p>
          </div>
          <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
            Get Started
          </button>
        </div>
      )}

      {/* Schedule Form Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Schedule Live Class</h3>
                <p className="text-slate-500 font-medium text-sm mt-1">Fill in the details to notify your students.</p>
              </div>
              <button onClick={() => setShowScheduleForm(false)} className="p-3 hover:bg-white rounded-2xl text-slate-400 transition-colors shadow-sm">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Class Title</label>
                <input type="text" placeholder="e.g. Advanced State Management Workshop" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Select Course</label>
                  <select className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                    <option>Advanced React 19</option>
                    <option>Node.js Microservices</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Audience</label>
                  <select className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                    <option>All Enrolled Students</option>
                    <option>Specific Student Group</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Date</label>
                  <input type="date" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Time</label>
                  <input type="time" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Meeting Link</label>
                <input type="url" placeholder="https://meet.google.com/..." className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div className="pt-6">
                <button className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-sm hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 active:scale-95">
                  Start Live Stream
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorLiveClasses;
