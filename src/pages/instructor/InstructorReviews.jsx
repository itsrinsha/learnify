import React, { useState } from 'react';
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
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const reviews = [
    {
      id: 1,
      student: 'Alice Johnson',
      course: 'Advanced React 19',
      date: 'May 05, 2026',
      time: '10:00 AM',
      link: 'https://meet.google.com/abc-defg-hij',
      attempt: 1,
      status: 'Pending',
      remainingAttempts: 2
    },
    {
      id: 2,
      student: 'Bob Smith',
      course: 'Node.js Microservices',
      date: 'May 03, 2026',
      time: '02:30 PM',
      link: 'https://meet.google.com/xyz-uvw-rst',
      attempt: 2,
      status: 'Pass',
      remainingAttempts: 1
    },
    {
      id: 3,
      student: 'Charlie Brown',
      course: 'UI/UX Fundamentals',
      date: 'May 01, 2026',
      time: '11:00 AM',
      link: 'https://meet.google.com/pqr-stu-vwx',
      attempt: 1,
      status: 'Fail',
      remainingAttempts: 2
    }
  ];

  const history = [
    { student: 'David Miller', course: 'Advanced React 19', result: 'Pass', date: 'April 28, 2026', attempt: 1 },
    { student: 'Eva Green', course: 'Node.js Microservices', result: 'Fail', date: 'April 25, 2026', attempt: 1 },
  ];

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

          <div className="grid gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 hover:shadow-xl transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xl">
                      {review.student.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-slate-900 text-lg">{review.student}</h4>
                      <p className="text-sm font-bold text-blue-600 flex items-center gap-2">
                        <BookOpen size={14} />
                        {review.course}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-black text-slate-900">{review.date}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{review.time}</p>
                    </div>
                    <div className="h-10 w-[1px] bg-slate-100 hidden sm:block"></div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attempt</p>
                      <p className="font-black text-slate-900">{review.attempt} of 3</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      review.status === 'Pass' ? 'bg-green-50 text-green-600' :
                      review.status === 'Fail' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {review.status}
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <a 
                      href={review.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      <Video size={16} />
                      Join Meeting
                    </a>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <p className="text-sm font-bold text-slate-500">{review.remainingAttempts} attempts remaining</p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-100">
                      Update Result
                    </button>
                    <button className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all">
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
              {history.map((item, idx) => (
                <div key={idx} className="p-6 space-y-3 hover:bg-slate-50 transition-colors">
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
                  <select className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                    <option>Advanced React 19</option>
                    <option>Node.js Microservices</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Select Student</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                    <option>Alice Johnson</option>
                    <option>Bob Smith</option>
                  </select>
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
