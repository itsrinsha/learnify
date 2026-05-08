import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchCourseById as fetchCourseThunk } from '../../features/courses/courseThunk';
import { 
  Play, 
  CheckCircle2, 
  Lock, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  MessageCircle, 
  ChevronRight, 
  ChevronLeft,
  Settings,
  Maximize2,
  Volume2,
  Clock,
  BookOpen,
  FileText,
  Loader2
} from 'lucide-react';

const CoursePlayer = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedCourse, loading, error } = useSelector((state) => state.courses);
  
  const [currentLesson, setCurrentLesson] = useState(null);
  const [expandedModule, setExpandedModule] = useState(0);

  useEffect(() => {
    dispatch(fetchCourseThunk(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedCourse?.lessons?.length > 0 && !currentLesson) {
      setCurrentLesson(selectedCourse.lessons[0]);
    }
  }, [selectedCourse, currentLesson]);

  if (loading && !selectedCourse) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 bg-white rounded-[2.5rem]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading your classroom...</p>
      </div>
    );
  }

  // Group lessons into modules (for now, we'll treat all lessons as one module if not structured)
  const modules = [
    {
      id: 1,
      title: 'Course Content',
      duration: selectedCourse?.duration || 'Unknown',
      lessons: selectedCourse?.lessons?.map((l, idx) => ({
        id: l._id || idx,
        title: l.title,
        duration: l.duration || '00:00',
        status: currentLesson?._id === l._id ? 'current' : 'pending',
        videoUrl: l.videoUrl
      })) || []
    }
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
      {/* Video Area */}
      <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
        <div className="flex-1 relative group bg-black flex items-center justify-center">
          {/* Main Video Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-all z-10 p-8 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <h2 className="text-white font-bold">{currentLesson?.title || 'Select a lesson'}</h2>
              <button className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 transition-all">
                <Settings size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-white">
                <button className="p-4 bg-blue-600 rounded-full hover:scale-110 transition-transform">
                  <Play size={24} fill="currentColor" />
                </button>
                <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-0"></div>
                </div>
                <span className="text-xs font-bold">00:00 / {currentLesson?.duration || '00:00'}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <button className="text-white hover:text-blue-400 transition-colors"><Volume2 size={20} /></button>
                </div>
                <button className="text-white hover:text-blue-400 transition-colors"><Maximize2 size={20} /></button>
              </div>
            </div>
          </div>
          <img 
            src={selectedCourse?.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80"} 
            className="w-full h-full object-cover opacity-40" 
            alt="Video Placeholder" 
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl animate-pulse">
              <Play size={40} fill="currentColor" className="ml-1" />
            </div>
          </div>
        </div>

        {/* Video Bottom Info */}
        <div className="bg-white p-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{currentLesson?.title}</h1>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100">Now Playing</span>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-1.5"><Clock size={16} /> {currentLesson?.duration} Duration</span>
              <span className="flex items-center gap-1.5"><BookOpen size={16} /> {selectedCourse?.title}</span>
              <button className="text-blue-600 font-bold hover:underline flex items-center gap-1.5">
                <Download size={16} /> Resources (0)
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                const idx = selectedCourse?.lessons?.findIndex(l => l._id === currentLesson?._id);
                if (idx > 0) setCurrentLesson(selectedCourse.lessons[idx - 1]);
              }}
              disabled={!selectedCourse?.lessons || selectedCourse.lessons.indexOf(currentLesson) === 0}
              className="px-6 py-3 bg-slate-50 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-100 disabled:opacity-50 transition-all flex items-center gap-2 border border-slate-100"
            >
              <ChevronLeft size={18} /> Previous
            </button>
            <button 
              onClick={() => {
                const idx = selectedCourse?.lessons?.findIndex(l => l._id === currentLesson?._id);
                if (idx < selectedCourse.lessons.length - 1) setCurrentLesson(selectedCourse.lessons[idx + 1]);
              }}
              disabled={!selectedCourse?.lessons || selectedCourse.lessons.indexOf(currentLesson) === selectedCourse.lessons.length - 1}
              className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xl shadow-blue-100 flex items-center gap-2"
            >
              Next Lesson <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar - Lesson List */}
      <aside className="w-full lg:w-96 border-l border-slate-100 flex flex-col bg-slate-50/30 overflow-hidden">
        <div className="p-6 bg-white border-b border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Course Content</h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">65% Done</span>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Progress</span>
              <span>12/18 Lessons</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {modules.map((module) => (
            <div key={module.id} className="bg-white">
              <button 
                onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-all"
              >
                <div className="text-left">
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">{module.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-1">{module.duration} • {module.lessons.length} Lessons</p>
                </div>
                {expandedModule === module.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
              </button>

              {expandedModule === module.id && (
                <div className="bg-slate-50/50">
                  {module.lessons.map((lesson) => (
                    <div 
                      key={lesson.id} 
                      onClick={() => {
                        const realLesson = selectedCourse.lessons.find(l => l._id === (lesson.id === lesson.title ? l.title : lesson.id)); 
                        // Wait, lesson.id is l._id or idx.
                        const target = selectedCourse.lessons.find(l => l._id === lesson.id);
                        if (target) setCurrentLesson(target);
                      }}
                      className={`p-4 pl-12 flex items-center gap-4 cursor-pointer hover:bg-blue-50/50 transition-all relative ${
                        currentLesson?._id === lesson.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                      }`}
                    >
                      {lesson.status === 'completed' && <CheckCircle2 size={18} className="text-green-500" />}
                      {currentLesson?._id === lesson.id ? (
                        <Play size={18} className="text-blue-600 fill-blue-600" />
                      ) : (
                        <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300"></div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${
                          currentLesson?._id === lesson.id ? 'text-blue-600' : 'text-slate-700'
                        }`}>
                          {lesson.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            <Clock size={10} /> {lesson.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="p-6 bg-white border-t border-slate-100">
          <button className="w-full py-4 bg-slate-50 text-slate-700 rounded-2xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 border border-slate-100">
            <MessageCircle size={16} />
            Discuss with Instructor
          </button>
        </div>
      </aside>
    </div>
  );
};

export default CoursePlayer;
