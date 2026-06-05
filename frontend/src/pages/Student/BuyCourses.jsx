import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
<<<<<<< HEAD
import { toast } from 'react-hot-toast';
import { fetchAllCourses, enrollInCourse } from '../../features/courses/courseThunk';
=======
import { fetchAllCourses, fetchEnrolledCourses, verifyPaymentAndEnroll } from '../../features/courses/courseThunk';
import paymentService from "../../services/paymentService";
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
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
<<<<<<< HEAD
  AlertCircle,
  Search
=======
  CheckCircle2,
  Lock
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import paymentService from '../../services/paymentService';
import adminService from '../../services/adminService';

const BuyCourses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
<<<<<<< HEAD
  const location = useLocation();
  const { courses, loading, error } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);
=======
  const { courses, loading, error, enrolledCourses } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);

>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [failureReason, setFailureReason] = useState("");
  const [sortMode, setSortMode] = useState('all'); // 'all' | 'popular' | 'new'
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Read search query from URL ?q=
  const urlSearchQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get('q') || '').trim().toLowerCase();
  }, [location.search]);

  useEffect(() => {
    dispatch(fetchAllCourses());
    if (enrolledCourses.length === 0) {
      dispatch(fetchEnrolledCourses());
    }
  }, [dispatch]);

<<<<<<< HEAD
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await adminService.getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        return resolve(true);
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error('Failed to load Razorpay checkout script'));
      document.body.appendChild(script);
    });
  };

  const handleEnrollment = async () => {
=======
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

>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
    setIsProcessing(true);
    const loadingToast = toast.loading("Initializing payment...");
    try {
<<<<<<< HEAD
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please connect and try again.');
      }

      await loadRazorpayScript();

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
=======
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
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: selectedCourse._id,
<<<<<<< HEAD
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
=======
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
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
        },
        theme: {
          color: "#2563eb",
        },
<<<<<<< HEAD
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', async function (response) {
        console.error("Payment failed:", response.error);
        setFailureReason(response.error.description || "The transaction was cancelled or declined.");
        setShowFailureModal(true);
        setShowPayment(false);
        
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
=======
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
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
    } finally {
      // We don't set processing false here because Razorpay modal might still be open
      // or verification might be happening in the handler
    }
  };

<<<<<<< HEAD
  // Apply search, category, and sort filters to courses
  const filteredAndSortedCourses = useMemo(() => {
    if (!Array.isArray(courses)) return [];
    let result = [...courses];

    // Search filter
    if (urlSearchQuery) {
      result = result.filter(
        (c) =>
          c.title?.toLowerCase().includes(urlSearchQuery) ||
          c.category?.toLowerCase().includes(urlSearchQuery) ||
          (typeof c.instructor === 'object' && c.instructor?.name?.toLowerCase().includes(urlSearchQuery))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((c) => c.category === selectedCategory);
    }

    // Sort
    if (sortMode === 'popular') {
      result.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    } else if (sortMode === 'new') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [courses, urlSearchQuery, selectedCategory, sortMode]);

  // Group by instructor
  const instructors = filteredAndSortedCourses.reduce((acc, course) => {
    const instructorData = course.instructor;
    const instructorId = typeof instructorData === 'object' ? instructorData?._id : instructorData;
=======
  // Group courses by instructor
  const instructors = Array.isArray(courses) ? courses.reduce((acc, course) => {
    const instructorId = course.instructor?._id;
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
    if (!instructorId) return acc;
    if (!acc[instructorId]) {
      const name = typeof instructorData === 'object' ? (instructorData?.name || 'Expert Instructor') : 'Expert Instructor';
      acc[instructorId] = {
        id: instructorId,
        name,
        avatar: typeof instructorData === 'object' ? (instructorData?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`) : `https://ui-avatars.com/api/?name=I&background=2563eb&color=fff`,
        expertise: typeof instructorData === 'object' ? (instructorData?.verificationDetails?.expertise || 'Certified Instructor') : 'Certified Instructor',
        rating: 0,
        students: typeof instructorData === 'object' ? (instructorData?.studentsCount || 0) : 0,
        courses: []
      };
    }
    acc[instructorId].courses.push(course);
    return acc;
  }, {});

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
<<<<<<< HEAD
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Explore Courses</h2>
          <p className="text-slate-500 mt-2">
            {urlSearchQuery
              ? <>Showing results for <span className="font-bold text-slate-800">&ldquo;{urlSearchQuery}&rdquo;</span></>  
              : 'Find the right course to build your skills and advance your career.'}
          </p>
        </div>
        <div className="flex bg-slate-50 p-1 rounded-md border border-slate-200">
          {[['all', 'All Courses'], ['popular', 'Popular'], ['new', 'New']].map(([mode, label]) => (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              className={`px-5 py-2 rounded text-sm font-semibold transition-colors ${
                sortMode === mode
                  ? 'bg-white text-primary-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {label}
=======
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
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
            </button>
          ))}
        </div>
      </div>

<<<<<<< HEAD
      {/* Categories Filter Pills */}
      <div className="flex flex-wrap gap-2.5 pb-2">
        <button 
          onClick={() => setSelectedCategory('All')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            selectedCategory === 'All' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
              : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              selectedCategory === cat.name 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {availableInstructors.length > 0 ? (
        availableInstructors.map((instructor) => (
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
=======
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
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
                  </div>
                </div>
              </div>
            </div>

<<<<<<< HEAD
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
        ))
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[30vh] space-y-4">
          <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200">
              <BookOpen size={40} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">No Courses Found</h3>
            <p className="text-slate-500 mt-2">We couldn't find any courses in the "{selectedCategory}" category.</p>
=======
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
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && selectedCourse && (
<<<<<<< HEAD
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
=======
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
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
                  </div>
                </div>
              </div>

<<<<<<< HEAD
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
=======
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
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
                </p>
              </div>
            </div>

<<<<<<< HEAD
            <div className="p-6 border-t border-slate-100">
              <button 
                className={`btn-primary w-full py-3.5 text-md flex items-center justify-center gap-3 ${
                  isProcessing ? 'opacity-70 cursor-not-allowed' : ''
=======
            <div className="p-10 bg-slate-50 border-t border-slate-100">
              <button 
                className={`w-full py-6 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-[0.98] ${
                  isProcessing 
                    ? 'bg-slate-400 text-slate-100 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
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
<<<<<<< HEAD
                    Confirm & Pay with Razorpay
=======
                    <Lock size={18} />
                    Pay Securely Now
>>>>>>> d777039 (Implemented instructor dashboard, Razorpay payment integration, enrollment flow, course management, and backend service improvements)
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Payment Failure Modal */}
      {showFailureModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowFailureModal(false)}></div>
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-red-100">
            <div className="bg-red-50 p-10 flex justify-center">
              <div className="bg-red-100 p-6 rounded-[2rem] text-red-600 animate-bounce">
                <AlertCircle size={48} />
              </div>
            </div>
            <div className="p-10 text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">Payment Failed</h3>
                <p className="text-slate-500 font-medium">We couldn't process your transaction.</p>
              </div>
              
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Error Details</p>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{failureReason}</p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setShowFailureModal(false)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => setShowFailureModal(false)}
                  className="w-full py-4 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyCourses;
