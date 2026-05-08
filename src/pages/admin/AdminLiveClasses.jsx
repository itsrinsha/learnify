import React from 'react';
import { 
  Video, 
  User, 
  Calendar, 
  Clock, 
  Users, 
  ExternalLink, 
  Search,
  Filter,
  Monitor
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';

const liveClasses = [
  { id: 1, title: 'Live Q&A: React Advanced Patterns', instructor: 'Mark Thompson', course: 'React Masterclass', date: '2024-05-10', time: '10:00 AM', enrolled: 124, status: 'Live', link: '#' },
  { id: 2, title: 'Portfolio Review Session', instructor: 'Elena Rodriguez', course: 'UI/UX Design', date: '2024-05-10', time: '02:00 PM', enrolled: 85, status: 'Scheduled', link: '#' },
  { id: 3, title: 'Introduction to Data Science Live', instructor: 'Dr. Sarah Jenkins', course: 'Data Science 101', date: '2024-05-09', time: '11:00 AM', enrolled: 210, status: 'Completed', link: '#' },
  { id: 4, title: 'Career Path in Cloud Computing', instructor: 'Michael Chen', course: 'AWS Certified Dev', date: '2024-05-11', time: '04:00 PM', enrolled: 56, status: 'Scheduled', link: '#' },
];

const AdminLiveClasses = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Live Class Monitoring</h2>
          <p className="text-slate-500">Monitor and manage all live sessions scheduled on the platform.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search classes, instructors..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select className="bg-slate-50 border-none text-sm font-medium text-slate-600 rounded-xl focus:ring-0 px-4 py-2">
            <option>All Status</option>
            <option>Live</option>
            <option>Scheduled</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {liveClasses.map((session) => (
          <div key={session.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden border-l-4 border-l-blue-600">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${session.status === 'Live' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{session.title}</h3>
                    <p className="text-sm text-slate-500 font-medium">{session.course}</p>
                  </div>
                </div>
                <StatusBadge status={session.status} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 border-y border-slate-50">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <User className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Instructor</p>
                    <p className="font-semibold text-slate-900">{session.instructor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Date & Time</p>
                    <p className="font-semibold text-slate-900">{session.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Enrolled</p>
                    <p className="font-semibold text-slate-900">{session.enrolled} Students</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Clock className="w-4 h-4" /> Start Time: {session.time}
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors">
                    <Monitor className="w-4 h-4" /> View Details
                  </button>
                  {session.status !== 'Completed' && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20">
                      Join Link <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLiveClasses;
