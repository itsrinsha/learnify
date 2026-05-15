import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
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
import paymentService from '../../services/paymentService';

const BuyCourses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courses, loading, error } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  const handleEnrollment = async () => {
    setIsProcessing(true);
    const loadingToast = toast.loading("Initializing payment...");
    try {
      // 1. Create order on backend
      const orderData = await paymentService.createOrder(selectedCourse._id);
      
      toast.dismiss(loadingToast);
      const { order, course } = orderData;

      // 2. Initialize Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Learnify",
        description: `Enrolling in ${course.title}`,
        image: "https://learnify.com/logo.png",
        order_id: order.id,
        handler: async (response) => {
          try {
            // 3. Verify payment on backend
            const verification = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: selectedCourse._id,
              userId: user._id,
            });
            
            if (verification.success) {
              toast.success('Payment Successful! Enrolling you now...');
              await dispatch(enrollInCourse(selectedCourse._id));
              setShowPayment(false);
              navigate('/student/courses');
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error('An error occurred during verification.');
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', async function (response) {
        toast.error("Payment failed: " + response.error.description);
        try {
          await paymentService.recordPaymentFailure({
            razorpay_order_id: response.error.metadata.order_id,
            razorpay_payment_id: response.error.metadata.payment_id,
            courseId: selectedCourse._id,
            userId: user._id,
            failureReason: response.error.description || "Payment failed or was canceled"
          });
        } catch (err) {
          console.error("Failed to record payment failure:", err);
        }
      });
      rzp.open();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Payment error:", err);
      toast.error(err.response?.data?.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Group courses by instructor for the current UI design
  const instructors = Array.isArray(courses) ? courses.reduce((acc, course) => {
    // Handle both populated and unpopulated instructor field
    const instructorData = course.instructor;
    const instructorId = typeof instructorData === 'object' ? instructorData?._id : instructorData;
    
    if (!instructorId) return acc;
    
    if (!acc[instructorId]) {
      const name = typeof instructorData === 'object' ? (instructorData?.name || 'Expert Instructor') : 'Expert Instructor';
      acc[instructorId] = {
        id: instructorId,
        name: name,
        avatar: typeof instructorData === 'object' ? (instructorData?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`) : `https://ui-avatars.com/api/?name=I&background=2563eb&color=fff`,
        expertise: typeof instructorData === 'object' ? (instructorData?.verificationDetails?.expertise || 'Certified Instructor') : 'Certified Instructor',
        rating: 0, 
        students: typeof instructorData === 'object' ? (instructorData?.studentsCount || 0) : 0,
        courses: []
      };
    }
    acc[instructorId].courses.push(course);
    return acc;
  }, {}) : {};

  const availableInstructors = Object.values(instructors);

  const handleBuyClick = (course, instructor) => {
    setSelectedCourse({ ...course, instructorName: instructor.name });
    setOrderId(`#LRN-${Math.floor(10000 + Math.random() * 90000)}`);
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Explore Courses</h2>
          <p className="text-slate-500 mt-2">Find the right course to build your skills and advance your career.</p>
        </div>
        <div className="flex bg-slate-50 p-1 rounded-md border border-slate-200">
          <button className="px-5 py-2 bg-white text-primary-600 rounded shadow-sm text-sm font-semibold border border-slate-200">All Courses</button>
          <button className="px-5 py-2 text-slate-600 rounded text-sm font-semibold hover:bg-slate-100 transition-colors">Popular</button>
          <button className="px-5 py-2 text-slate-600 rounded text-sm font-semibold hover:bg-slate-100 transition-colors">New</button>
        </div>
      </div>

      {availableInstructors.map((instructor) => (
        <div key={instructor.id} className="space-y-8">
          {/* Instructor Header */}
          <div className="card p-8 flex flex-col md:flex-row items-center gap-8 bg-slate-50/50">
            <img src={instructor.avatar} alt={instructor.name} className="w-20 h-20 rounded object-cover border border-slate-200" />
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{instructor.name}</h3>
                <p className="text-primary-600 font-semibold text-xs uppercase tracking-wider mt-1">{instructor.expertise}</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-warning-500 fill-warning-500" />
                  <span className="text-sm font-semibold text-slate-700">{instructor.rating} Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-primary-600" />
                  <span className="text-sm font-semibold text-slate-700">{instructor.students.toLocaleString()} Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-success-500" />
                  <span className="text-sm font-semibold text-slate-700">Verified Expert</span>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructor.courses.map((course) => (
              <div key={course._id} className="card group flex flex-col hover:border-primary-300 transition-all">
                <div className="relative aspect-video overflow-hidden border-b border-slate-100">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded font-bold text-primary-700 shadow-sm border border-slate-200 text-sm">
                    ₹{course.price?.toLocaleString()}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col space-y-5">
                  <div className="space-y-2">
                    <h4 className="text-md font-bold text-slate-900 line-clamp-2 h-12 group-hover:text-primary-600 transition-colors">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                      <Star size={12} className="text-warning-500 fill-warning-500" />
                      <span>{course.rating || 0} ({course.reviewsCount || 0} reviews)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-y border-slate-50 py-3">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock size={14} />
                      <span className="text-[11px] font-medium">{course.duration || '12h 30m'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <BookOpen size={14} />
                      <span className="text-[11px] font-medium">{course.lessonsCount || course.lessons?.length || 0} Lessons</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {course.category && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-tighter">
                        {course.category}
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-[10px] font-bold rounded uppercase tracking-tighter">
                      Best Seller
                    </span>
                  </div>

                  <div className="pt-2 mt-auto">
                    <button 
                      onClick={() => handleBuyClick(course, instructor)}
                      className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                    >
                      <ShoppingBag size={16} />
                      Enroll Now
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
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setShowPayment(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-slate-900">Checkout</h3>
              </div>
              <button onClick={() => setShowPayment(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Order Summary */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Course Information</h4>
                <div className="flex items-center gap-4 p-4 border border-slate-100 rounded bg-slate-50/50">
                  <img src={selectedCourse.thumbnail} alt={selectedCourse.title} className="w-16 h-12 rounded object-cover border border-slate-200" />
                  <div className="min-w-0">
                    <h5 className="font-bold text-slate-900 text-sm truncate">{selectedCourse.title}</h5>
                    <p className="text-xs text-slate-500 mt-1">Instructor: {selectedCourse.instructorName}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Price Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Course Price</span>
                    <span className="font-semibold text-slate-900">₹{selectedCourse.price?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Platform Fee</span>
                    <span className="font-semibold text-slate-900">₹99</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-900">Total Amount</span>
                    <span className="text-xl font-bold text-primary-600">
                      ₹{(selectedCourse.price + 99).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary-50 rounded border border-primary-100">
                <p className="text-[11px] text-primary-800 leading-relaxed font-medium">
                  By clicking "Confirm & Pay", you agree to our Terms of Service and Refund Policy. Your course content will be available immediately after successful payment.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100">
              <button 
                className={`btn-primary w-full py-3.5 text-md flex items-center justify-center gap-3 ${
                  isProcessing ? 'opacity-70 cursor-not-allowed' : ''
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
                    Confirm & Pay with Razorpay
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
