import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Users, 
  Star, 
  Video, 
  Edit3, 
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Eye,
  BookOpen,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchInstructorDashboard } from '../../features/instructor/instructorThunk';

const MyCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dashboardData, loading, error } = useSelector((state) => state.instructor);

  useEffect(() => {
    dispatch(fetchInstructorDashboard());
  }, [dispatch]);

  const courses = dashboardData?.courses || [];

  if (loading && courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading your course catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Course Catalog</h2>
          <p className="text-slate-500 mt-1 font-medium">Manage your courses, track approvals, and update your content.</p>
        </div>
        <button 
          onClick={() => navigate('/instructor/add-course')}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3 active:scale-95"
        >
          <Plus size={20} />
          Create New Course
        </button>
      </div>

      {/* Filters & Search Placeholder */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search your courses..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
          />
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
            <Filter size={18} />
            Filters
          </button>
        </div>
      </div>

      {/* Course List */}
      <div className="grid gap-8">
        {courses.length > 0 ? courses.map((course) => (
          <div key={course._id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all group">
            <div className="flex flex-col lg:flex-row">
              {/* Thumbnail Area */}
              <div className="lg:w-80 h-64 lg:h-auto relative overflow-hidden flex-shrink-0">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    course.status === 'published' ? 'bg-green-500' : 
                    course.status === 'draft' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{course.status === 'published' ? 'Approved' : 'Draft'}</span>
                </div>
              </div>

              {/* Info Area */}
              <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest">{course.category}</p>
                      <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => navigate(`/instructor/edit-course/${course._id}`)}>{course.title}</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-black text-slate-900">₹{course.price?.toLocaleString()}</p>
                      </div>
                      <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all border border-slate-100">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-8 py-6 border-y border-slate-50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Students</p>
                        <p className="text-sm font-black text-slate-900">{course.enrolledCount || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
                        <Star size={18} fill="currentColor" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating</p>
                        <p className="text-sm font-black text-slate-900">{course.rating || '4.9'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                        <Video size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lessons</p>
                        <p className="text-sm font-black text-slate-900">{course.lessonsCount || course.lessons?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-10 mt-auto">
                  <button 
                    onClick={() => navigate(`/instructor/edit-course/${course._id}`)}
                    className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-slate-100"
                  >
                    <Edit3 size={18} />
                    Edit Details
                  </button>
                  <button 
                    onClick={() => navigate(`/instructor/students/${course._id}`)}
                    className="w-full sm:w-auto px-6 py-3.5 bg-blue-50 text-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Users size={18} />
                    View Students
                  </button>
                  <div className="flex-1"></div>
                  <button className="text-slate-400 font-bold text-sm hover:text-red-500 flex items-center gap-2 p-3">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-300">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-6">
              <BookOpen size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No courses yet</h3>
            <p className="text-slate-500 mt-2">Start sharing your knowledge by creating your first course.</p>
            <button 
              onClick={() => navigate('/instructor/add-course')}
              className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100"
            >
              Create Course
            </button>
          </div>
        )}
      </div>

      {/* Stats Summary Footer */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full -mr-32 -mb-32 opacity-30 blur-3xl"></div>
        <div className="relative z-10 grid md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-2">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Total Courses</p>
            <h4 className="text-4xl font-black">{dashboardData?.stats?.totalCourses || 0}</h4>
          </div>
          <div className="space-y-2">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Total Students</p>
            <h4 className="text-4xl font-black">{dashboardData?.stats?.totalStudents || 0}</h4>
          </div>
          <div className="space-y-2">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Earnings</p>
            <h4 className="text-4xl font-black">₹{dashboardData?.stats?.totalEarnings || 0}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
