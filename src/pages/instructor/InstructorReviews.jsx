import React, { useEffect, useState } from 'react';
import instructorService from '../../services/instructorService';
import { 
  Calendar, 
  Clock, 
  User, 
  BookOpen, 
  Video, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  History,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';





const InstructorReviews = () => {
  const [history, setHistory] = useState([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
useEffect(()=>{
  const fetchHistory = async ()=>{
    try{
      const gata = await instructorCourseService.getReviewHistory();

      setHistory(data.history||[]);
    }catch(error){
      console.log(error)
    }
  }
  fetchHistory();
},[])
  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Reviews & Schedules</h2>
          <p className="text-slate-500 mt-1 font-medium">Schedule and manage 1-on-1 review sessions with your students.</p>
        </div>
        <button 
          onClick={() => setShowScheduleForm(true)}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3 active:scale-95"
        >
          <Plus size={20} />
          Schedule New Review
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Active Reviews */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900">Upcoming Reviews</h3>
            <div className="flex gap-2">
              <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-colors">
                <Filter size={18} />
              </button>
              <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-colors">
                <Search size={18} />
              </button>
            </div>
          </div>

         
        </div>

        {/* Sidebar History & Info */}
        <div className="space-y-10">
          {/* Rules Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full -mr-16 -mt-16 opacity-50 blur-3xl"></div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <AlertCircle size={20} />
                </div>
                <h3 className="font-bold">Review Rules</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-400 font-medium">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Max 3 attempts per course
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Passing score unlocks certificate
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Sessions are recorded by default
                </li>
              </ul>
            </div>
          </div>

          {/* Past Results */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-black text-slate-900">Recent History</h3>
              <History size={18} className="text-slate-300" />
            </div>
            <div className="divide-y divide-slate-50">
              {history.map((item) => (
                <div key={`${item.student}-${item.course}`} className="p-6 space-y-3 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{item.student}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.course}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                      item.result === 'Pass' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {item.result}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>{item.date}</span>
                    <span>Attempt {item.attempt}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors uppercase tracking-widest">
              View Full History
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Modal Placeholder */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Schedule Review</h3>
                <p className="text-slate-500 font-medium text-sm mt-1">Set up a new evaluation session for a student.</p>
              </div>
              <button onClick={() => setShowScheduleForm(false)} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Select Course</label>

                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Select Student</label>
  
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Date</label>
                  <input type="date" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Time</label>
                  <input type="time" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Meeting Link</label>
                <input type="url" placeholder="https://meet.google.com/..." className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div className="pt-6">
                <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">
                  Confirm Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorReviews;
