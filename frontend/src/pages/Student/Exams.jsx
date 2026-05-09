import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  History,
  Link as LinkIcon,
  ChevronRight,
  User,
  BookOpen,
  Loader2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { getStudentExams, getExamHistory } from '../../services/examService';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [examHistory, setExamHistory] = useState({});

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const data = await getStudentExams();
      setExams(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching exams:", err);
      setError("Failed to load your exams. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (examId) => {
    if (examHistory[examId]) return; // Already fetched
    try {
      const history = await getExamHistory(examId);
      setExamHistory(prev => ({ ...prev, [examId]: history }));
    } catch (err) {
      console.error("Error fetching exam history:", err);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center bg-white rounded-[2.5rem] border border-slate-200">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading your assessments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex items-center justify-center bg-white rounded-[2.5rem] border border-slate-200">
        <div className="flex flex-col items-center gap-4 text-center p-6">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h3 className="text-xl font-bold text-slate-900">Oops! Something went wrong</h3>
          <p className="text-slate-500 max-w-md">{error}</p>
          <button 
            onClick={fetchExams}
            className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Reviews & Exams</h2>
        <p className="text-slate-500">Track your exam schedules, attempt history, and results for your purchased courses.</p>
      </div>

      <div className="grid gap-8">
        {exams.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center flex flex-col items-center gap-4">
            <FileText size={64} className="text-slate-200" />
            <p className="text-slate-500 font-medium text-lg">No reviews or exams scheduled for your courses yet.</p>
          </div>
        ) : (
          exams.map((exam) => {
            const isFailed = exam.latestResult === 'fail' && exam.attemptCount >= exam.maxAttempts;
            const isPassed = exam.latestResult === 'pass';
            
            return (
              <div key={exam._id} className={`bg-white rounded-3xl border ${isFailed ? 'border-red-100' : 'border-slate-200'} shadow-sm overflow-hidden`}>
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex flex-col lg:flex-row justify-between gap-6 bg-slate-50/30">
                  <div className="flex gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                      isPassed ? 'bg-green-600 text-white shadow-green-100' : 
                      isFailed ? 'bg-red-600 text-white shadow-red-100' : 
                      'bg-blue-600 text-white shadow-blue-100'
                    }`}>
                      <FileText size={28} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-slate-900">{exam.course?.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                        <span className="flex items-center gap-1.5"><User size={14} /> {exam.instructor?.name}</span>
                        <span className="flex items-center gap-1.5 text-blue-600">
                          <Calendar size={14} /> 
                          {new Date(exam.scheduledDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {exam.duration} Minutes</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm">
                      <span className="text-slate-500">Attempts: </span>
                      <span className={`font-bold ${exam.attemptCount >= exam.maxAttempts ? 'text-red-600' : 'text-slate-900'}`}>
                        {exam.attemptCount}/{exam.maxAttempts}
                      </span>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-sm font-bold border capitalize ${
                      isPassed ? 'bg-green-50 text-green-700 border-green-100' : 
                      isFailed ? 'bg-red-50 text-red-700 border-red-100' : 
                      'bg-yellow-50 text-yellow-700 border-yellow-100'
                    }`}>
                      {isPassed ? 'Passed' : isFailed ? 'Failed' : exam.status}
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                  {/* Left Side: Info & Topics */}
                  <div className="p-8 space-y-8">
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <AlertCircle size={18} className="text-blue-600" />
                        Review Content & Topics
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {exam.topics?.map((topic, i) => (
                          <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 bg-blue-50 rounded-2xl border border-dashed border-blue-200">
                      <div className="flex items-start gap-3">
                        <LinkIcon size={18} className="text-blue-600 mt-1" />
                        <div>
                          <h5 className="text-sm font-bold text-blue-900 underline cursor-pointer">
                            {exam.attachment ? 'View Review Guidelines & Material.pdf' : 'No material attached'}
                          </h5>
                          <p className="text-xs text-blue-700 mt-1">Please download and review before your attempt.</p>
                        </div>
                      </div>
                    </div>

                    {exam.attemptCount < exam.maxAttempts && !isPassed && (
                      <button 
                        onClick={() => {/* logic to start exam */}}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
                      >
                        Start Next Attempt
                        <ChevronRight size={18} />
                      </button>
                    )}
                    {isFailed && (
                      <div className="space-y-4">
                        <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs font-bold flex items-center gap-2 border border-red-100">
                          <AlertTriangle size={16} /> All attempts used. You need instructor approval for another attempt.
                        </div>
                        <button className="w-full py-4 bg-white text-red-600 border-2 border-red-600 rounded-2xl font-bold text-sm hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                          Request Extra Attempt
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right Side: History */}
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <History size={18} className="text-blue-600" />
                        Attempt History
                      </h4>
                      <button 
                        onClick={() => fetchHistory(exam._id)}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Refresh History
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {examHistory[exam._id]?.map((h) => (
                        <div key={h._id} className="p-4 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-sm transition-all group">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                                h.result === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                #{h.attemptNumber}
                              </div>
                              <div>
                                <span className={`text-xs font-bold uppercase tracking-wider capitalize ${
                                  h.result === 'pass' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {h.result} • {h.score}%
                                </span>
                                <p className="text-[10px] text-slate-500 font-medium">
                                  {new Date(h.attemptedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            {h.result === 'pass' ? <CheckCircle2 size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-400" />}
                          </div>
                          {h.feedback && (
                            <p className="text-xs text-slate-600 leading-relaxed italic border-l-2 border-slate-200 pl-3">"{h.feedback}"</p>
                          )}
                        </div>
                      ))}
                      {(!examHistory[exam._id] || examHistory[exam._id].length === 0) && (
                        <div className="py-10 text-center space-y-3">
                          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                            <History size={24} />
                          </div>
                          <p className="text-xs text-slate-400 font-medium">No attempts recorded yet.</p>
                        </div>
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

export default Exams;
