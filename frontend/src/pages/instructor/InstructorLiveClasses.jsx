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
    

      {/* Empty State Mockup */}
     

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
