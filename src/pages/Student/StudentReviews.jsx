import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Video, 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  User 
} from 'lucide-react';
import courseService from '../../services/courseService';
import toast from 'react-hot-toast';

const StudentReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await courseService.getMyEnrolledReviews();
        setReviews(data || []);
      } catch (error) {
        toast.error('Failed to load review sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md">
            1-on-1 Evaluations
          </span>
          <h2 className="text-4xl font-black tracking-tight text-white">My Review Sessions</h2>
          <p className="text-slate-300 font-medium text-base">
            Track your scheduled evaluation sessions, join live review calls with your instructors, and view your final pass/fail results.
          </p>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between px-2 border-b border-slate-200/80 pb-4">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Award className="text-blue-600" size={24} />
            Assigned Reviews ({reviews.length})
          </h3>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((item) => (
              <div 
                key={item._id} 
                className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group"
              >
                <div className="flex items-start gap-6 w-full md:w-auto">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-400 shadow-inner group-hover:scale-105 transition-transform">
                    {item.course?.thumbnail ? (
                      <img src={item.course.thumbnail} alt={item.course.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen size={28} />
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="text-xl font-bold text-slate-900 tracking-tight">{item.course?.title || 'Course Review'}</h4>
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-200/60">
                        Attempt {item.attempt || 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <User size={14} className="text-slate-400" />
                      <span>Instructor: <span className="text-slate-700">{item.instructor?.name || 'Instructor'}</span></span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 pt-2">
                      <span className="flex items-center gap-1.5 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100 shadow-2xs">
                        <Calendar size={16} className="text-blue-500" />
                        {item.reviewDate || 'Date pending'}
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100 shadow-2xs">
                        <Clock size={16} className="text-blue-500" />
                        {item.reviewTime || 'Time pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status & Action */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto justify-end border-t md:border-t-0 pt-6 md:pt-0 border-slate-100">
                  <div className="flex flex-col items-start sm:items-end gap-1.5 bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Evaluation Status</span>
                    <div className="flex items-center gap-2">
                      {item.status === 'Pass' && (
                        <span className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1.5 shadow-sm">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          Passed
                        </span>
                      )}
                      {item.status === 'Failed' && (
                        <span className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200 flex items-center gap-1.5 shadow-sm">
                          <XCircle size={16} className="text-rose-500" />
                          Failed
                        </span>
                      )}
                      {item.status === 'Pending' && (
                        <span className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200 flex items-center gap-1.5 shadow-sm animate-pulse">
                          <AlertCircle size={16} className="text-amber-500" />
                          Pending Review
                        </span>
                      )}
                    </div>
                    {item.mark > 0 && (
                      <span className="text-xs font-black text-slate-600">Score: <strong className="text-slate-900">{item.mark}</strong></span>
                    )}
                  </div>

                  {item.meetingLink && (
                    <a 
                      href={item.meetingLink} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-blue-100 hover:-translate-y-0.5 active:translate-y-0 shrink-0"
                    >
                      <Video size={18} />
                      Enter Link
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-sm">
             <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Award size={40} />
             </div>
             <h4 className="text-xl font-bold text-slate-800 mb-2">No Review Sessions Assigned</h4>
             <p className="text-slate-500 font-medium max-w-md mx-auto text-sm">
               You do not have any upcoming or past 1-on-1 review evaluations scheduled. When an instructor assigns a review, it will appear here.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentReviews;
