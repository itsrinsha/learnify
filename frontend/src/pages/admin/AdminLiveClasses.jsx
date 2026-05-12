import React, { useState, useEffect } from 'react';
import { 
  Video, 
  User, 
  Calendar, 
  Clock, 
  Users, 
  ExternalLink, 
  Search,
  Filter,
  Monitor,
  Loader2,
  AlertCircle
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import adminService from '../../services/adminService';

const AdminLiveClasses = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  useEffect(() => {
    fetchLiveSessions();
  }, []);

  const fetchLiveSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAdminLiveSessions();
      setSessions(data);
    } catch (err) {
      console.error('Error fetching admin live sessions:', err);
      setError('Unable to load live sessions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (session) => {
    if (session.isLive) return 'Live';
    if (new Date(session.startTime) > new Date()) return 'Scheduled';
    return 'Completed';
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return '-';
    return new Date(dateValue).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateValue) => {
    if (!dateValue) return '-';
    return new Date(dateValue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredSessions = sessions.filter((session) => {
    const status = getStatus(session);
    const matchesStatus = statusFilter === 'All Status' || status === statusFilter;
    const matchesSearch = [
      session.title,
      session.course?.title,
      session.instructor?.name,
      session.meetingLink,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center bg-white rounded-3xl border border-slate-200">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading live sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex items-center justify-center bg-white rounded-3xl border border-slate-200 p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h3 className="text-xl font-bold text-slate-900">Unable to load live sessions</h3>
          <p className="text-slate-500 max-w-md">{error}</p>
          <button
            onClick={fetchLiveSessions}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search classes, instructors..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border-none text-sm font-medium text-slate-600 rounded-xl focus:ring-0 px-4 py-2"
          >
            <option>All Status</option>
            <option>Live</option>
            <option>Scheduled</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSessions.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center">
            <p className="text-slate-500">No live sessions match your filter. Try a different search or status.</p>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const status = getStatus(session);
            return (
              <div key={session._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden border-l-4 border-l-blue-600">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${status === 'Live' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        <Video className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{session.title}</h3>
                        <p className="text-sm text-slate-500 font-medium">{session.course?.title || 'Untitled course'}</p>
                      </div>
                    </div>
                    <StatusBadge status={status} />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 border-y border-slate-50">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Instructor</p>
                        <p className="font-semibold text-slate-900">{session.instructor?.name || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Date & Time</p>
                        <p className="font-semibold text-slate-900">{formatDate(session.startTime)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Meeting Link</p>
                        <p className="font-semibold text-slate-900 truncate">{session.meetingLink ? 'Available' : 'Not set'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Clock className="w-4 h-4" /> Start Time: {formatTime(session.startTime)}
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors">
                        <Monitor className="w-4 h-4" /> View Details
                      </button>
                      {session.meetingLink && status !== 'Completed' && (
                        <button
                          onClick={() => window.open(session.meetingLink, '_blank')}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20"
                        >
                          Join Link <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminLiveClasses;
