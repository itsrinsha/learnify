import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses, enrollInCourse } from '../../features/courses/courseThunk';
import { 
  Star, 
  Users, 
  Clock, 
  BookOpen, 
  Video, 
  FileText, 
  ShieldCheck, 
  ShoppingBag,
  X,
  CreditCard,
  ChevronRight,
  Info,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BuyCourses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courses, loading, error } = useSelector((state) => state.courses);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  const handleEnrollment = async () => {
    setIsProcessing(true);
    try {
      await dispatch(enrollInCourse(selectedCourse._id)).unwrap();
      alert('Congratulations! You have successfully enrolled in the course.');
      setShowPayment(false);
      navigate('/student/courses');
    } catch (err) {
      alert(err || 'Failed to enroll in the course. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Group courses by instructor for the current UI design
  const instructors = Array.isArray(courses) ? courses.reduce((acc, course) => {
    const instructorId = course.instructor?._id;
    if (!instructorId) return acc;
    
    if (!acc[instructorId]) {
      acc[instructorId] = {
        id: instructorId,
        name: course.instructor?.name || 'Expert Instructor',
        avatar: course.instructor?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor?.name || 'I')}&background=2563eb&color=fff`,
        expertise: course.instructor?.verificationDetails?.expertise || 'Certified Instructor',
        rating: 4.9, 
        students: course.instructor?.studentsCount || 0,
        courses: []
      };
    }
    acc[instructorId].courses.push(course);
    return acc;
  }, {}) : {};

  const availableInstructors = Object.values(instructors);

  const handleBuyClick = (course, instructor) => {
    setSelectedCourse({ ...course, instructorName: instructor.name });
    setShowPayment(true);
  };

  if (loading && courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading amazing courses for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="bg-red-50 p-6 rounded-3xl border border-red-100 text-center">
          <p className="text-red-600 font-bold">Error loading courses</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
          <button 
            onClick={() => dispatch(fetchAllCourses())}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 text-center max-w-md">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200">
            <BookOpen size={40} className="text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">No Courses Found</h3>
          <p className="text-slate-500 mt-2">We couldn't find any courses matching your criteria. Check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Explore New Skills</h2>
          <p className="text-slate-500 mt-2 text-lg">Browse courses from top industry experts and start your next chapter.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md">All Courses</button>
          <button className="px-6 py-2.5 text-slate-500 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">Featured</button>
          <button className="px-6 py-2.5 text-slate-500 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">Trending</button>
        </div>
      </div>

      {availableInstructors.map((instructor) => (
        <div key={instructor.id} className="space-y-8">
          {/* Instructor Header */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl"></div>
            <img src={instructor.avatar} alt={instructor.name} className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-xl relative z-10" />
            <div className="flex-1 space-y-4 relative z-10 text-center md:text-left">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{instructor.name}</h3>
                <p className="text-blue-600 font-bold text-sm tracking-wide uppercase mt-1">{instructor.expertise}</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
                    <Star size={16} fill="currentColor" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{instructor.rating} Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Users size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{instructor.students} Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                    <ShieldCheck size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Verified Expert</span>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructor.courses.map((course) => (
              <div key={course._id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-300 transition-all group flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl font-black text-blue-600 shadow-lg text-lg">
                    ₹{course.price?.toLocaleString()}
                  </div>
                </div>
                <div className="p-6 space-y-6 flex-1 flex flex-col">
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 h-14 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span>{course.rating || 4.5}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock size={16} className="text-slate-400" />
                      <span className="text-xs font-medium">{course.duration || '0h'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <BookOpen size={16} className="text-slate-400" />
                      <span className="text-xs font-medium">{course.lessonsCount || course.lessons?.length || 0} Lessons</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {course.category && (
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100 flex items-center gap-1">
                        {course.category.toUpperCase()}
                      </span>
                    )}
                    {course.level && (
                      <span className="px-2.5 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-lg border border-purple-100 flex items-center gap-1">
                        {course.level.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="pt-6 mt-auto">
                    <button 
                      onClick={() => handleBuyClick(course, instructor)}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-slate-200"
                    >
                      <ShoppingBag size={18} />
                      Enroll & Pay Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Payment Modal */}
      {showPayment && selectedCourse && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowPayment(false)}></div>
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Secure Checkout</h3>
                  <p className="text-slate-500 text-sm">Order ID: #LRN-{Math.floor(10000 + Math.random() * 90000)}</p>
                </div>
              </div>
              <button onClick={() => setShowPayment(false)} className="p-2 hover:bg-slate-200 rounded-full transition-all">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              {/* Order Summary */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Info size={18} className="text-blue-600" />
                  Order Summary
                </h4>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                  <div className="flex items-center gap-4">
                    <img src={selectedCourse.thumbnail} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">{selectedCourse.title}</h5>
                      <p className="text-xs text-slate-500 mt-1">Instructor: {selectedCourse.instructorName}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Course Amount</span>
                      <span className="font-bold text-slate-900">₹{selectedCourse.price?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Platform Fee (GST)</span>
                      <span className="font-bold text-slate-900">₹99</span>
                    </div>
                    <div className="flex justify-between text-lg pt-2 border-t border-slate-200 border-dashed">
                      <span className="font-bold text-slate-900">Total Payable</span>
                      <span className="font-black text-blue-600">
                        ₹{(selectedCourse.price + 99).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900">Payment Method</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border-2 border-blue-600 bg-blue-50 rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition-all">
                    <CreditCard className="text-blue-600" />
                    <span className="text-xs font-bold text-blue-600">Card / UPI</span>
                  </div>
                  <div className="p-4 border-2 border-slate-100 bg-white rounded-2xl flex flex-col items-center gap-2 opacity-50 cursor-not-allowed">
                    <ShoppingBag className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-400">Net Banking</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                <p className="text-[10px] font-bold text-yellow-800 leading-relaxed uppercase tracking-widest mb-1">Important Note</p>
                <p className="text-xs text-yellow-700 leading-relaxed italic">
                  Payments are processed by Learnify. Funds are held securely and released to instructors only after verification of course delivery.
                </p>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100">
              <button 
                className={`w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                  isProcessing 
                    ? 'bg-slate-400 text-slate-100 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                }`}
                onClick={handleEnrollment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm & Pay Now
                    <ChevronRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyCourses;
