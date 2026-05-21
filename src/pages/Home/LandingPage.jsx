import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  Award, 
  PlayCircle, 
  ChevronRight, 
  CheckCircle2, 
  MessageSquare, 
  Clock, 
  Globe, 
  ShieldCheck, 
  ArrowRight,
  Menu,
  X,
  Laptop,
  GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAllCourses } from '../../services/courseService';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { label: 'Active Learners', value: '25,000+', icon: <Users className="w-6 h-6" /> },
    { label: 'Expert Courses', value: '850+', icon: <BookOpen className="w-6 h-6" /> },
    { label: 'Certified Mentors', value: '120+', icon: <Award className="w-6 h-6" /> },
    { label: 'Live Sessions', value: '300+', icon: <PlayCircle className="w-6 h-6" /> },
  ];

  const features = [
    {
      title: 'Live Mentor Sessions',
      description: 'Learn directly from industry experts through scheduled live classes and interactive review sessions.',
      icon: <Users className="w-6 h-6" />
    },
    {
      title: 'Career Ready Path',
      description: 'Build production-grade skills with structured modules, real-world projects, and skill tracking.',
      icon: <Laptop className="w-6 h-6" />
    },
    {
      title: 'Verified Accreditation',
      description: 'Receive certificates with unique verification IDs upon course completion and passing assessments.',
      icon: <ShieldCheck className="w-6 h-6" />
    }
  ];

  

  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getAllCourses({ limit: 3 });
        // Handle both possible response shapes (array or object with courses property)
        const courses = Array.isArray(response) ? response : (response.courses || []);
        setFeaturedCourses(courses);
      } catch (error) {
        console.error('Error fetching landing courses:', error);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnrollClick = (courseId) => {
    if (currentUser) {
      navigate(`/course-details/${courseId}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-primary-100 selection:text-primary-700">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg py-2 border-b border-slate-200' 
          : 'bg-black/20 backdrop-blur-sm py-5 border-b border-white/10'
      }`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="bg-primary-600 p-2 rounded-xl shadow-lg shadow-primary-600/30 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <span className={`text-2xl font-black tracking-tighter transition-colors duration-300 ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              Learnify
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {['Courses', 'About', 'Teach'].map((item) => (
              <a 
                key={item}
                href={item === 'Teach' ? '/instructor/login' : `#${item.toLowerCase()}`} 
                className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 relative group ${
                  scrolled ? 'text-slate-500 hover:text-primary-600' : 'text-slate-200 hover:text-white'
                }`}
              >
                {item}
                <span className={`absolute -bottom-2 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                  scrolled ? 'bg-primary-600' : 'bg-primary-400'
                }`}></span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            {!currentUser ? (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                    scrolled ? 'text-slate-600 hover:text-primary-600' : 'text-white hover:text-primary-400'
                  }`}
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className={`px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 transform hover:-translate-y-0.5 ${
                    scrolled 
                      ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/20 hover:bg-primary-700' 
                      : 'bg-white text-slate-900 hover:bg-primary-50 shadow-xl shadow-black/10'
                  }`}
                >
                  Get Started
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className={`px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 transform hover:-translate-y-0.5 ${
                  scrolled 
                    ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/20 hover:bg-primary-700' 
                    : 'bg-white text-slate-900 hover:bg-primary-50 shadow-xl shadow-black/10'
                }`}
              >
                start learning
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
              scrolled ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col p-8 space-y-6">
                {['Courses', 'About', 'Teach'].map((item) => (
                  <a 
                    key={item}
                    href={item === 'Teach' ? '/instructor/login' : `#${item.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)} 
                    className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-primary-600 transition-colors"
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-8 border-t border-slate-100 flex flex-col gap-4">
                  {!currentUser ? (
                    <>
                      <button onClick={() => navigate('/login')} className="w-full py-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">Login</button>
                      <button onClick={() => navigate('/register')} className="w-full bg-primary-600 text-white py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all">Join Now</button>
                    </>
                  ) : (
                    <button onClick={() => navigate('/login')} className="w-full bg-primary-600 text-white py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all">Dashboard</button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover scale-105"
          >
            <source 
              src="https://assets.mixkit.co/videos/preview/mixkit-girl-in-glasses-studying-with-a-laptop-4411-large.mp4" 
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>
          {/* Professional Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40 z-10"></div>
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-10"></div>
        </div>

        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">Next-Gen E-Learning Platform</span>
              </div>

              <h1 className="text-5xl md:text-8xl font-bold text-white leading-[1.1] tracking-tight">
                Learn Skills That <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-blue-400">
                  Build Your Future
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-200 leading-relaxed max-w-2xl font-medium drop-shadow-lg">
                Master industry-leading technologies with interactive courses, real-time mentoring, and a global community of learners.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 pt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/register')}
                  className="px-10 py-5 bg-primary-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-3 group shadow-2xl shadow-primary-600/30 hover:bg-primary-500 transition-all"
                >
                  Start Learning
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => document.getElementById('courses').scrollIntoView({ behavior: 'smooth' })}
                  className="px-10 py-5 bg-white/10 backdrop-blur-xl text-white border border-white/30 rounded-xl font-bold text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-3"
                >
                  Explore Courses
                  <PlayCircle className="w-5 h-5 opacity-70" />
                </motion.button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-12 flex flex-wrap items-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <Users className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">50k+</p>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Learners</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <Award className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">100%</p>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Verified</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-slate-100" id="about">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary-600 border border-slate-100 transition-colors">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, idx) => (
              <div key={idx} className="space-y-6 group">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24 bg-slate-50" id="courses">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-slate-200 pb-8">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-primary-600 uppercase tracking-widest">Trending Now</h3>
              <h2 className="text-3xl font-bold text-slate-900">Explore Professional Programs</h2>
            </div>
            <button onClick={() => navigate('/register')} className="text-xs font-bold uppercase tracking-widest text-primary-600 flex items-center gap-2 hover:text-primary-700 transition-colors">
              Browse Full Catalog <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {loadingCourses ? (
              [1, 2, 3].map(i => (
                <div key={i} className="card h-96 animate-pulse bg-white"></div>
              ))
            ) : featuredCourses.length > 0 ? featuredCourses.map((course) => (
              <div key={course._id} className="card group bg-white hover:shadow-2xl transition-all">
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest border border-slate-200 text-slate-900">
                    {course.category}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{course.enrolledStudentsCount || 0} Students</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 leading-tight h-14 line-clamp-2">
                    {course.title}
                  </h4>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Program Fee</p>
                      <p className="text-lg font-bold text-primary-600">₹{course.price?.toLocaleString()}</p>
                    </div>
                    <button onClick={() => handleEnrollClick(course._id)} className="px-6 py-2 bg-primary-600 text-white rounded font-bold text-xs hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20">
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-12 text-center text-slate-400 italic text-sm">No courses currently available. Check back soon!</div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white" id="testimonials">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h3 className="text-xs font-bold text-primary-600 uppercase tracking-widest">Success Stories</h3>
            <h2 className="text-3xl font-bold text-slate-900">Trusted by Professional Learners</h2>
          </div>
          
        
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full filter blur-[100px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[100px] -ml-48 -mb-48"></div>
        
        <div className="container mx-auto px-6 text-center space-y-10 relative z-10">
          <h3 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto">Ready to Advance Your <span className="text-primary-400">Professional Journey?</span></h3>
          <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed font-medium">
            Join thousands of professionals already mastering new industry standards on the Learnify platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button 
              onClick={() => navigate('/register')}
              className="px-12 py-4 bg-primary-600 text-white rounded font-bold text-sm hover:bg-primary-700 shadow-xl shadow-primary-600/20 transition-all transform hover:-translate-y-1"
            >
              Start Learning Now
            </button>
            <button onClick={() => navigate('/instructor/login')} className="px-12 py-4 bg-transparent text-white border border-slate-700 rounded font-bold text-sm hover:bg-slate-800 transition-all">
              Become an Instructor
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="bg-primary-600 p-1.5 rounded">
                  <BookOpen className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">Learnify</span>
              </div>
              <p className="text-slate-500 max-w-xs text-sm leading-relaxed font-medium">
                The leading platform for professional skill development, mentor-led courses, and verified industry accreditation.
              </p>
            </div>
            
            {['Catalog', 'Company', 'Legal'].map((title, idx) => (
              <div key={idx}>
                <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{title}</h6>
                <ul className="space-y-4 text-xs font-bold text-slate-600">
                  <li><a href="#courses" className="hover:text-primary-600 transition-colors uppercase">Browse Courses</a></li>
                  <li><a href="#about" className="hover:text-primary-600 transition-colors uppercase">About Platform</a></li>
                  <li><a href="/instructor/login" className="hover:text-primary-600 transition-colors uppercase">Instructor Portal</a></li>
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-medium">© 2026 Learnify Ecosystem. Built for Professionals.</p>
            <div className="flex gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
