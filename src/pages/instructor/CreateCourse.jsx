import React, { useState } from 'react';
import { 
  Plus, 
  Video, 
  FileText, 
  Award, 
  PlayCircle, 
  Upload, 
  X, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Info,
  Layers,
  IndianRupee,
  Link as LinkIcon,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  FileBadge
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLiveEnabled, setIsLiveEnabled] = useState(false);
  const [isReviewEnabled, setIsReviewEnabled] = useState(false);
  const [isCertEnabled, setIsCertEnabled] = useState(true);

  const steps = [
    { id: 1, title: 'Basic Information', icon: <FileText size={18} /> },
    { id: 2, title: 'Course Content', icon: <Layers size={18} /> },
    { id: 3, title: 'Pricing & Offers', icon: <IndianRupee size={18} /> },
    { id: 4, title: 'Settings & Publish', icon: <CheckCircle2 size={18} /> },
  ];

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create New Course</h2>
          <p className="text-slate-500 mt-1 font-medium">Follow the steps to submit your course for admin approval.</p>
        </div>
        <div className="px-5 py-2.5 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-100 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <Info size={16} /> Draft Auto-saved
        </div>
      </div>

      {/* Step Progress */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm overflow-x-auto custom-scrollbar">
        <div className="flex items-center justify-between min-w-[600px]">
          {steps.map((s, idx) => (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${
                  step >= s.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400'
                }`}>
                  {step > s.id ? <CheckCircle2 size={20} /> : s.icon}
                </div>
                <div className="text-left">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${
                    step >= s.id ? 'text-blue-600' : 'text-slate-400'
                  }`}>Step {s.id}</p>
                  <p className={`text-sm font-bold truncate ${
                    step >= s.id ? 'text-slate-900' : 'text-slate-400'
                  }`}>{s.title}</p>
                </div>
              </div>
              {idx < steps.length - 1 && <div className="h-0.5 w-12 bg-slate-100 mx-4"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-10">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Course Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Mastering Advanced React Patterns" 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Description</label>
                <textarea 
                  rows="5" 
                  placeholder="Describe what students will learn..." 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none font-medium text-slate-600"
                ></textarea>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Category</label>
                  <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-600">
                    <option>Web Development</option>
                    <option>Data Science</option>
                    <option>Mobile App Dev</option>
                    <option>UI/UX Design</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Level</label>
                  <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-600">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Course Thumbnail</label>
              <div className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-12 text-center space-y-4 hover:border-blue-200 transition-all cursor-pointer group">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto text-blue-600 group-hover:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG or WEBP (Recommended 1200x675)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Modules & Lessons</h3>
              <button className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline">
                <Plus size={18} /> Add Module
              </button>
            </div>

            <div className="space-y-6">
              {[1, 2].map((m) => (
                <div key={m} className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 p-6 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-slate-900 shadow-sm">{m}</div>
                      <input 
                        type="text" 
                        defaultValue={`Module ${m}: Introduction`} 
                        className="bg-transparent border-none font-bold text-slate-900 focus:ring-0 text-lg"
                      />
                    </div>
                    <button className="p-2 text-slate-400 hover:text-red-500 transition-all"><X size={20} /></button>
                  </div>
                  <div className="p-6 space-y-4">
                    {[1, 2].map((l) => (
                      <div key={l} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-blue-200 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                            <PlayCircle size={18} />
                          </div>
                          <span className="text-sm font-bold text-slate-700">Lesson {l}: Core Concepts</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <button className="p-2 text-slate-400 hover:text-blue-600 transition-all"><LinkIcon size={16} /></button>
                          <button className="p-2 text-slate-400 hover:text-blue-600 transition-all"><Upload size={16} /></button>
                        </div>
                      </div>
                    ))}
                    <button className="w-full py-3 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs font-bold hover:border-blue-200 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                      <Plus size={16} /> Add Lesson to Module {m}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-10">
               <div className="space-y-4">
                  <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Base Price (₹)</label>
                  <div className="relative">
                    <IndianRupee size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="number" 
                      placeholder="2499" 
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                    />
                  </div>
               </div>
               <div className="space-y-4">
                  <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Introductory Offer (Optional)</label>
                  <div className="relative">
                    <IndianRupee size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="number" 
                      placeholder="1999" 
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                    />
                  </div>
               </div>
            </div>

            <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-start gap-4">
               <Info className="text-blue-600 flex-shrink-0" size={20} />
               <div className="space-y-2">
                  <p className="text-xs font-black text-blue-900 uppercase tracking-widest">Pricing Policy</p>
                  <p className="text-sm text-blue-700 leading-relaxed font-medium">Learnify takes a 20% platform fee on each sale. This fee covers hosting, marketing, and transaction processing. You keep 80% of the revenue.</p>
               </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid md:grid-cols-2 gap-8">
                <div className={`p-8 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between group ${isLiveEnabled ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-white'}`} onClick={() => setIsLiveEnabled(!isLiveEnabled)}>
                   <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl ${isLiveEnabled ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                         <Video size={24} />
                      </div>
                      <div>
                         <p className="font-bold text-slate-900">Live Classes</p>
                         <p className="text-xs text-slate-400 font-medium">Allow group sessions</p>
                      </div>
                   </div>
                   {isLiveEnabled ? <ToggleRight size={32} className="text-blue-600" /> : <ToggleLeft size={32} className="text-slate-300" />}
                </div>

                <div className={`p-8 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between group ${isReviewEnabled ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-white'}`} onClick={() => setIsReviewEnabled(!isReviewEnabled)}>
                   <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl ${isReviewEnabled ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                         <ShieldCheck size={24} />
                      </div>
                      <div>
                         <p className="font-bold text-slate-900">Expert Reviews</p>
                         <p className="text-xs text-slate-400 font-medium">Enable 1-on-1 sessions</p>
                      </div>
                   </div>
                   {isReviewEnabled ? <ToggleRight size={32} className="text-blue-600" /> : <ToggleLeft size={32} className="text-slate-300" />}
                </div>

                <div className={`p-8 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between group ${isCertEnabled ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-white'}`} onClick={() => setIsCertEnabled(!isCertEnabled)}>
                   <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl ${isCertEnabled ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                         <FileBadge size={24} />
                      </div>
                      <div>
                         <p className="font-bold text-slate-900">Certificates</p>
                         <p className="text-xs text-slate-400 font-medium">Auto-generate on pass</p>
                      </div>
                   </div>
                   {isCertEnabled ? <ToggleRight size={32} className="text-blue-600" /> : <ToggleLeft size={32} className="text-slate-300" />}
                </div>

                <div className="p-8 rounded-[2rem] border border-slate-100 bg-white flex items-center gap-4">
                   <div className="p-4 rounded-2xl bg-slate-50 text-slate-400">
                      <Globe size={24} />
                   </div>
                   <div>
                      <p className="font-bold text-slate-900">Visibility</p>
                      <p className="text-xs text-slate-400 font-medium">Approved only (Fixed)</p>
                   </div>
                </div>
             </div>

             <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full -mr-16 -mt-16 opacity-50 blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                   <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-blue-400 flex-shrink-0">
                      <Info size={40} />
                   </div>
                   <div className="space-y-3 text-center md:text-left">
                      <h4 className="text-xl font-black">Submission Confirmation</h4>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed">By submitting, you agree that your content follows our guidelines. Our team will review your course within 24-48 hours. You will be notified via email.</p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-10 border-t border-slate-50 flex items-center justify-between">
          <button 
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className={`px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${
              step === 1 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm'
            }`}
          >
            <ChevronLeft size={18} /> Previous Step
          </button>
          
          {step < 4 ? (
            <button 
              onClick={() => setStep(step + 1)}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 shadow-xl shadow-slate-100 transition-all flex items-center gap-2 active:scale-95"
            >
              Next Step <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              onClick={() => {
                alert('Course submitted for admin approval!');
                navigate('/instructor/courses');
              }}
              className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center gap-2 active:scale-95"
            >
              <CheckCircle2 size={20} />
              Submit for Approval
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
