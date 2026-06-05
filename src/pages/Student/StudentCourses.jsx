import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentDashboard } from '../../features/student/studentThunk';
import {
  MoreVertical,
  PlayCircle,
  Award,
  MessageCircle,
  Star,
  Users,
  ShieldCheck,
  BookOpen,
  Loader2,
<<<<<<< HEAD
  Lock,
  Download
=======
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCertificateDownloadUrl } from '../../services/certificateService';

const StudentCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
<<<<<<< HEAD
  const { dashboardData, loading } = useSelector((state) => state.student);
=======

  const { dashboardData, loading, error } = useSelector(
    (state) => state.student
  );
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)

  useEffect(() => {
    dispatch(fetchStudentDashboard());
  }, [dispatch]);

  // Get enrolled courses safely
  const enrolledCourses = dashboardData?.enrolledCourses || [];

  // Group courses by instructor
  const groupedInstructors = enrolledCourses.reduce((acc, enrollment) => {
    const course = enrollment?.course;

    if (!course) return acc;

    const instructor = course?.instructor;

    const instructorId = instructor?._id || 'unknown';

    if (!acc[instructorId]) {
      acc[instructorId] = {
        id: instructorId,
        name: instructor?.name || 'Learnify Instructor',
<<<<<<< HEAD
        avatar: instructor?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor?.name || 'Instructor')}&background=7c3aed&color=fff`,
        expertise: instructor?.verificationDetails?.expertise || 'Certified Instructor',
        rating: 4.8, // Fallback rating
        students: instructor?.studentsCount || 150,
        courses: []
=======
        avatar:
          instructor?.profileImage ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            instructor?.name || 'Instructor'
          )}&background=2563eb&color=fff`,
        expertise:
          instructor?.verificationDetails?.expertise ||
          'Certified Instructor',
        rating: instructor?.rating || 4.9,
        students: instructor?.students || 0,
        courses: [],
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
      };
    }

    acc[instructorId].courses.push({
<<<<<<< HEAD
      id: enrollment._id,
      courseId: course._id,
      title: course.title,
      thumbnail: course.thumbnail,
      progress: enrollment.progress || 0,
      completedLessons: enrollment.completedLessons || 0,
      totalLessons: course.lessonsCount || course.lessons?.length || 0,
      nextLesson: enrollment.nextLesson || 'Start Learning',
      status: enrollment.status || 'Active',
      completionStatus: enrollment.completionStatus,
      certificateId: enrollment.certificateId,
=======
      id: enrollment?._id,
      courseId: course?._id,
      title: course?.title || 'Untitled Course',
      thumbnail:
        course?.thumbnail ||
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
      progress: enrollment?.progress || 0,
      completedLessons: enrollment?.completedLessons || 0,
      totalLessons:
        course?.lessonsCount || course?.lessons?.length || 0,
      nextLesson: enrollment?.nextLesson || 'Start Learning',
      status: enrollment?.status || 'Active',
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
    });

    return acc;
  }, {});

  const instructors = Object.values(groupedInstructors);

  // Loading UI
  if (loading) {
    return (
<<<<<<< HEAD
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Fetching your courses...</p>
=======
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium">
          Loading your courses...
        </p>
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <h2 className="text-2xl font-bold text-red-500">
          Failed to Load Courses
        </h2>

        <p className="text-slate-500">{error}</p>

        <button
          onClick={() => dispatch(fetchStudentDashboard())}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty UI
  if (instructors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center p-6 animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-primary-50 rounded-[1.5rem] flex items-center justify-center text-primary-600 border border-primary-100/55 shadow-sm">
          <BookOpen size={36} />
        </div>
<<<<<<< HEAD
        <div className="max-w-md space-y-2">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">No Enrolled Courses</h3>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">You are not enrolled in any programs yet. Browse our list of curated masterclasses to get started.</p>
=======

        <div className="space-y-2 max-w-md">
          <h3 className="text-2xl font-bold text-slate-900">
            No Enrolled Courses
          </h3>

          <p className="text-slate-500">
            You haven’t enrolled in any courses yet.
          </p>
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
        </div>

        <button
          onClick={() => navigate('/student/buy-courses')}
<<<<<<< HEAD
          className="btn-primary px-8 py-3.5 text-xs uppercase tracking-wider rounded-xl shadow-md shadow-primary-600/5"
=======
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
        >
          Explore Courses
        </button>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="space-y-12 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Courses</h2>
        <p className="text-slate-500 text-sm font-medium mt-1">Manage your enrolled courses and track your progress across different instructors.</p>
=======
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">
          My Learning Journey
        </h2>

        <p className="text-slate-500 mt-1">
          Track your enrolled courses and progress.
        </p>
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
      </div>

      {/* Instructor Sections */}
      {instructors.map((instructor) => (
<<<<<<< HEAD
        <div key={instructor.id} className="space-y-6 border-b border-slate-100 pb-10 last:border-0 last:pb-0">
          {/* Instructor Header Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img src={instructor.avatar} alt={instructor.name} className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                <div className="absolute -bottom-1 -right-1 bg-primary-600 text-white p-1 rounded-lg border border-white shadow-sm">
                  <ShieldCheck size={12} />
=======
        <div key={instructor.id} className="space-y-6">
          {/* Instructor Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={instructor.avatar}
                  alt={instructor.name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-blue-50"
                />

                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-lg border-2 border-white">
                  <ShieldCheck size={16} />
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
                </div>
              </div>

              <div>
<<<<<<< HEAD
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">{instructor.name}</h3>
                  <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-[9px] font-black uppercase rounded-md border border-primary-100/50 tracking-wider">Expert</span>
                </div>
                <p className="text-slate-500 text-xs font-semibold mt-0.5">{instructor.expertise}</p>
                <div className="flex items-center gap-4 mt-2 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1"><Star size={13} className="text-yellow-500 fill-yellow-500" /> {instructor.rating}</span>
                  <span className="flex items-center gap-1"><Users size={13} className="text-slate-400" /> {instructor.students} Students</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <button 
                onClick={() => navigate('/student/messages')}
                className="flex-1 md:flex-none btn-primary py-2.5 px-6 text-xs uppercase tracking-wider rounded-xl shadow-md shadow-primary-600/5"
              >
                <MessageCircle size={14} />
                Chat
              </button>
              <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded-xl transition-all border border-slate-150">
                <MoreVertical size={16} />
=======
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold text-slate-900">
                    {instructor.name}
                  </h3>

                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded uppercase font-bold tracking-wider">
                    Expert Instructor
                  </span>
                </div>

                <p className="text-sm text-slate-500 mt-1">
                  {instructor.expertise}
                </p>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <Star
                      size={14}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    {instructor.rating}
                  </div>

                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <Users size={14} className="text-slate-400" />
                    {instructor.students} Students
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => navigate('/student/messages')}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
              >
                <MessageCircle size={18} />
                Message
              </button>

              <button className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition">
                <MoreVertical size={20} />
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
              </button>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {instructor.courses.map((course) => (
<<<<<<< HEAD
              <div key={course.id} className="bg-white rounded-2xl border border-slate-250/60 overflow-hidden shadow-sm flex flex-col sm:flex-row group hover:border-primary-300 transition-all duration-300">
                <div className="w-full sm:w-44 h-44 sm:h-auto relative overflow-hidden bg-slate-50 border-r border-slate-100 shrink-0">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-102" />
                  {course.completionStatus === 'completed' && (
                    <div className="absolute top-3 left-3 bg-emerald-500 text-white p-1 rounded-lg shadow-sm border border-emerald-400">
                      <Award size={14} />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 
                      onClick={() => navigate(`/student/player/${course.courseId}`)}
                      className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-primary-600 transition-colors cursor-pointer"
                    >
                      {course.title}
                    </h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <BookOpen size={12} className="text-slate-400" /> {course.completedLessons}/{course.totalLessons} Lessons Done
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-150">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Next up</p>
                      <p className="text-xs font-bold text-slate-700 truncate">{course.nextLesson}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                          <span>Progress</span>
                          <span className={course.progress === 100 ? 'text-emerald-600' : 'text-primary-600'}>{course.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-700 ${course.progress === 100 ? 'bg-emerald-500' : 'bg-primary-600'}`} 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate(`/student/player/${course.courseId}`)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 border ${
                          course.progress === 100 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50 hover:bg-emerald-600 hover:text-white' 
                          : 'bg-primary-50 text-primary-600 border-primary-100/50 hover:bg-primary-600 hover:text-white'
                        }`}
                      >
                        {course.progress === 100 ? <Award size={16} /> : <PlayCircle size={16} />}
                      </button>
                    </div>

                    {/* Certificate Status Section */}
                    <div className="pt-3 border-t border-slate-100">
                      {course.completionStatus === 'completed' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate('/student/certificates')}
                            className="flex-1 py-2 px-3 bg-primary-50 hover:bg-primary-100 text-primary-750 rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 border border-primary-100 transition-all"
                          >
                            <Award size={12} />
                            Certificate
                          </button>
                          {course.certificateId && (
                            <button
                              onClick={() => {
                                window.open(getCertificateDownloadUrl(course.certificateId), '_blank');
                              }}
                              className="py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 border border-slate-200 transition-all"
                            >
                              <Download size={12} />
                              Download
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="w-full py-2.5 px-3 bg-slate-50 text-slate-400 rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 border border-dashed border-slate-200 cursor-not-allowed">
                          <Lock size={12} />
                          Certificate Locked
                        </div>
                      )}
                    </div>
=======
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row hover:border-blue-300 transition-all group"
              >
                {/* Thumbnail */}
                <div className="w-full md:w-48 h-52 md:h-auto relative overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {course.progress === 100 && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white p-2 rounded-lg shadow-lg">
                      <Award size={16} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between space-y-5">
                  <div>
                    <h4
                      onClick={() =>
                        navigate(
                          `/student/course-player/${course.courseId}`
                        )
                      }
                      className="font-bold text-slate-900 line-clamp-2 cursor-pointer hover:text-blue-600 transition"
                    >
                      {course.title}
                    </h4>

                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                      <BookOpen size={12} />
                      {course.completedLessons}/{course.totalLessons} Lessons
                      Completed
                    </p>
                  </div>

                  {/* Next Lesson */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Next Lesson
                    </p>

                    <p className="text-sm font-semibold text-slate-700 mt-1">
                      {course.nextLesson}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs font-bold uppercase text-slate-500 mb-2">
                        <span>Progress</span>
                        <span>
                          {course.progress}%
                        </span>
                      </div>

                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            course.progress === 100
                              ? 'bg-green-500'
                              : 'bg-blue-600'
                          }`}
                          style={{
                            width: `${course.progress}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Continue Button */}
                    <button
                      onClick={() =>
                        navigate(
                          `/student/course-player/${course.courseId}`
                        )
                      }
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                        course.progress === 100
                          ? 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                      }`}
                    >
                      {course.progress === 100 ? (
                        <Award size={20} />
                      ) : (
                        <PlayCircle size={20} />
                      )}
                    </button>
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
                  </div>
                </div>
              </div>
            ))}
          </div>
<<<<<<< HEAD
=======

          {/* Footer Note */}
          <div className="flex items-center gap-2 px-5 py-3 bg-blue-50 rounded-2xl border border-dashed border-blue-200">
            <ShieldCheck size={16} className="text-blue-600" />

            <p className="text-xs text-blue-700 font-medium">
              You have access to chat, live sessions, and resources from{' '}
              {instructor.name}.
            </p>
          </div>
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
        </div>
      ))}
    </div>
  );
};

<<<<<<< HEAD
export default StudentCourses;
=======
export default StudentCourses;
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
