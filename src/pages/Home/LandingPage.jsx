import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  Award, 
  PlayCircle, 
  Star, 
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
import { useNavigate, Link } from 'react-router-dom';
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
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with years of real-world experience.',
      icon: <Users className="text-blue-600" />,
    },
    {
      title: 'Live Classes',
      description: 'Interactive sessions with real-time Q&A to clear your doubts instantly.',
      icon: <PlayCircle className="text-blue-600" />,
    },
    {
      title: 'Progress Tracking',
      description: 'Visualize your learning journey with detailed analytics and milestones.',
      icon: <Laptop className="text-blue-600" />,
    },
    {
      title: 'Global Certificates',
      description: 'Earn industry-recognized certificates upon course completion.',
      icon: <Award className="text-blue-600" />,
    },
    {
      title: '24/7 Support',
      description: 'Our dedicated support team is always here to help you succeed.',
      icon: <MessageSquare className="text-blue-600" />,
    },
    {
      title: 'Flexible Learning',
      description: 'Access your courses anytime, anywhere, on any device you prefer.',
      icon: <Globe className="text-blue-600" />,
    },
  ];

  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses({ limit: 3, status: 'published' });
        setFeaturedCourses(data || []);
      } catch (error) {
        console.error('Error fetching landing courses:', error);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const testimonials = [
    {
      name: 'Alex Johnson',
      role: 'Frontend Developer',
      content: 'Learnify completely changed my career path. The React course was so detailed and the projects helped me land my dream job.',
      avatar: 'https://i.pravatar.cc/150?u=alex',
    },
    {
      name: 'Priya Sharma',
      role: 'UI Designer',
      content: 'The live sessions are incredible. Being able to ask questions directly to experts made a huge difference in my learning curve.',
      avatar: 'https://i.pravatar.cc/150?u=priya',
    },
    {
      name: 'David Chen',
      role: 'Student',
      content: 'The platform is so intuitive and the community support is top-notch. I recommend Learnify to everyone starting their tech journey.',
      avatar: 'https://i.pravatar.cc/150?u=david',
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-blue-600 p-2 rounded-lg">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Learnify</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#courses" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Courses</a>
            <a href="#mentors" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Mentors</a>
            <a href="#about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">About Us</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/instructor/login')}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
              
            >
              start leaching
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 py-6 px-6 flex flex-col gap-4 shadow-xl">
            <a href="#courses" className="text-lg font-medium py-2">Courses</a>
            <a href="#mentors" className="text-lg font-medium py-2">Mentors</a>
            <a href="#about" className="text-lg font-medium py-2">About</a>
            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
              <button onClick={() => navigate('/login')} className="w-full py-3 font-semibold text-slate-700 text-left">Login</button>
              <button onClick={() => navigate('/register')} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold">Get Started</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1]">
              Unlock Your Potential with <span className="text-blue-600">Expert-Led</span> Learning.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Master the most in-demand skills from industry experts. Flexible learning designed to fit your schedule and advance your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button onClick={() => navigate('/register')} className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 group active:scale-95">
                Explore All Courses
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                View Live Demo
              </button>
            </div>
            
          </div>
          
          <div className="relative">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-70"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80" 
                alt="Dashboard Preview" 
                className="rounded-xl w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600/90 p-5 rounded-full text-white cursor-pointer hover:scale-110 transition-transform shadow-2xl backdrop-blur-sm">
                <PlayCircle className="w-8 h-8 fill-white text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-100 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left group">
                <div className="mb-4 p-3 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white" id="about">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm">Why Choose Learnify</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900">Education designed for the future of work</h3>
            <p className="text-lg text-slate-600">Everything you need to master new skills and advance your professional career in one comprehensive platform.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {React.cloneElement(feature.icon, { className: 'w-7 h-7' })}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24 bg-slate-50" id="courses">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm">Popular Courses</h2>
              <h3 className="text-4xl font-extrabold text-slate-900">Pick a course to get started</h3>
            </div>
            <button className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Explore all courses <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {loadingCourses ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-slate-100"></div>
              ))
            ) : featuredCourses.length > 0 ? featuredCourses.map((course) => (
              <div key={course._id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-2xl transition-all group">
                <div className="relative aspect-video overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-slate-900 shadow-sm uppercase tracking-wider">
                    {course.category}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-slate-900 font-bold text-sm">4.9</span>
                    </div>
                    <span className="text-slate-400 text-sm">({course.enrolledCount || 0} students)</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 leading-tight hover:text-blue-600 cursor-pointer transition-colors line-clamp-2 h-14">
                    {course.title}
                  </h4>
                  <p className="text-slate-500 text-sm font-medium">By <span className="text-slate-900">{course.instructor?.name || 'Expert Instructor'}</span></p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-4 text-slate-500 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {course.lessonsCount || course.lessons?.length || 0} Lessons
                      </div>
                    </div>
                    <div className="text-2xl font-black text-blue-600">₹{course.price}</div>
                  </div>
                  <button onClick={() => navigate(`/course-details/${course._id}`)} className="w-full py-3 bg-slate-50 text-slate-900 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all active:scale-[0.98]">
                    Enroll Now
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-500 italic">No courses published yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>



      {/* Upcoming Live Classes */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm">Live Learning</h2>
            <h3 className="text-4xl font-extrabold text-slate-900">Upcoming Live Classes</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all flex gap-5 items-start group">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-red-50 flex flex-col items-center justify-center border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <span className="text-xs font-bold uppercase">May</span>
                  <span className="text-xl font-black">{12 + i}</span>
                </div>
                <div className="space-y-3">
                  <div className="inline-block px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest border border-green-100">
                    Live Session
                  </div>
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1">
                    {i === 1 ? 'Mastering Advanced React Patterns' : i === 2 ? 'Figma for Enterprise Design' : 'Machine Learning Foundations'}
                  </h4>
                  <div className="flex items-center gap-3 text-slate-500 text-sm">
                    <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 04:00 PM</div>
                    <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> 245 Joined</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white" id="mentors">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm">Testimonials</h2>
            <h3 className="text-4xl font-extrabold text-slate-900">What our students say</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-slate-50 p-10 rounded-3xl relative group hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute top-10 right-10 opacity-10">
                  <MessageSquare className="w-12 h-12 text-blue-600" />
                </div>
                <div className="flex items-center gap-1 mb-6 text-yellow-400">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-slate-700 text-lg italic leading-relaxed mb-8">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full border-2 border-white shadow-sm" />
                  <div>
                    <h5 className="font-bold text-slate-900">{t.name}</h5>
                    <p className="text-sm text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-blue-600 rounded-[2.5rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-700 rounded-full opacity-50 blur-3xl"></div>
            
            <div className="relative z-10 space-y-10 max-w-3xl mx-auto">
              <h3 className="text-4xl md:text-6xl font-black leading-tight">Ready to start your learning journey?</h3>
              <p className="text-xl text-blue-100 max-w-xl mx-auto">
                Join over 25,000+ students already learning on Learnify. Get unlimited access to 850+ courses today.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button 
                  onClick={() => navigate('/register')}
                  className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-xl hover:bg-blue-50 shadow-2xl transition-all active:scale-95"
                >
                  Get Started for Free
                </button>
                <button className="px-10 py-5 bg-blue-700 text-white border border-blue-500 rounded-2xl font-bold text-xl hover:bg-blue-800 transition-all">
                  Contact Sales
                </button>
              </div>
              <div className="flex items-center justify-center gap-8 pt-4">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-200" /> <span className="text-sm font-medium">No credit card required</span></div>
                <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-blue-200" /> <span className="text-sm font-medium">14-day free trial</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 pb-12 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <BookOpen className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-slate-900">Learnify</span>
              </div>
              <p className="text-slate-500 max-w-xs leading-relaxed">
                Empowering learners worldwide with accessible, high-quality education from industry experts.
              </p>
              <div className="flex gap-4">
                {['fb', 'tw', 'ln', 'ig'].map(s => (
                  <div key={s} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 cursor-pointer transition-all">
                    <Globe className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h6 className="font-bold text-slate-900 mb-6">Platform</h6>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Courses</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Mentors</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Live Classes</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h6 className="font-bold text-slate-900 mb-6">Company</h6>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h6 className="font-bold text-slate-900 mb-6">Support</h6>
              <ul className="space-y-4 text-slate-500 font-medium">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Sitemap</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-sm">© 2026 Learnify Education. All rights reserved.</p>
            <div className="flex gap-8 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-blue-600">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600">Terms of Service</a>
              <a href="#" className="hover:text-blue-600">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
