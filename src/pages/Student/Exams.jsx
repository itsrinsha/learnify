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
        <h2 className="text-2xl font-bold text-slate-900">Assessment Center</h2>
        <p className="text-slate-500 mt-1">Track your course exams, attempt history, and official results.</p>
      </div>

      <div className="grid gap-8">
        {exams.length === 0 ? (
          <div className="card border-dashed p-20 text-center flex flex-col items-center gap-4 bg-slate-50">
            <FileText size={48} className="text-slate-200" />
            <p className="text-slate-500 font-medium italic">No assessments scheduled for your courses yet.</p>
          </div>
        ) : (
          exams.map((exam) => {
            const isFailed = exam.latestResult === 'fail' && exam.attemptCount >= exam.maxAttempts;
            const isPassed = exam.latestResult === 'pass';
            
            return (
              <div key={exam._id} className={`card ${isFailed ? 'border-error-500 bg-error-50/10' : ''}`}>
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row justify-between gap-6 bg-slate-50/50">
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded flex items-center justify-center ${
                      isPassed ? 'bg-success-500 text-white' : 
                      isFailed ? 'bg-error-500 text-white' : 
                      'bg-primary-600 text-white'
                    }`}>
                      <FileText size={24} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-900">{exam.course?.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1.5"><User size={14} /> {exam.instructor?.name}</span>
                        <span className="flex items-center gap-1.5 text-primary-600">
                          <Calendar size={14} /> 
                          {new Date(exam.scheduledDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {exam.duration}m</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="px-3 py-1 bg-white rounded border border-slate-200 text-[11px] font-bold uppercase tracking-wider">
                      <span className="text-slate-500">Attempts: </span>
                      <span className={exam.attemptCount >= exam.maxAttempts ? 'text-error-500' : 'text-slate-900'}>
                        {exam.attemptCount}/{exam.maxAttempts}
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded text-[11px] font-bold border uppercase tracking-wider ${
                      isPassed ? 'bg-success-50 text-success-500 border-success-500' : 
                      isFailed ? 'bg-error-50 text-error-500 border-error-500' : 
                      'bg-warning-50 text-warning-500 border-warning-500'
                    }`}>
                      {isPassed ? 'Passed' : isFailed ? 'Failed' : exam.status}
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                  {/* Left Side: Info & Topics */}
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        Exam Topics
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {exam.topics?.map((topic, i) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded border border-slate-200 uppercase">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-primary-50 rounded border border-primary-100 flex items-start gap-3">
                      <LinkIcon size={16} className="text-primary-600 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-bold text-primary-900 underline cursor-pointer">
                          {exam.attachment ? 'Review Guidelines.pdf' : 'No material attached'}
                        </h5>
                        <p className="text-[10px] text-primary-700 mt-1">Please review the material before starting.</p>
                      </div>
                    </div>

                    {exam.attemptCount < exam.maxAttempts && !isPassed && (
                      <button 
                        onClick={() => {/* logic to start exam */}}
                        className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
                      >
                        Start Assessment
                        <ChevronRight size={16} />
                      </button>
                    )}
                    {isFailed && (
                      <div className="space-y-4">
                        <div className="p-3 bg-error-50 text-error-500 rounded text-[11px] font-bold flex items-center gap-2 border border-error-500">
                          <AlertTriangle size={14} /> All attempts used.
                        </div>
                        <button className="w-full py-3 bg-white text-error-500 border border-error-500 rounded font-bold text-sm hover:bg-error-50 transition-colors flex items-center justify-center gap-2">
                          Request Extra Attempt
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right Side: History */}
                  <div className="p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        Recent Attempts
                      </h4>
                      <button 
                        onClick={() => fetchHistory(exam._id)}
                        className="text-xs font-bold text-primary-600 hover:text-primary-700"
                      >
                        Refresh
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {examHistory[exam._id]?.map((h) => (
                        <div key={h._id} className="p-3 rounded border border-slate-100 hover:border-primary-100 bg-slate-50/30 transition-all group">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-[10px] ${
                                h.result === 'pass' ? 'bg-success-50 text-success-500 border border-success-500' : 'bg-error-50 text-error-500 border border-error-500'
                              }`}>
                                #{h.attemptNumber}
                              </div>
                              <div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                  h.result === 'pass' ? 'text-success-500' : 'text-error-500'
                                }`}>
                                  {h.result} • {h.score}%
                                </span>
                                <p className="text-[10px] text-slate-400 font-semibold">
                                  {new Date(h.attemptedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            {h.result === 'pass' ? <CheckCircle2 size={14} className="text-success-500" /> : <XCircle size={14} className="text-error-500" />}
                          </div>
                        </div>
                      ))}
                      {(!examHistory[exam._id] || examHistory[exam._id].length === 0) && (
                        <div className="py-8 text-center space-y-2">
                          <History size={32} className="mx-auto text-slate-100" />
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No history found</p>
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
