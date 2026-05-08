import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { clearSelectedCourse } from '../../features/courses/courseSlice';
import { fetchCourseById as fetchCourseThunk } from '../../features/courses/courseThunk';
import { 
  Star, 
  Users, 
  Clock, 
  BookOpen, 
  Video, 
  FileText, 
  Award, 
  ChevronRight,
  ShieldCheck,
  PlayCircle,
  CheckCircle2,
  Layers,
  Loader2
} from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedCourse: course, loading, error } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchCourseThunk(id));
    return () => dispatch(clearSelectedCourse());
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="bg-red-50 p-6 rounded-3xl border border-red-100 text-center">
          <p className="text-red-600 font-bold">Error loading course</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
          <button 
            onClick={() => dispatch(fetchCourseThunk(id))}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!course) return null;

  

  return (
    <div className="pb-20 space-y-10">
      <div className="relative rounded-[3rem] bg-slate-900 overflow-hidden text-white min-h-[500px] flex items-center">
        <div className="absolute top-0 right-0 w-1/2 h-full">
          <img src={course.thumbnail} className="w-full h-full object-cover opacity-40" alt="Course Hero" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-12 py-20 space-y-8 max-w-4xl">
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Bestseller</span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/20">{course.category || 'Course'}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black leading-tight">{course.title}</h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">{course.description}</p>
          
          <div className="flex flex-wrap items-center gap-8 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center text-yellow-400">
                <Star size={20} fill="currentColor" />
                <span className="ml-2 text-xl font-black">{course.rating || 4.5}</span>
              </div>
              <span className="text-slate-400 text-sm font-medium">({course.reviewsCount || 0} reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={20} className="text-slate-400" />
              <span className="text-slate-300 font-bold">{course.enrolledCount || 'Multiple'} students enrolled</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <img src={course.instructor?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor?.name || 'Instructor')}&background=2563eb&color=fff`} className="w-12 h-12 rounded-xl border-2 border-white/20 object-cover" alt="Instructor" />
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Instructor</p>
              <p className="text-base font-bold hover:text-blue-400 cursor-pointer transition-colors">{course.instructor?.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-12">
          {/* What you'll learn */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
            <h3 className="text-2xl font-bold text-slate-900">What you'll get in this course</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {course.features?.length > 0 ? (
                course.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={16} />
                    </div>
                    <p className="text-slate-600 font-medium">{feature}</p>
                  </div>
                ))
              ) : (
                ['Lifetime access', 'Certificate of completion', 'Expert guidance', 'Hands-on projects'].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={16} />
                    </div>
                    <p className="text-slate-600 font-medium">{feature}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Curriculum */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900">Course Curriculum</h3>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                {course.lessons?.length || 0} Lessons • {course.duration || '0h'}
              </p>
            </div>
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
              {course.lessons?.map((lesson, i) => (
                <div key={lesson._id || i} className="p-8 hover:bg-slate-50 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{lesson.title}</h4>
                        <p className="text-sm text-slate-500 font-medium mt-1">{lesson.duration || 'Video Lesson'}</p>
                      </div>
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:text-blue-600 transition-all group-hover:translate-x-1" size={24} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Purchase Card */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-2xl sticky top-24 space-y-8">
            <div className="relative aspect-video rounded-3xl overflow-hidden group">
              <img src={course.thumbnail} className="w-full h-full object-cover" alt="Preview" />
              <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center group-hover:bg-slate-900/20 transition-all cursor-pointer">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-2xl animate-pulse">
                  <PlayCircle size={32} fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-lg">
                Preview this course
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-slate-900">₹{course.price?.toLocaleString()}</span>
                <span className="text-xl text-slate-400 line-through font-bold">₹{(course.price * 1.5).toLocaleString()}</span>
                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-green-100">
                  33% OFF
                </span>
              </div>
              <p className="text-red-500 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <Clock size={14} /> Hurry! Offer ends soon.
              </p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => navigate(`/student/buy-courses?courseId=${course._id}`)}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                Enroll Now
                <ChevronRight size={20} />
              </button>
              <button className="w-full py-5 bg-slate-50 text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all border border-slate-100">
                Add to Wishlist
              </button>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h5 className="text-sm font-bold text-slate-900 uppercase tracking-widest">This course includes:</h5>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                  <Video size={18} className="text-blue-600" /> Full Lifetime Access
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                  <Layers size={18} className="text-blue-600" /> Access on mobile and TV
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                  <Award size={18} className="text-blue-600" /> Certificate of completion
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                  <FileText size={18} className="text-blue-600" /> 12 Assignments & Projects
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-2xl border border-dashed border-blue-200 text-center">
              <p className="text-xs font-bold text-blue-700 flex items-center justify-center gap-2">
                <ShieldCheck size={16} /> 30-Day Money-Back Guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
