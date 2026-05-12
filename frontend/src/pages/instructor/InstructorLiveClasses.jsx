import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Calendar, 
  Users, 
  Plus, 
  Search, 
  Play, 
  Clock, 
  XCircle,
  VideoOff,
  Loader2,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import liveService from '../../services/liveService';
import instructorService from '../../services/instructorService';
import { toast } from 'react-hot-toast';

const InstructorLiveClasses = () => {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    course: '',
    startTime: '',
    date: '',
    time: '',
    meetingLink: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [sessionsData, coursesData] = await Promise.all([
        liveService.getInstructorLiveSessions(),
        instructorService.getInstructorCourses()
      ]);
      setSessions(sessionsData);
      setCourses(coursesData);
      if (coursesData.length > 0) {
        setFormData(prev => ({ ...prev, course: coursesData[0]._id }));
      }
    } catch (error) {
      console.error('Failed to fetch live classes data', error);
      toast.error('Failed to load live sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      // Combine date and time
      const startDateTime = new Date(`${formData.date}T${formData.time}`);
      
      const payload = {
        title: formData.title,
        course: formData.course,
        startTime: startDateTime,
        meetingLink: formData.meetingLink
      };

      const newSession = await liveService.createLiveSession(payload);
      setSessions([newSession, ...sessions]);
      setShowScheduleForm(false);
      toast.success('Live class scheduled successfully!');
      
      // Reset form
      setFormData({
        title: '',
        course: courses[0]?._id || '',
        date: '',
        time: '',
        meetingLink: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule class');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLive = async (session) => {
    try {
      if (session.isLive) {
        await liveService.endLiveSession(session._id);
        toast.success('Live session ended');
      } else {
        await liveService.startLiveSession(session._id);
        toast.success('Live session started!');
      }
      // Refresh data
      const updatedSessions = await liveService.getInstructorLiveSessions();
      setSessions(updatedSessions);
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const filteredSessions = sessions.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase());
    const isUpcoming = new Date(s.startTime) > new Date() || s.isLive;
    return matchesSearch && (activeTab === 'upcoming' ? isUpcoming : !isUpcoming);
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium text-sm uppercase tracking-widest">Loading Live Environment...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Live Classes</h2>
          <p className="text-slate-500 mt-1 font-medium text-lg">Host real-time interactive sessions with your students.</p>
        </div>
        <button 
          onClick={() => setShowScheduleForm(true)}
          className="px-8 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-sm shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3 active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Schedule Live Class
        </button>
      </div>

      {/* Tabs / Filters */}
      <div className="flex flex-wrap items-center gap-6 border-b border-slate-100 pb-2">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`px-8 py-4 rounded-2xl font-black text-sm transition-all ${
            activeTab === 'upcoming' 
            ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
            : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Upcoming
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`px-8 py-4 rounded-2xl font-black text-sm transition-all ${
            activeTab === 'completed' 
            ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
            : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Completed
        </button>
        <div className="flex-1"></div>
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search your classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
        </div>
      </div>

      {/* Class List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSessions.map((session) => (
          <div key={session._id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all overflow-hidden group">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className={`p-4 rounded-2xl ${session.isLive ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-blue-50 text-blue-600'}`}>
                  {session.isLive ? <Video size={24} /> : <Calendar size={24} />}
                </div>
                {session.isLive && (
                  <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">Live Now</span>
                )}
              </div>
              
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{session.course?.title || 'Standalone Session'}</span>
                <h4 className="text-xl font-black text-slate-900 mt-2 line-clamp-2">{session.title}</h4>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                  <Clock size={16} />
                  {new Date(session.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50/50 flex gap-4">
              <button 
                onClick={() => handleToggleLive(session)}
                className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  session.isLive 
                  ? 'bg-slate-900 text-white hover:bg-red-600' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {session.isLive ? 'End Session' : 'Start Session'}
              </button>
              {session.meetingLink && (
                <a 
                  href={session.meetingLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-4 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:text-blue-600 transition-all shadow-sm"
                >
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
          </div>
        ))}

        {filteredSessions.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 space-y-4">
            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-slate-300 mx-auto shadow-sm">
              <VideoOff size={40} />
            </div>
            <div>
              <p className="text-xl font-black text-slate-900">No sessions found</p>
              <p className="text-slate-500 font-medium">You haven't scheduled any live classes matching this criteria.</p>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Form Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <form onSubmit={handleScheduleSubmit} className="bg-white rounded-[3.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Schedule Session</h3>
                <p className="text-slate-500 font-medium mt-1">Configure your real-time classroom.</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowScheduleForm(false)} 
                className="p-4 hover:bg-white rounded-2xl text-slate-400 transition-all shadow-sm"
              >
                <XCircle size={28} />
              </button>
            </div>
            
            <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">Class Title</label>
                <input 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  type="text" 
                  placeholder="e.g. Masterclass: Advanced Hooks" 
                  className="w-full px-8 py-5 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300" 
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">Associated Course</label>
                  <select 
                    required
                    value={formData.course}
                    onChange={(e) => setFormData({...formData, course: e.target.value})}
                    className="w-full px-8 py-5 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                  >
                    {courses.map(c => (
                      <option key={c._id} value={c._id}>{c.title}</option>
                    ))}
                    {courses.length === 0 && <option value="">No courses available</option>}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">Meeting Link</label>
                  <input 
                    required
                    value={formData.meetingLink}
                    onChange={(e) => setFormData({...formData, meetingLink: e.target.value})}
                    type="url" 
                    placeholder="Zoom / Google Meet URL" 
                    className="w-full px-8 py-5 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">Date</label>
                  <input 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    type="date" 
                    className="w-full px-8 py-5 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">Time</label>
                  <input 
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    type="time" 
                    className="w-full px-8 py-5 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" 
                  />
                </div>
              </div>
            </div>

            <div className="p-10 bg-slate-50/50">
              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {submitting ? <Loader2 className="animate-spin" /> : 'Confirm & Schedule'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default InstructorLiveClasses;
