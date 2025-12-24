
import React, { useState, useEffect } from 'react';
import { User, TravelPassRequest, PassStatus, UserRole, Notification, HistoryEntry } from '../types';
import { getStoredPasses, updatePassRequest, getStoredUsers, deleteUser, saveNotification } from '../store';
import PassHistoryModal from './PassHistoryModal';

const AdminDashboard: React.FC = () => {
  const [view, setView] = useState<'REQUESTS' | 'USERS'>('REQUESTS');
  const [filter, setFilter] = useState<PassStatus | 'ALL'>('ALL');
  const [requests, setRequests] = useState<TravelPassRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<TravelPassRequest | null>(null);

  const refresh = () => {
    setRequests(getStoredPasses());
    setUsers(getStoredUsers());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleOverride = (req: TravelPassRequest, status: PassStatus) => {
    const isCorrection = req.status !== PassStatus.PENDING;
    const now = new Date().toISOString();
    const actionBy = 'System Administrator';
    const remarks = isCorrection 
      ? `ADMIN OVERRIDE: Corrected status to ${status} from ${req.status}` 
      : `Direct Administrative Approval`;

    const newHistoryEntry: HistoryEntry = {
      status,
      actionBy,
      timestamp: now,
      remarks
    };

    updatePassRequest({ 
      ...req, 
      status, 
      lastActionBy: actionBy,
      adminRemarks: remarks,
      history: [...(req.history || []), newHistoryEntry]
    });

    const emailNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: req.studentId,
      title: 'Administrative Pass Update',
      message: `Dear ${req.studentName}, your travel pass status has been modified by the System Administrator. New Status: ${status}. Message: ${isCorrection ? 'An administrative override was performed on a previous faculty decision.' : 'Your application was processed directly by the admin.'}`,
      timestamp: now,
      isRead: false,
      type: 'EMAIL'
    };
    saveNotification(emailNotif);
    refresh();
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Delete this user? This cannot be undone.')) {
      deleteUser(id);
      refresh();
    }
  };

  const filteredRequests = requests.filter(r => filter === 'ALL' ? true : r.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <i className="fas fa-shield-alt text-indigo-600"></i>
            Admin Center
          </h1>
          <p className="text-slate-500 font-medium">Intervene and override decisions</p>
        </div>
        <div className="flex w-full md:w-auto bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200">
          <button
            onClick={() => setView('REQUESTS')}
            className={`flex-1 md:px-6 py-2 rounded-lg font-bold text-sm transition-all ${
              view === 'REQUESTS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Pass Registry
          </button>
          <button
            onClick={() => setView('USERS')}
            className={`flex-1 md:px-6 py-2 rounded-lg font-bold text-sm transition-all ${
              view === 'USERS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Users
          </button>
        </div>
      </div>

      {view === 'REQUESTS' ? (
        <div className="space-y-4">
          <div className="flex overflow-x-auto pb-2 md:pb-0 md:flex-wrap gap-2 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm scrollbar-hide">
            <span className="hidden md:flex text-xs font-black text-slate-400 uppercase tracking-widest mr-2 items-center gap-2">
              <i className="fas fa-filter text-indigo-400"></i> Filter:
            </span>
            {(['ALL', ...Object.values(PassStatus)] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  filter === s 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">Student</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">Route</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400 border border-indigo-100">
                          <i className="fas fa-user-graduate"></i>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{req.studentName}</p>
                          <p className="text-[10px] text-indigo-600 font-mono font-black tracking-wider uppercase">{req.institutionId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${
                            req.passType === 'BUS' ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-cyan-50 border-cyan-200 text-cyan-600'
                          }`}>
                            {req.passType}
                          </span>
                          <span className="text-sm text-slate-700 font-semibold">{req.source} → {req.destination}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-black border inline-block uppercase ${
                          req.status === PassStatus.APPROVED ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                          req.status === PassStatus.FACULTY_APPROVED ? 'bg-blue-50 text-blue-600 border-blue-200' :
                          req.status === PassStatus.REJECTED ? 'bg-rose-50 text-rose-600 border-rose-200' :
                          'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {req.status.replace('_', ' ')}
                        </span>
                        <button onClick={() => setSelectedHistory(req)} className="text-[9px] text-indigo-400 font-black uppercase tracking-tighter hover:text-indigo-600 ml-2 border-b border-indigo-100">Audit</button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {req.status !== PassStatus.APPROVED && req.status !== PassStatus.FACULTY_APPROVED ? (
                          <button onClick={() => handleOverride(req, PassStatus.APPROVED)} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-black shadow-md shadow-emerald-100">Approve</button>
                        ) : (
                          <button onClick={() => handleOverride(req, PassStatus.REJECTED)} className="bg-rose-100 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-black border border-rose-200">Revoke</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {filteredRequests.length === 0 ? (
               <div className="text-center py-24 text-slate-400 italic">No applications found.</div>
            ) : (
              filteredRequests.map(req => (
                <div key={req.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-400">
                        <i className="fas fa-user-graduate"></i>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 leading-none">{req.studentName}</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{req.institutionId}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-[9px] font-black border uppercase ${
                      req.status === PassStatus.APPROVED ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                      req.status === PassStatus.FACULTY_APPROVED ? 'bg-blue-50 text-blue-600 border-blue-200' :
                      req.status === PassStatus.REJECTED ? 'bg-rose-50 text-rose-600 border-rose-200' :
                      'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Route</span>
                      <p className="text-sm font-bold text-slate-700">{req.source} → {req.destination}</p>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded border uppercase ${
                      req.passType === 'BUS' ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-cyan-50 border-cyan-100 text-cyan-600'
                    }`}>
                      {req.passType}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedHistory(req)}
                      className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider"
                    >
                      Audit Log
                    </button>
                    {req.status !== PassStatus.APPROVED && req.status !== PassStatus.FACULTY_APPROVED ? (
                      <button 
                        onClick={() => handleOverride(req, PassStatus.APPROVED)}
                        className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-100"
                      >
                        Approve
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleOverride(req, PassStatus.REJECTED)}
                        className="flex-1 py-3 bg-rose-100 text-rose-600 rounded-xl text-xs font-black uppercase tracking-wider"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(u => (
            <div key={u.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group">
              <div className="flex justify-between items-start mb-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl ${
                  u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-600' :
                  u.role === UserRole.FACULTY ? 'bg-indigo-100 text-indigo-600' :
                  'bg-sky-100 text-sky-600'
                }`}>
                  <i className={`fas fa-${u.role === UserRole.ADMIN ? 'shield-alt' : u.role === UserRole.FACULTY ? 'user-tie' : 'user-graduate'}`}></i>
                </div>
                <span className="px-2 py-1 bg-slate-50 text-[10px] font-black rounded text-slate-400 border border-slate-200 uppercase tracking-tighter">{u.role}</span>
              </div>
              <h3 className="font-black text-slate-900 truncate mb-1">{u.name}</h3>
              <p className="text-sm text-slate-500 font-medium mb-4">{u.email}</p>
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">ID: {u.institutionId}</span>
                {u.role !== UserRole.ADMIN && (
                  <button onClick={() => handleDeleteUser(u.id)} className="text-rose-400 hover:text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <i className="fas fa-trash-alt"></i> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedHistory && (
        <PassHistoryModal request={selectedHistory} onClose={() => setSelectedHistory(null)} />
      )}
    </div>
  );
};

export default AdminDashboard;
