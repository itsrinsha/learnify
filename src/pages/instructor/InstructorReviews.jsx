import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchInstructorDashboard, 
  fetchInstructorStudents, 
  fetchReviewHistory, 
  scheduleReviewThunk, 
  updateReviewMarkThunk 
} from '../../features/instructor/instructorThunk';
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
  AlertCircle,
  Loader2,
  ExternalLink,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';

const InstructorReviews = () => {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // Schedule Form State
  const [courseId, setCourseId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [reviewDate, setReviewDate] = useState('');
  const [reviewTime, setReviewTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');

  // Update Mark State
  const [updateStatus, setUpdateStatus] = useState('Pass');
  const [updateMark, setUpdateMark] = useState(0);
  const [updateNotes, setUpdateNotes] = useState('');

  const dispatch = useDispatch();
  const { dashboardData, students, reviewHistory, loading } = useSelector((state) => state.instructor);

  useEffect(() => {
    if (!dashboardData) dispatch(fetchInstructorDashboard());
    if (students.length === 0) dispatch(fetchInstructorStudents());
    dispatch(fetchReviewHistory());
  }, [dispatch, dashboardData, students.length]);

  const courses = dashboardData?.courses || [];

  const generateAutomaticLink = () => {
    const randomRoom = "review-" + Math.random().toString(36).substring(2, 10);
    const generatedUrl = `${window.location.origin}/video-call?room=${randomRoom}`;
    setMeetingLink(generatedUrl);
    toast.success("Live Room Link generated automatically!");
  };

  const handleOpenScheduleForm = () => {
    const randomRoom = "review-" + Math.random().toString(36).substring(2, 10);
    const generatedUrl = `${window.location.origin}/video-call?room=${randomRoom}`;
    setMeetingLink(generatedUrl);
    setShowScheduleForm(true);
  };

  // Handle Schedule Submit
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId || !studentId || !reviewDate || !reviewTime || !meetingLink) {
      toast.error('Please fill in all fields');
      return;
    }

    const promise = dispatch(scheduleReviewThunk({
      courseId,
      studentId,
      reviewDate,
      reviewTime,
      meetingLink
    })).unwrap();

    toast.promise(promise, {
      loading: 'Scheduling review session...',
      success: () => {
        setShowScheduleForm(false);
        // Reset form
        setCourseId('');
        setStudentId('');
        setReviewDate('');
        setReviewTime('');
        setMeetingLink('');
        return 'Review scheduled successfully!';
      },
      error: (err) => err || 'Failed to schedule review'
    });
  };

  // Open Update Modal
  const handleOpenUpdateModal = (review) => {
    setSelectedReview(review);
    setUpdateStatus(review.status === 'Pending' ? 'Pass' : review.status);
    setUpdateMark(review.mark || 0);
    setUpdateNotes(review.notes || '');
  };

  // Handle Update Submit
  const handleUpdateMarkSubmit = async () => {
    if (!selectedReview) return;

    const promise = dispatch(updateReviewMarkThunk({
      reviewId: selectedReview._id,
      updateData: {
        status: updateStatus,
        mark: Number(updateMark),
        notes: updateNotes
      }
    })).unwrap();

    toast.promise(promise, {
      loading: 'Updating review evaluation...',
      success: () => {
        setSelectedReview(null);
        return 'Evaluation updated successfully!';
      },
      error: (err) => err || 'Failed to update review'
    });
  };

  const upcomingReviews = (reviewHistory || []).filter(r => r.status === 'Pending');
  const pastReviews = (reviewHistory || []).filter(r => r.status !== 'Pending');

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Reviews & Schedules</h2>
          <p className="text-slate-500 mt-1 font-medium">Schedule and manage 1-on-1 review sessions with your students.</p>
        </div>
        <button 
          onClick={handleOpenScheduleForm}
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
            <h3 className="text-xl font-black text-slate-900">Upcoming Reviews ({upcomingReviews.length})</h3>
            <div className="flex gap-2">
              <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-colors">
                <Filter size={18} />
              </button>
              <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-colors">
                <Search size={18} />
              </button>
            </div>
          </div>

          {upcomingReviews.length > 0 ? (
            <div className="space-y-6">
              {upcomingReviews.map((item) => (
                <div key={item._id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 font-black text-lg">
                      {item.student?.name?.charAt(0) || 'S'}
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-bold text-slate-900">{item.student?.name || 'Student'}</h4>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-200/50">
                          Attempt {item.attempt || 1}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <BookOpen size={14} className="text-slate-400" />
                        {item.course?.title || 'Course'}
                      </p>
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-500 pt-1">
                        <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                          <Calendar size={14} className="text-blue-500" />
                          {item.reviewDate || 'No Date'}
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                          <Clock size={14} className="text-blue-500" />
                          {item.reviewTime || 'No Time'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                    {item.meetingLink && (
                      <a 
                        href={item.meetingLink} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="px-5 py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
                      >
                        <Video size={16} />
                        Enter Link
                      </a>
                    )}
                    <button 
                      onClick={() => handleOpenUpdateModal(item)}
                      className="px-5 py-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors shadow-sm shadow-emerald-100"
                    >
                      <Award size={16} />
                      Update Mark
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
               <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar size={32} />
               </div>
               <p className="text-slate-500 font-bold">No upcoming reviews scheduled.</p>
               <button onClick={handleOpenScheduleForm} className="text-blue-600 text-sm font-black uppercase tracking-widest mt-4 hover:underline">Schedule Now</button>
            </div>
          )}
        </div>

        {/* Sidebar History & Info */}
        <div className="space-y-10">
          {/* Rules Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
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
              <h3 className="font-black text-slate-900">Recent History ({pastReviews.length})</h3>
              <History size={18} className="text-slate-300" />
            </div>
            <div className="divide-y divide-slate-50 min-h-[200px]">
              {loading ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              ) : pastReviews.length > 0 ? (
                pastReviews.map((item) => (
                  <div key={item._id} className="p-6 space-y-3 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{item.student?.name || 'Student'}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.course?.title || 'Course'}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                          item.status === 'Pass' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                            : 'bg-rose-50 text-rose-600 border-rose-200'
                        }`}>
                          {item.status || 'Pending'}
                        </span>
                        {item.mark > 0 && (
                          <span className="text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">Score: {item.mark}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100/60 pt-2">
                      <span>{item.reviewDate || new Date(item.createdAt).toLocaleDateString()}</span>
                      <span>Attempt {item.attempt || 1}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                  No history found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Schedule Review</h3>
                <p className="text-slate-500 font-medium text-sm mt-1">Set up a new evaluation session for a student.</p>
              </div>
              <button onClick={() => setShowScheduleForm(false)} className="p-3 hover:bg-slate-200 rounded-2xl text-slate-400 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="p-10 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Select Course</label>
                  <select 
                    value={courseId} 
                    onChange={(e) => setCourseId(e.target.value)}
                    required
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                  >
                    <option value="">-- Choose Course --</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                    {courses.length === 0 && <option disabled>No courses available</option>}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Select Student</label>
                  <select 
                    value={studentId} 
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                  >
                    <option value="">-- Choose Student --</option>
                    {students.map(student => (
                      <option key={student.id} value={student.studentId}>{student.name}</option>
                    ))}
                    {students.length === 0 && <option disabled>No students found</option>}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Date</label>
                  <input 
                    type="date" 
                    value={reviewDate} 
                    onChange={(e) => setReviewDate(e.target.value)}
                    required
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Time</label>
                  <input 
                    type="time" 
                    value={reviewTime} 
                    onChange={(e) => setReviewTime(e.target.value)}
                    required
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner" 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Meeting Link</label>
                  <button 
                    type="button"
                    onClick={generateAutomaticLink}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-xl transition-colors shadow-2xs active:scale-95"
                  >
                    ⚡ Generate Live Room Link
                  </button>
                </div>
                <input 
                  type="url" 
                  value={meetingLink} 
                  onChange={(e) => setMeetingLink(e.target.value)}
                  required
                  placeholder="Click '⚡ Generate Live Room Link' or paste URL" 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner" 
                />
              </div>
              <div className="pt-6">
                <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Mark Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Update Review Mark</h3>
                <p className="text-slate-500 font-medium text-xs mt-1">Evaluate student performance</p>
              </div>
              <button onClick={() => setSelectedReview(null)} className="p-2 hover:bg-slate-200 rounded-2xl text-slate-400 transition-colors">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Status</label>
                <select 
                  value={updateStatus} 
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                >
                  <option value="Pass">Pass</option>
                  <option value="Failed">Failed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Mark / Score</label>
                <input 
                  type="number" 
                  value={updateMark} 
                  onChange={(e) => setUpdateMark(e.target.value)}
                  placeholder="e.g. 85" 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Feedback Notes</label>
                <textarea 
                  value={updateNotes} 
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="Provide constructive feedback..." 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px] shadow-inner" 
                />
              </div>
              <div className="pt-4">
                <button 
                  onClick={handleUpdateMarkSubmit}
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
                >
                  Save Evaluation
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
