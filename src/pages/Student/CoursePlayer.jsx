import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCourseById as fetchCourseThunk } from '../../features/courses/courseThunk';
import VideoPlayer from '../../components/student/VideoPlayer';
import CourseProgress from '../../components/student/CourseProgress';
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  MessageCircle, 
  ChevronRight, 
  ChevronLeft,
  Clock,
  BookOpen,
  Loader2,
  Bookmark,
  Share2,
  FileText,
  PlayCircle,
  Trophy,
  User,
  MoreVertical,
  Layout,
  Circle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getCourseProgress, markLessonCompleted } from '../../services/progressService';
import axiosInstance from '../../features/axiosInstance';

const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedCourse, loading } = useSelector((state) => state.courses);
  
  const [expandedModule, setExpandedModule] = useState(0);
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progressLoading, setProgressLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchCourseThunk(id));
    fetchProgress();
  }, [dispatch, id]);

  const fetchProgress = async () => {
    try {
      setProgressLoading(true);
      const data = await getCourseProgress(id);
      if (data.success) {
        setCompletedLessons(data.progress.completedLessons || []);
      }
    } catch (err) {
      console.error("Failed to fetch progress:", err);
    } finally {
      setProgressLoading(false);
    }
  };

  const fetchMyInstructors = async () => {
    const response = await axiosInstance.get('/user/my-instructors');
    return response.data;
  };

  const openInstructorChatForCourse = async (courseId) => {
    try {
      const instructors = await fetchMyInstructors();
      const instructor = instructors.find(item => item.course._id === courseId);
      
      if (!instructor) {
        throw new Error('Instructor for this course not found');
      }

      navigate(`/student/messages?userId=${instructor._id}&name=${encodeURIComponent(instructor.name)}`);
    } catch (error) {
      toast.error(error.message || 'Failed to open instructor chat');
    }
  };

  const modules = selectedCourse?.modules || [];
  
  // Flatten all lessons from modules for easier navigation
  const allLessons = useMemo(() => {
    return modules.flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m._id })));
  }, [modules]);

  // Find current lesson or default to first
  const currentLesson = useMemo(() => {
    return allLessons.find((lesson) => lesson._id === currentLessonId) || allLessons[0] || null;
  }, [allLessons, currentLessonId]);

  useEffect(() => {
    if (currentLesson && !currentLessonId) {
      setCurrentLessonId(currentLesson._id);
      // Auto-expand the module containing the current lesson
      const mIdx = modules.findIndex(m => m._id === currentLesson.moduleId);
      if (mIdx !== -1) setExpandedModule(mIdx);
    }
  }, [currentLesson, currentLessonId, modules]);

  const handleLessonEnd = async () => {
    if (currentLesson && !completedLessons.includes(currentLesson._id)) {
      await handleToggleComplete(currentLesson._id);
    }
    
    const idx = allLessons.findIndex(l => l._id === currentLesson?._id);
    if (idx < allLessons.length - 1) {
      setCurrentLessonId(allLessons[idx + 1]._id);
      toast.success("Moving to next lesson...");
    } else {
      toast.success("Section completed!");
    }
  };

  const handleToggleComplete = async (lessonId) => {
    try {
      const data = await markLessonCompleted(id, lessonId);
      if (data.success) {
        setCompletedLessons(prev => 
          prev.includes(lessonId) ? prev.filter(id => id !== lessonId) : [...prev, lessonId]
        );
        toast.success(data.message || "Progress updated!");
      }
    } catch (err) {
      toast.error("Failed to update progress.");
    }
  };

  if (loading && !selectedCourse) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6 bg-slate-50">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
        <div className="text-center">
          <p className="text-slate-900 font-black text-xl">Entering Classroom</p>
          <p className="text-slate-500 font-medium">Syncing your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col transition-all duration-500 ${isTheaterMode ? 'pt-0' : 'pt-0'}`}>
      {/* Immersive Header (Floating) */}
      {!isTheaterMode && (
        <div className="absolute top-6 left-8 z-50">
          <button 
            onClick={() => navigate('/student/courses')}
            className="group flex items-center gap-3 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-200 shadow-xl hover:bg-slate-900 hover:text-white transition-all active:scale-95"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Back to Courses</span>
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className={`flex-1 flex flex-col lg:flex-row gap-6 max-w-[1920px] mx-auto w-full transition-all duration-500 ${isTheaterMode ? 'px-0' : 'px-4 lg:px-8'}`}>
        
        {/* Left Side: Video & Details */}
        <div className={`flex-1 flex flex-col transition-all duration-500 ${isTheaterMode ? 'w-full' : ''}`}>
          
          {/* Video Player Section */}
          <motion.div 
            layout
            className={`relative overflow-hidden bg-black transition-all duration-500 ease-in-out ${
              isTheaterMode 
                ? 'h-[80vh] w-full' 
                : 'rounded-[2rem] shadow-2xl border border-slate-200 aspect-video'
            }`}
          >
            <VideoPlayer 
              src={currentLesson?.videoUrl} 
              onEnded={handleLessonEnd}
              title={currentLesson?.title}
              isTheater={isTheaterMode}
              onToggleTheater={() => setIsTheaterMode(!isTheaterMode)}
            />
          </motion.div>

          {/* Lesson Header & Info */}
          <div className={`mt-8 space-y-8 transition-all duration-500 ${isTheaterMode ? 'px-8 pb-20' : 'pb-20'}`}>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-200">
                    Now Playing
                  </span>
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-tighter">
                    {selectedCourse?.title}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                  {currentLesson?.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-500">
                  <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                    <Clock size={16} className="text-blue-500" /> {currentLesson?.duration}
                  </span>
                  <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                    <BookOpen size={16} className="text-green-500" /> Lesson {allLessons.findIndex(l => l._id === currentLesson?._id) + 1} of {allLessons.length}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleToggleComplete(currentLesson?._id)}
                  className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95 ${
                    completedLessons.includes(currentLesson?._id)
                      ? 'bg-green-100 text-green-700 border border-green-200 shadow-green-100'
                      : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-slate-100'
                  }`}
                >
                  <CheckCircle2 size={18} className={completedLessons.includes(currentLesson?._id) ? 'text-green-600' : 'text-slate-300'} />
                  {completedLessons.includes(currentLesson?._id) ? 'Completed' : 'Mark as Done'}
                </button>
                <button className="p-4 bg-white text-slate-400 border border-slate-100 rounded-2xl hover:text-blue-600 transition-all active:scale-95 shadow-sm">
                  <Bookmark size={20} />
                </button>
                <button className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">
                  <Download size={18} /> Download
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 flex items-center gap-10 overflow-x-auto no-scrollbar">
              {['Overview', 'Notes', 'Resources'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                    activeTab === tab.toLowerCase() ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                  {activeTab === tab.toLowerCase() && (
                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900">About this lesson</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {currentLesson?.description || "In this lesson, we explore core concepts and practical applications of the topic."}
                  </p>
                </div>
              )}
              {activeTab === 'notes' && <div className="text-center py-10 text-slate-400 font-bold uppercase tracking-widest text-xs">Notes feature coming soon</div>}
              {activeTab === 'resources' && <div className="text-center py-10 text-slate-400 font-bold uppercase tracking-widest text-xs">No resources attached to this lesson</div>}
            </div>
          </div>
        </div>

        {/* Right Side: Sidebar - Lesson List */}
        <aside className={`transition-all duration-500 flex flex-col gap-6 ${
          isTheaterMode ? 'w-full lg:w-full mt-10 pb-20' : 'w-full lg:w-[450px] pb-20'
        }`}>
          
          <CourseProgress 
            completedLessons={completedLessons.length} 
            totalLessons={allLessons.length} 
            lastLessonTitle={allLessons.find(l => !completedLessons.includes(l._id))?.title || "Course Completed!"}
          />

          <div className={`flex-1 overflow-hidden flex flex-col bg-white rounded-[2.5rem] border border-slate-200 shadow-sm ${isTheaterMode ? 'max-h-none' : 'max-h-[800px]'}`}>
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {modules.map((module, mIdx) => (
                <div key={module._id} className="border-b border-slate-100 last:border-none">
                  <button 
                    onClick={() => setExpandedModule(expandedModule === mIdx ? null : mIdx)}
                    className={`w-full p-8 flex items-center justify-between transition-all ${
                      expandedModule === mIdx ? 'bg-slate-50/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-left space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg uppercase">Section {mIdx + 1}</span>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{module.title}</h4>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {module.lessons.length} Lessons • {module.duration}
                      </p>
                    </div>
                    <div className={`p-2 rounded-xl transition-all ${expandedModule === mIdx ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-300'}`}>
                      {expandedModule === mIdx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedModule === mIdx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-2">
                          {module.lessons.map((lesson) => {
                            const isCurrent = currentLesson?._id === lesson._id;
                            const isCompleted = completedLessons.includes(lesson._id);
                            
                            return (
                              <div key={lesson._id} className="relative">
                                <button 
                                  onClick={() => setCurrentLessonId(lesson._id)}
                                  className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all group ${
                                    isCurrent ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'hover:bg-slate-50'
                                  }`}
                                >
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                                    isCurrent ? 'bg-white/20' : isCompleted ? 'bg-green-50 text-green-500' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'
                                  }`}>
                                    {isCurrent ? (
                                      <motion.div 
                                        animate={{ scale: [1, 1.2, 1] }} 
                                        transition={{ repeat: Infinity, duration: 2 }}
                                      >
                                        <PlayCircle size={20} fill="white" />
                                      </motion.div>
                                    ) : isCompleted ? (
                                      <CheckCircle2 size={18} />
                                    ) : (
                                      <PlayCircle size={18} />
                                    )}
                                  </div>
                                  
                                  <div className="text-left flex-1 min-w-0">
                                    <p className={`text-xs font-black truncate uppercase tracking-tight ${
                                      isCurrent ? 'text-white' : isCompleted ? 'text-slate-400' : 'text-slate-900'
                                    }`}>
                                      {lesson.title}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1">
                                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                        isCurrent ? 'text-blue-100' : 'text-slate-400'
                                      }`}>
                                        {lesson.duration}
                                      </span>
                                      {isCurrent && (
                                        <span className="text-[8px] font-black text-white bg-white/20 px-1.5 py-0.5 rounded uppercase tracking-widest animate-pulse">Playing</span>
                                      )}
                                    </div>
                                  </div>
                                </button>
                                
                                {/* Completion Toggle Icon */}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleComplete(lesson._id);
                                  }}
                                  className={`absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                                    isCurrent ? 'text-white/40 hover:text-white' : 'text-slate-200 hover:text-green-500'
                                  }`}
                                >
                                  {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="p-8 bg-slate-50/50 border-t border-slate-100">
              <button 
                onClick={() => openInstructorChatForCourse(id)}
                className="w-full py-4 bg-white text-slate-900 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-200 flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                Discuss with Instructor
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CoursePlayer;
