import React, { useCallback, useEffect, useState } from 'react';
import { 
  Award, 
  Download, 
  ExternalLink, 
  Clock, 
  Lock, 
  Search,
  CheckCircle2,
  Calendar,
  User,
  ShieldCheck,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getMyCertificates, getCertificateDownloadUrl } from '../../services/certificateService';
import { getEnrolledCourses } from '../../services/userService';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [certs, enrolled] = await Promise.all([
        getMyCertificates(),
        getEnrolledCourses()
      ]);
      setCertificates(certs);
      setEnrolledCourses(enrolled);
      setError(null);
    } catch (err) {
      console.error("Error fetching certificates data:", err);
      setError("Failed to load certificates. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter pending courses (enrolled but no certificate yet)
  const earnedCourseIds = certificates.map(cert => cert.course?._id);
  const pendingCourses = enrolledCourses.filter(enrollment => {
    const course = enrollment.course || enrollment;
    return !earnedCourseIds.includes(course._id);
  });

  const filteredCertificates = certificates.filter(cert => 
    cert.certificateId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.course?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (certId) => {
    const url = getCertificateDownloadUrl(certId);
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center bg-white rounded-[2.5rem] border border-slate-200">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading your achievements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex items-center justify-center bg-white rounded-[2.5rem] border border-slate-200">
        <div className="flex flex-col items-center gap-4 text-center p-6">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h3 className="text-xl font-bold text-slate-900">Oops! Something went wrong</h3>
          <p className="text-slate-500 max-w-md">{error}</p>
          <button 
            onClick={fetchData}
            className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Certificates</h2>
          <p className="text-slate-500">Showcase your achievements and download industry-recognized certificates.</p>
        </div>
        <div className="relative w-full md:w-64">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search certificate ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      <div className="grid gap-12">
        {/* Earned Certificates */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-green-600" />
            Earned Certificates
          </h3>
          {filteredCertificates.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center flex flex-col items-center gap-4">
              <Award size={48} className="text-slate-200" />
              <p className="text-slate-500 font-medium italic">No certificates found matching your search.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredCertificates.map((cert) => (
                <div key={cert._id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all group flex flex-col md:flex-row">
                  <div className="w-full md:w-48 h-48 md:h-auto relative overflow-hidden bg-slate-900">
                    <img 
                      src={cert.course?.thumbnail || "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80"} 
                      alt={cert.course?.title} 
                      className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
                        <Award className="text-white" size={48} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-8 space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Verified</span>
                        <span className="text-[10px] font-bold text-slate-400">ID: {cert.certificateId}</span>
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 leading-tight line-clamp-2">{cert.course?.title}</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instructor</p>
                        <p className="text-xs font-bold text-slate-900 flex items-center gap-1"><User size={12} /> {cert.instructor?.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Issue Date</p>
                        <p className="text-xs font-bold text-slate-900 flex items-center gap-1"><Calendar size={12} /> {new Date(cert.issueDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center gap-3">
                      <button 
                        onClick={() => handleDownload(cert._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-slate-100"
                      >
                        <Download size={18} />
                        Download PDF
                      </button>
                      <button className="p-3 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-200 transition-all border border-slate-100">
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Certificates */}
        {pendingCourses.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock size={20} className="text-yellow-600" />
              Locked & Pending
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingCourses.map((enrollment) => {
                const course = enrollment.course || enrollment;
                return (
                  <div key={course._id} className="bg-slate-50 rounded-3xl border border-dashed border-slate-300 p-6 flex items-center gap-6 opacity-60 grayscale group hover:grayscale-0 hover:bg-white hover:border-blue-200 transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center relative">
                      <Lock className="text-slate-400 group-hover:text-blue-400 transition-colors" size={24} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <h4 className="font-bold text-slate-700 text-sm truncate">{course.title}</h4>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <span>Status</span>
                          <span>{enrollment.completed ? '100% - Ready' : 'In Progress'}</span>
                        </div>
                        <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${enrollment.completed ? 'bg-green-500' : 'bg-blue-600'} opacity-30`} 
                            style={{ width: enrollment.completed ? '100%' : '50%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={40} />
          </div>
          <div className="space-y-2 flex-1 text-center md:text-left">
            <h4 className="text-2xl font-bold">Verified Digital Identity</h4>
            <p className="text-blue-100 max-w-2xl">
              All Learnify certificates are secured with unique IDs and instructor signatures. You can share your certificate link with recruiters to instantly verify your credentials.
            </p>
          </div>
          <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-xl">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificates;
