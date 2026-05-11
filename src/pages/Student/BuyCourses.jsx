import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses, fetchEnrolledCourses, verifyPaymentAndEnroll } from '../../features/courses/courseThunk';
import paymentService from "../../services/paymentService";
import { 
  Star, 
  Users, 
  Clock, 
  BookOpen, 
  ShieldCheck, 
  ShoppingBag,
  X,
  CreditCard,
  ChevronRight,
  Info,
  Loader2,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BuyCourses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courses, loading, error, enrolledCourses } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCourses());
    if (enrolledCourses.length === 0) {
      dispatch(fetchEnrolledCourses());
    }
  }, [dispatch]);

  // Check if student is already enrolled in a specific course
  const checkEnrollment = (courseId) => {
    return enrolledCourses?.some(item => 
      (item._id === courseId) || (item.course?._id === courseId) || (item.course === courseId)
    );
  };

  const handleRazorpayPayment = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Create Order
      const data = await paymentService.createOrder(selectedCourse._id);
      
      if (!data.success) {
        throw new Error(data.message || "Failed to initiate payment");
      }

      // 2. Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "Learnify",
        description: `Enrollment: ${selectedCourse.title}`,
        image: selectedCourse.thumbnail || "https://ui-avatars.com/api/?name=L&background=2563eb&color=fff",
        order_id: data.order.id,
        handler: async function (response) {
          try {
            setIsProcessing(true);
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: selectedCourse._id,
            };

            // 3. Verify on backend
            const result = await dispatch(verifyPaymentAndEnroll(verifyData)).unwrap();

            if (result.success) {
              alert("Payment Successful! Welcome to the course.");
              setShowPayment(false);
              navigate("/student/courses");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert(error || "Payment verification failed.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || ""
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", function (response) {
        alert("Payment failed: " + response.error.description);
        setIsProcessing(false);
      });

    } catch (error) {
      console.error("Checkout error:", error);
      alert(error || "Something went wrong during checkout.");
    } finally {
      // We don't set processing false here because Razorpay modal might still be open
      // or verification might be happening in the handler
    }
  };

  // Group courses by instructor
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
        <p className="text-slate-500 font-medium tracking-wide">Curating the best courses for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="bg-red-50 p-10 rounded-[2.5rem] border border-red-100 text-center max-w-md shadow-xl">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Info size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Unable to load courses</h3>
          <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>
          <button 
            onClick={() => dispatch(fetchAllCourses())}
            className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-2xl active:scale-95 transition-all"
          >
            Refresh Content
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-24">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Expand Your Knowledge</h2>
          <p className="text-slate-500 text-lg font-medium">Join 50,000+ students learning from industry leaders.</p>
        </div>
        <div className="flex bg-white p-2 rounded-[1.5rem] border border-slate-200 shadow-sm">
          {['All Courses', 'Popular', 'Newest'].map((tab, i) => (
            <button 
              key={tab} 
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {availableInstructors.map((instructor) => (
        <div key={instructor.id} className="space-y-10">
          {/* Instructor Header */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full -mr-24 -mt-24 opacity-40 blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
            
            <div className="relative">
              <img src={instructor.avatar} alt={instructor.name} className="w-28 h-28 rounded-[2rem] object-cover border-4 border-white shadow-2xl relative z-10" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white border-4 border-white shadow-lg z-20">
                <CheckCircle2 size={16} />
              </div>
            </div>

            <div className="flex-1 space-y-6 relative z-10 text-center md:text-left">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{instructor.name}</h3>
                <p className="text-blue-600 font-black text-xs tracking-[0.2em] uppercase mt-2">{instructor.expertise}</p>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600 shadow-sm">
                    <Star size={18} fill="currentColor" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Rating</p>
                    <p className="text-sm font-black text-slate-900">{instructor.rating} / 5.0</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                    <Users size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Students</p>
                    <p className="text-sm font-black text-slate-900">{instructor.students.toLocaleString()}</p>
                  </div>
                </div>

                <div className="hidden lg:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shadow-sm">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Identity</p>
                    <p className="text-sm font-black text-slate-900">Verified Expert</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate(`/instructor/${instructor.id}`)}
              className="px-8 py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95"
            >
              View Profile
            </button>
          </div>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {instructor.courses.map((course) => {
              const enrolled = checkEnrollment(course._id);
              
              return (
                <div key={course._id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all group flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-blue-600 shadow-2xl text-xl">
                      ₹{course.price?.toLocaleString()}
                    </div>
                    {enrolled && (
                      <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="bg-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2">
                          <CheckCircle2 size={18} className="text-green-600" />
                          <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Already Enrolled</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-8 space-y-8 flex-1 flex flex-col">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                          {course.category || 'Skill'}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                          <Star size={14} className="text-yellow-400 fill-yellow-400" />
                          <span>{course.rating || 4.5}</span>
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 leading-tight line-clamp-2 h-14 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                          <Clock size={14} />
                        </div>
                        <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">{course.duration || '8h 30m'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                          <BookOpen size={14} />
                        </div>
                        <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">{course.lessonsCount || 12} Lessons</span>
                      </div>
                    </div>

                    <div className="pt-4 mt-auto border-t border-slate-100">
                      {enrolled ? (
                        <button 
                          onClick={() => navigate('/student/courses')}
                          className="w-full py-4 bg-green-50 text-green-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                        >
                          <ChevronRight size={18} />
                          Go To My Courses
                        </button>
                      ) : (
                        <div className="flex gap-3">
                          <button 
                            onClick={() => navigate(`/course-details/${course._id}`)}
                            className="flex-1 py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 border border-slate-100"
                          >
                            Details
                          </button>
                          <button 
                            onClick={() => handleBuyClick(course, instructor)}
                            className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-blue-100"
                          >
                            <ShoppingBag size={18} />
                            Enroll Now
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Payment Modal */}
      {showPayment && selectedCourse && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => !isProcessing && setShowPayment(false)}></div>
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200">
                  <CreditCard size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Checkout</h3>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Secure Transaction</p>
                </div>
              </div>
              {!isProcessing && (
                <button onClick={() => setShowPayment(false)} className="p-3 hover:bg-slate-200 rounded-2xl transition-all">
                  <X size={24} className="text-slate-400" />
                </button>
              )}
            </div>

            <div className="p-10 overflow-y-auto space-y-10">
              {/* Order Summary */}
              <div className="space-y-6">
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
                  <Info size={16} className="text-blue-600" />
                  Order Summary
                </h4>
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
                  <div className="flex items-center gap-6">
                    <img src={selectedCourse.thumbnail} alt={selectedCourse.title} className="w-24 h-24 rounded-2xl object-cover shadow-lg" />
                    <div className="space-y-1">
                      <h5 className="font-bold text-slate-900 text-lg leading-tight">{selectedCourse.title}</h5>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Instructor: {selectedCourse.instructorName}</p>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-200 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-bold">Course Price</span>
                      <span className="font-black text-slate-900">₹{selectedCourse.price?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-bold">Platform Fees</span>
                      <span className="text-green-600 font-black">FREE</span>
                    </div>
                    <div className="flex justify-between text-2xl pt-6 border-t border-slate-200 border-dashed">
                      <span className="font-black text-slate-900 tracking-tighter">Total</span>
                      <span className="font-black text-blue-600 tracking-tighter">
                        ₹{selectedCourse.price?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secure Trust */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex flex-col items-center gap-2">
                  <ShieldCheck className="text-blue-600" size={24} />
                  <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Secure Payment</span>
                </div>
                <div className="p-5 bg-green-50/50 rounded-2xl border border-green-100 flex flex-col items-center gap-2">
                  <CheckCircle2 className="text-green-600" size={24} />
                  <span className="text-[10px] font-black text-green-900 uppercase tracking-widest">Instant Access</span>
                </div>
              </div>

              <div className="p-6 bg-yellow-50 rounded-[1.5rem] border border-yellow-100 space-y-2">
                <p className="text-[10px] font-black text-yellow-800 uppercase tracking-[0.2em]">Guaranteed Value</p>
                <p className="text-xs text-yellow-700 leading-relaxed italic font-medium">
                  Enroll with confidence. You'll get lifetime access to all course materials and future updates.
                </p>
              </div>
            </div>

            <div className="p-10 bg-slate-50 border-t border-slate-100">
              <button 
                className={`w-full py-6 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-[0.98] ${
                  isProcessing 
                    ? 'bg-slate-400 text-slate-100 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                }`}
                onClick={handleRazorpayPayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Pay Securely Now
                    <ChevronRight size={18} />
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
