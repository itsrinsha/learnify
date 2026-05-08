import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Tag, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Trash2,
  Edit
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';

const offersData = [
  { id: 1, title: 'Ramadan Special Offer', discount: '40%', type: 'Platform-wide', status: 'Active', start: '2024-04-01', end: '2024-05-01', usage: 1250 },
  { id: 2, title: 'Summer Bootcamp Sale', discount: '25%', type: 'Category: Development', status: 'Scheduled', start: '2024-06-01', end: '2024-06-15', usage: 0 },
  { id: 3, title: 'New Instructor Promo', discount: '15%', type: 'Instructor: Mark Thompson', status: 'Active', start: '2024-05-10', end: '2024-05-20', usage: 45 },
  { id: 4, title: 'Black Friday 2023', discount: '50%', type: 'Platform-wide', status: 'Expired', start: '2023-11-20', end: '2023-11-30', usage: 5600 },
];

const AdminOffers = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Offer Management</h2>
          <p className="text-slate-500">Create and monitor discounts and promotional campaigns.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
          <Plus className="w-5 h-5" /> Create New Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {offersData.map((offer) => (
          <div key={offer.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex group">
            {/* Discount Side */}
            <div className={`w-32 sm:w-40 flex flex-col items-center justify-center text-white shrink-0 p-4 relative overflow-hidden ${
              offer.status === 'Active' ? 'bg-blue-600' : 
              offer.status === 'Scheduled' ? 'bg-amber-500' : 'bg-slate-400'
            }`}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <Tag className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-3xl font-black">{offer.discount}</span>
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">Discount</span>
            </div>

            {/* Content Side */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{offer.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-bold text-slate-600 uppercase tracking-tighter">
                      {offer.type}
                    </span>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-lg"><MoreVertical className="w-5 h-5 text-slate-400" /></button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Start Date</p>
                    <p className="font-semibold">{offer.start}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">End Date</p>
                    <p className="font-semibold">{offer.end}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> {offer.usage} <span className="text-slate-400 font-medium">Used</span>
                   </div>
                   <StatusBadge status={offer.status} />
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                  <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOffers;
