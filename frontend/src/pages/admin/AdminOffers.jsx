import React, { useState, useEffect } from 'react';
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
  Edit,
  Loader2
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import adminService from '../../services/adminService';
import { toast } from 'react-hot-toast';

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllOffers();
      setOffers(data);
    } catch (error) {
      console.error('Failed to fetch offers', error);
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await adminService.deleteOffer(id);
        toast.success('Offer deleted');
        setOffers(offers.filter(o => o._id !== id));
      } catch (error) {
        toast.error('Failed to delete offer');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Loading offers...</p>
      </div>
    );
  }

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
        {offers.map((offer) => (
          <div key={offer._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex group">
            <div className={`w-32 sm:w-40 flex flex-col items-center justify-center text-white shrink-0 p-4 relative overflow-hidden ${
              offer.status === 'Active' ? 'bg-blue-600' : 
              offer.status === 'Scheduled' ? 'bg-amber-500' : 'bg-slate-400'
            }`}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <Tag className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-3xl font-black">{offer.discount}</span>
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">Discount</span>
            </div>

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
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Start Date</p>
                    <p className="font-semibold">{new Date(offer.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">End Date</p>
                    <p className="font-semibold">{new Date(offer.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> {offer.usageCount || 0} <span className="text-slate-400 font-medium">Used</span>
                   </div>
                   <StatusBadge status={offer.status} />
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                  <button 
                    onClick={() => handleDelete(offer._id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {offers.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium bg-white rounded-2xl border border-dashed border-slate-200">
            No active offers found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOffers;
