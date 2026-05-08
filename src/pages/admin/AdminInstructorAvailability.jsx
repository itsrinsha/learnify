import React from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';

const availabilityData = [
  { id: 1, name: 'Dr. Sarah Jenkins', course: 'Data Science', date: '2024-05-10', slot: '10:00 AM - 12:00 PM', status: 'Available' },
  { id: 2, name: 'Mark Thompson', course: 'Web Development', date: '2024-05-10', slot: '02:00 PM - 04:00 PM', status: 'Booked' },
  { id: 3, name: 'Elena Rodriguez', course: 'UI/UX Design', date: '2024-05-11', slot: '09:00 AM - 11:00 AM', status: 'Available' },
  { id: 4, name: 'Michael Chen', course: 'Cloud Computing', date: '2024-05-11', slot: '03:00 PM - 05:00 PM', status: 'Unavailable' },
];

const AdminInstructorAvailability = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Instructor Availability</h2>
          <p className="text-slate-500">Manage and monitor instructor time slots for live sessions and support.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search instructors..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all"
          />
        </div>
        <input type="date" className="bg-slate-50 border-none text-sm font-medium text-slate-600 rounded-xl focus:ring-0 px-4 py-2" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Instructor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course/Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time Slot</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {availabilityData.map((slot) => (
                <tr key={slot.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{slot.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{slot.course}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" /> {slot.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" /> {slot.slot}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded text-xs font-bold ${
                       slot.status === 'Available' ? 'bg-green-100 text-green-700' :
                       slot.status === 'Booked' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                     }`}>
                       {slot.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg"><MoreVertical className="w-5 h-5 text-slate-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInstructorAvailability;
