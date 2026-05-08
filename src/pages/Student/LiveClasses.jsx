import React from 'react';
import { 
  PlayCircle, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Video,
  ArrowRight,
  Info,
  ChevronRight
} from 'lucide-react';

const LiveClasses = () => {
  const upcomingClasses = [
    {
      id: 1,
      courseTitle: 'Advanced React Patterns',
      instructorName: 'Sarah Jenkins',
      topic: 'Optimizing Context API with Memoization',
      date: 'Today, May 12',
      time: '04:00 PM - 05:30 PM',
      status: 'Live Now',
      participants: 245,
    },
    {
      id: 2,
      courseTitle: 'The Complete Web Development Bootcamp',
      instructorName: 'Dr. Angela Yu',
      topic: 'Deployment with Docker & Kubernetes',
      date: 'Tomorrow, May 13',
      time: '10:00 AM - 12:00 PM',
      status: 'Upcoming',
      participants: 120,
    }
  ];

  const attendanceHistory = [
    { id: 101, topic: 'React Hooks Deep Dive', date: 'May 10, 2026', status: 'Attended', duration: '1h 30m' },
    { id: 102, topic: 'UI Principles for Web', date: 'May 08, 2026', status: 'Missed', duration: '-' },
    { id: 103, topic: 'Node.js Performance', date: 'May 05, 2026', status: 'Attended', duration: '2h 00m' },
    { id: 104, topic: 'Database Normalization', date: 'May 01, 2026', status: 'Attended', duration: '1h 45m' },
  ];

  const stats = [
    { label: 'Attended Classes', value: '24', icon: <CheckCircle2 className="text-green-600" />, bg: 'bg-green-50' },
    { label: 'Missed Classes', value: '02', icon: <XCircle className="text-red-600" />, bg: 'bg-red-50' },
    { label: 'Total Live Hours', value: '38h', icon: <Clock className="text-blue-600" />, bg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Live Learning Portal</h2>
        <p className="text-slate-500">Access your live sessions and track your attendance history.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upcoming Classes */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Video size={20} className="text-blue-600" />
            Upcoming Live Classes
          </h3>
          
          <div className="space-y-4">
            {upcomingClasses.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:border-blue-300 transition-all group">
                <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                  <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 ${
                    item.status === 'Live Now' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                  }`}>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{item.date.split(',')[0]}</span>
                    <span className="text-2xl font-black">{item.date.split(' ')[2] || '12'}</span>
                  </div>
                  
                  <div className="flex-1 space-y-3 text-center md:text-left">
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'Live Now' ? 'bg-red-600 text-white animate-pulse' : 'bg-blue-600 text-white'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-lg">
                        {item.courseTitle}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 line-clamp-1">{item.topic}</h4>
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm font-medium text-slate-500">
                      <span className="flex items-center gap-1.5"><Clock size={16} /> {item.time}</span>
                      <span className="flex items-center gap-1.5"><Users size={16} /> {item.participants} Joined</span>
                    </div>
                  </div>

                  <button className={`px-8 py-4 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-2 ${
                    item.status === 'Live Now' 
                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-100 active:scale-95' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  }`}>
                    {item.status === 'Live Now' ? (
                      <>
                        <PlayCircle size={20} />
                        Join Now
                      </>
                    ) : (
                      'Locked'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 bg-blue-50 rounded-2xl border border-dashed border-blue-200 flex items-start gap-4">
            <Info size={20} className="text-blue-600 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-blue-900">Live Class Availability</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Live classes are only available for purchased courses. Recordings will be available in the "My Courses" section within 24 hours of the session.
              </p>
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar size={20} className="text-blue-600" />
            Attendance History
          </h3>
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {attendanceHistory.map((h) => (
                <div key={h.id} className="p-5 hover:bg-slate-50 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{h.topic}</h5>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      h.status === 'Attended' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {h.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-medium text-slate-400">
                    <span>{h.date}</span>
                    <span>{h.duration}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 bg-slate-50 text-slate-500 font-bold text-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
              Load More <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClasses;
