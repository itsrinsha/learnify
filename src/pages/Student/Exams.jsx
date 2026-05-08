import React from 'react';
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
  BookOpen
} from 'lucide-react';

const Exams = () => {
  const exams = [
    {
      id: 1,
      courseName: 'Advanced React Patterns',
      instructorName: 'Sarah Jenkins',
      date: 'May 15, 2026',
      time: '10:00 AM - 12:00 PM',
      attemptsUsed: 1,
      maxAttempts: 3,
      status: 'Pending',
      topics: ['Compound Components', 'Render Props', 'Custom Hooks Optimization'],
      history: [
        { attempt: 1, date: 'May 10, 2026', result: 'Fail', score: '55%', remarks: 'Need focus on Hook memoization.', remaining: 2 }
      ]
    },
    {
      id: 2,
      courseName: 'UI/UX Design Masterclass',
      instructorName: 'Michael Scott',
      date: 'May 20, 2026',
      time: '02:00 PM - 04:00 PM',
      attemptsUsed: 3,
      maxAttempts: 3,
      status: 'Failed',
      topics: ['Accessibility', 'Design Systems', 'Micro-interactions'],
      history: [
        { attempt: 1, date: 'May 01, 2026', result: 'Fail', score: '40%', remarks: 'Weak design system knowledge.', remaining: 2 },
        { attempt: 2, date: 'May 05, 2026', result: 'Fail', score: '62%', remarks: 'Improved but missed accessibility goals.', remaining: 1 },
        { attempt: 3, date: 'May 12, 2026', result: 'Fail', score: '68%', remarks: 'Final attempt failed. Please re-enroll or contact instructor.', remaining: 0 }
      ]
    },
    {
      id: 3,
      courseName: 'Complete Web Development Bootcamp',
      instructorName: 'Dr. Angela Yu',
      date: 'Completed',
      time: '-',
      attemptsUsed: 2,
      maxAttempts: 3,
      status: 'Passed',
      topics: ['Frontend', 'Backend', 'Deployment'],
      history: [
        { attempt: 1, date: 'April 20, 2026', result: 'Fail', score: '65%', remarks: 'Database normalization missed.', remaining: 2 },
        { attempt: 2, date: 'April 25, 2026', result: 'Pass', score: '92%', remarks: 'Excellent grasp of full stack architecture.', remaining: 1 }
      ]
    }
  ];

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Reviews & Exams</h2>
        <p className="text-slate-500">Track your exam schedules, attempt history, and results for your purchased courses.</p>
      </div>

      <div className="grid gap-8">
        {exams.map((exam) => (
          <div key={exam.id} className={`bg-white rounded-3xl border ${exam.status === 'Failed' && exam.attemptsUsed >= 3 ? 'border-red-100 opacity-80' : 'border-slate-200'} shadow-sm overflow-hidden`}>
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex flex-col lg:flex-row justify-between gap-6 bg-slate-50/30">
              <div className="flex gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                  exam.status === 'Passed' ? 'bg-green-600 text-white shadow-green-100' : 
                  exam.status === 'Failed' ? 'bg-red-600 text-white shadow-red-100' : 
                  'bg-blue-600 text-white shadow-blue-100'
                }`}>
                  <FileText size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">{exam.courseName}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                    <span className="flex items-center gap-1.5"><User size={14} /> {exam.instructorName}</span>
                    <span className="flex items-center gap-1.5 text-blue-600"><Calendar size={14} /> {exam.date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {exam.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm">
                  <span className="text-slate-500">Attempts: </span>
                  <span className={`font-bold ${exam.attemptsUsed >= exam.maxAttempts ? 'text-red-600' : 'text-slate-900'}`}>
                    {exam.attemptsUsed}/{exam.maxAttempts}
                  </span>
                </div>
                <div className={`px-4 py-2 rounded-xl text-sm font-bold border ${
                  exam.status === 'Passed' ? 'bg-green-50 text-green-700 border-green-100' : 
                  exam.status === 'Failed' ? 'bg-red-50 text-red-700 border-red-100' : 
                  'bg-yellow-50 text-yellow-700 border-yellow-100'
                }`}>
                  {exam.status}
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
                    {exam.topics.map((topic, i) => (
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
                      <h5 className="text-sm font-bold text-blue-900 underline cursor-pointer">View Review Guidelines & Material.pdf</h5>
                      <p className="text-xs text-blue-700 mt-1">Please download and review before your attempt.</p>
                    </div>
                  </div>
                </div>

                {exam.attemptsUsed < exam.maxAttempts && exam.status !== 'Passed' && (
                  <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200">
                    Start Next Attempt
                    <ChevronRight size={18} />
                  </button>
                )}
                {exam.attemptsUsed >= exam.maxAttempts && exam.status === 'Failed' && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs font-bold flex items-center gap-2 border border-red-100">
                    <XCircle size={16} /> All attempts used. Please contact instructor for re-assessment.
                  </div>
                )}
              </div>

              {/* Right Side: History */}
              <div className="p-8 space-y-6">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <History size={18} className="text-blue-600" />
                  Attempt History
                </h4>
                <div className="space-y-4">
                  {exam.history.map((h, i) => (
                    <div key={i} className="p-4 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-sm transition-all group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            h.result === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            #{h.attempt}
                          </div>
                          <div>
                            <span className={`text-xs font-bold uppercase tracking-wider ${
                              h.result === 'Pass' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {h.result} • {h.score}
                            </span>
                            <p className="text-[10px] text-slate-500 font-medium">{h.date}</p>
                          </div>
                        </div>
                        {h.result === 'Pass' ? <CheckCircle2 size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-400" />}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic border-l-2 border-slate-200 pl-3">"{h.remarks}"</p>
                    </div>
                  ))}
                  {exam.history.length === 0 && (
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
        ))}
      </div>
    </div>
  );
};

export default Exams;
