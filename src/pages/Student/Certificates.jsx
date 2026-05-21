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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Certificates</h2>
          <p className="text-slate-500 mt-1">Download and share your industry-recognized certifications.</p>
        </div>
        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search certificates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-primary-500 transition-all outline-none"
          />
        </div>
      </div>

      <div className="grid gap-12">
        {/* Earned Certificates */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            Verified Certifications
          </h3>
          {filteredCertificates.length === 0 ? (
            <div className="card border-dashed p-16 text-center flex flex-col items-center gap-4 bg-slate-50">
              <Award size={48} className="text-slate-200" />
              <p className="text-slate-500 font-medium italic">No certificates found matching your search.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredCertificates.map((cert) => (
                <div key={cert._id} className="card group flex flex-col md:flex-row overflow-hidden hover:border-primary-300 transition-all">
                  <div className="w-full md:w-40 h-40 md:h-auto relative bg-slate-900 flex-shrink-0 border-r border-slate-100">
                    <img 
                      src={cert.course?.thumbnail || "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80"} 
                      alt={cert.course?.title} 
                      className="w-full h-full object-cover opacity-50" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Award className="text-white opacity-80" size={40} />
                    </div>
                  </div>
                  
                  <div className="flex-1 p-6 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100">Verified</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">ID: {cert.certificateId}</span>
                      </div>
                      <h4 className="text-md font-bold text-slate-900 leading-tight line-clamp-2">{cert.course?.title}</h4>
                      
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Instructor</p>
                          <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mt-1 truncate"><User size={12} /> {cert.instructor?.name}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Issued On</p>
                          <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mt-1"><Calendar size={12} /> {new Date(cert.issueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                      <button 
                        onClick={() => handleDownload(cert._id)}
                        className="btn-primary flex-1 py-2 text-xs flex items-center justify-center gap-2"
                      >
                        <Download size={14} />
                        Download PDF
                      </button>
                      <button className="p-2 bg-slate-50 text-slate-400 rounded hover:bg-slate-100 transition-colors border border-slate-200">
                        <ExternalLink size={14} />
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
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              Locked & Pending
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingCourses.map((enrollment) => {
                const course = enrollment.course || enrollment;
                return (
                  <div key={course._id} className="card bg-slate-50/50 p-5 flex items-center gap-5 border-dashed grayscale-[0.8] hover:grayscale-0 hover:bg-white transition-all group">
                    <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Lock className="text-slate-300 group-hover:text-primary-400 transition-colors" size={20} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <h4 className="font-bold text-slate-600 text-[13px] truncate">{course.title}</h4>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          <span>Progress</span>
                          <span>{enrollment.completed ? '100%' : '50%'}</span>
                        </div>
                        <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${enrollment.completed ? 'bg-success-500' : 'bg-primary-600'} opacity-30`} 
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

      <div className="p-8 bg-primary-900 rounded-lg text-white space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 bg-primary-800 rounded flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={32} className="text-primary-100" />
          </div>
          <div className="space-y-2 flex-1 text-center md:text-left">
            <h4 className="text-xl font-bold">Verified Digital Credentials</h4>
            <p className="text-primary-200 text-sm max-w-2xl leading-relaxed">
              Every Learnify certificate is backed by a unique verification ID. Share your certificates directly on LinkedIn or with recruiters to instantly validate your expertise.
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-primary-900 rounded font-bold text-sm hover:bg-primary-50 transition-colors shadow-sm">
            Verification Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificates;
