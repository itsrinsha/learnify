import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Calendar, 
  Percent, 
  BookOpen, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle
} from 'lucide-react';

const InstructorOffers = () => {
  const [showOfferForm, setShowOfferForm] = useState(false);

  const offers = [
    {
      id: 1,
      course: 'Advanced React 19',
      originalPrice: '₹2,499',
      offerPrice: '₹1,999',
      discount: '20%',
      startDate: 'May 01, 2026',
      endDate: 'May 10, 2026',
      status: 'Active',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      course: 'Node.js Microservices',
      originalPrice: '₹3,299',
      offerPrice: '₹2,499',
      discount: '24%',
      startDate: 'May 15, 2026',
      endDate: 'May 20, 2026',
      status: 'Scheduled',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      course: 'UI/UX Fundamentals',
      originalPrice: '₹1,499',
      offerPrice: '₹999',
      discount: '33%',
      startDate: 'Apr 20, 2026',
      endDate: 'Apr 30, 2026',
      status: 'Expired',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Course Offers</h2>
          <p className="text-slate-500 mt-1 font-medium">Create and manage discounts for your approved courses.</p>
        </div>
        <button 
          onClick={() => setShowOfferForm(true)}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3 active:scale-95"
        >
          <Plus size={20} />
          Create New Offer
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <h4 className="text-3xl font-black text-slate-900">01</h4>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Offers</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Clock size={28} />
          </div>
          <div>
            <h4 className="text-3xl font-black text-slate-900">01</h4>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Scheduled</p>
          </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full -mr-16 -mt-16 opacity-50 blur-3xl"></div>
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center relative z-10">
            <Percent size={28} />
          </div>
          <div className="relative z-10">
            <h4 className="text-3xl font-black">24%</h4>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Avg. Discount Rate</p>
          </div>
        </div>
      </div>

      {/* Offers List */}
      <div className="grid gap-8">
        {offers.map((offer) => (
          <div key={offer.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all group">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-72 h-48 lg:h-auto relative overflow-hidden flex-shrink-0">
                <img src={offer.thumbnail} alt={offer.course} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="bg-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest text-slate-900 shadow-2xl">
                     {offer.discount} OFF
                   </div>
                </div>
              </div>

              <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        offer.status === 'Active' ? 'bg-green-50 text-green-600 animate-pulse' :
                        offer.status === 'Scheduled' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {offer.status}
                      </span>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Tag size={12} className="text-blue-600" /> Promo Active
                      </p>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">{offer.course}</h3>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-2xl font-black text-blue-600">{offer.offerPrice}</p>
                      <p className="text-sm text-slate-400 line-through font-bold">{offer.originalPrice}</p>
                    </div>
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all border border-slate-100">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-10 mt-8 pt-8 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Date</p>
                      <p className="text-sm font-bold text-slate-900">{offer.startDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End Date</p>
                      <p className="text-sm font-bold text-slate-900">{offer.endDate}</p>
                    </div>
                  </div>
                  <div className="flex-1"></div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-100">
                      Edit Offer
                    </button>
                    {offer.status === 'Active' && (
                      <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-xs hover:bg-red-50 transition-all">
                        End Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Offer Form Modal */}
      {showOfferForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Create New Offer</h3>
                <p className="text-slate-500 font-medium text-sm mt-1">Boost your enrollments with limited time discounts.</p>
              </div>
              <button onClick={() => setShowOfferForm(false)} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Select Course</label>
                <select className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                  <option>Advanced React 19 (Approved)</option>
                  <option>Node.js Microservices (Approved)</option>
                </select>
                <p className="text-[10px] text-slate-400 font-medium px-1 flex items-center gap-1">
                  <AlertCircle size={10} /> Only approved courses are eligible for offers.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Offer Price (₹)</label>
                  <input type="number" placeholder="1999" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Discount %</label>
                  <input type="number" placeholder="20" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Start Date</label>
                  <input type="date" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">End Date</label>
                  <input type="date" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
              </div>
              <div className="pt-6">
                <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">
                  Launch Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorOffers;
