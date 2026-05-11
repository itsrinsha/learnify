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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { dashboardData, loading, error } = useSelector(
    (state) => state.student
  );

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
      };
    }

    acc[instructorId].courses.push({
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
    });

    return acc;
  }, {});

  const instructors = Object.values(groupedInstructors);

  // Loading UI
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium">
          Loading your courses...
        </p>
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600">
          <BookOpen size={48} />
        </div>

        <div className="space-y-2 max-w-md">
          <h3 className="text-2xl font-bold text-slate-900">
            No Enrolled Courses
          </h3>

          <p className="text-slate-500">
            You haven’t enrolled in any courses yet.
          </p>
        </div>

        <button
          onClick={() => navigate('/student/buy-courses')}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
        >
          Explore Courses
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">
          My Learning Journey
        </h2>

        <p className="text-slate-500 mt-1">
          Track your enrolled courses and progress.
        </p>
      </div>

      {/* Instructor Sections */}
      {instructors.map((instructor) => (
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
                </div>
              </div>

              <div>
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
              </button>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {instructor.courses.map((course) => (
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
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="flex items-center gap-2 px-5 py-3 bg-blue-50 rounded-2xl border border-dashed border-blue-200">
            <ShieldCheck size={16} className="text-blue-600" />

            <p className="text-xs text-blue-700 font-medium">
              You have access to chat, live sessions, and resources from{' '}
              {instructor.name}.
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentCourses;