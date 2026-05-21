import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Calendar,
  Zap,
  ArrowRight,
  Award
} from 'lucide-react';

const CourseProgress = ({ completedLessons, totalLessons, lastLessonTitle }) => {
  const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Animate number count
  useEffect(() => {
    let start = displayPercentage;
    const end = percentage;
    if (start === end) return;

    const duration = 1000;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      
      const current = Math.floor(start + (end - start) * easeProgress);
      setDisplayPercentage(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else if (current === 100) {
        setShowCelebration(true);
      }
    };

    requestAnimationFrame(update);
  }, [percentage]);

  const milestones = [
    { at: 25, label: 'Early Bird' },
    { at: 50, label: 'Halfway' },
    { at: 75, label: 'Expert' },
    { at: 100, label: 'Master' },
  ];

  return (
    <div className="space-y-6 relative">
      {/* Achievement Overlay on 100% */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 z-50 bg-blue-600 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-8 text-white shadow-2xl shadow-blue-200"
          >
            <motion.div 
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-white/20 p-6 rounded-full mb-4"
            >
              <Trophy size={64} fill="currentColor" />
            </motion.div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Course Completed!</h3>
            <p className="text-blue-100 font-bold mt-2 mb-6">You've mastered all 18 lessons.</p>
            <button 
              onClick={() => setShowCelebration(false)}
              className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
            >
              Claim Certificate
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 relative overflow-hidden group">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-blue-100/50"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Circular Progress */}
          <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-slate-50"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={440}
                initial={{ strokeDashoffset: 440 }}
                animate={{ strokeDashoffset: 440 - (440 * percentage) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-blue-600 stroke-round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">{displayPercentage}%</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mastery</span>
            </div>
          </div>

          {/* Stats & Info */}
          <div className="flex-1 space-y-6 w-full text-center md:text-left">
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-blue-600">
                <Zap size={16} fill="currentColor" />
                <span className="text-xs font-black uppercase tracking-widest">ahead of 72% of learners</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 leading-tight">Excellent progress!</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={14} className="text-slate-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Remaining</span>
                </div>
                <p className="text-lg font-black text-slate-700">4h 12m</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <Flame size={14} className="text-orange-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Streak</span>
                </div>
                <p className="text-lg font-black text-slate-700">5 Days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Timeline Bar */}
        <div className="space-y-6 pt-4 border-t border-slate-50">
          <div className="relative h-4 flex items-center">
            {/* Background Line */}
            <div className="absolute inset-x-0 h-1.5 bg-slate-100 rounded-full"></div>
            
            {/* Filled Line with Glow */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full scale-100 shadow-xl"></div>
            </motion.div>

            {/* Milestones */}
            {milestones.map((m) => (
              <div 
                key={m.at} 
                className="absolute top-1/2 -translate-y-1/2 group/m" 
                style={{ left: `${m.at}%` }}
              >
                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  percentage >= m.at ? 'bg-blue-600 scale-125' : 'bg-slate-200 group-hover/m:bg-blue-300'
                }`}></div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover/m:opacity-100 transition-all pointer-events-none">
                  <div className="bg-slate-900 text-white text-[8px] font-black uppercase px-2 py-1 rounded-lg whitespace-nowrap shadow-xl">
                    {m.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>{completedLessons} Lessons Mastered</span>
            <span>{totalLessons - completedLessons} To Go</span>
          </div>
        </div>

        {/* Continue Learning Section */}
        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex items-center justify-between group cursor-pointer hover:bg-blue-600 transition-all active:scale-95">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
              <PlayCircle size={24} fill="currentColor" />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest group-hover:text-blue-100">Continue Learning</p>
              <p className="text-sm font-black text-slate-900 group-hover:text-white transition-colors truncate max-w-[180px]">
                {lastLessonTitle || "Resume where you left off"}
              </p>
            </div>
          </div>
          <ArrowRight size={20} className="text-blue-400 group-hover:text-white transition-all transform group-hover:translate-x-1" />
        </div>
      </div>
      
      {/* Motivational Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consistency</p>
            <p className="text-sm font-black text-slate-900">Very High</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
            <Award size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</p>
            <p className="text-sm font-black text-slate-900">Top 10%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlayCircle = ({ size, fill }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" />
  </svg>
);

export default CourseProgress;
