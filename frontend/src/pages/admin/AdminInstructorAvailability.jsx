import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  Loader2,
  Video
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import adminService from '../../services/adminService';
import { toast } from 'react-hot-toast';

const AdminInstructorAvailability = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const data = await adminService.getInstructorAvailability();
      setAvailability(data);
    } catch (error) {
      console.error('Failed to fetch availability', error);
      toast.error('Failed to load instructor sessions');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = availability.filter(item => 
    item.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Loading instructor schedules...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Live Session Schedule</h2>
          <p className="text-slate-500">Monitor all scheduled live classes and instructor sessions.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search instructors or courses..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Instructor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Session Title</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((session) => (
                <tr key={session._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {session.instructor?.name?.charAt(0) || 'I'}
                      </div>
                      <span className="text-sm font-bold text-slate-900">{session.instructor?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{session.course?.title || 'Standalone'}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{session.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {new Date(session.startTime).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                       session.isLive ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-slate-100 text-slate-600'
                     }`}>
                       {session.isLive ? 'Live Now' : 'Upcoming'}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {session.meetingLink && (
                      <a 
                        href={session.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                      >
                        <Video className="w-3 h-3" /> Join
                      </a>
                    )}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-400 font-medium">No live sessions scheduled.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInstructorAvailability;
