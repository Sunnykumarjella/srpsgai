
import React, { useState, useEffect } from 'react';
import { User, TravelPassRequest, PassStatus } from '../types';
import { getStoredPasses } from '../store';
import PassRequestModal from './PassRequestModal';
import { generatePassPDF } from '../services/pdfService';

interface StudentDashboardProps {
  user: User;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user }) => {
  const [requests, setRequests] = useState<TravelPassRequest[]>([]);
  const [showModal, setShowModal] = useState(false);

  const fetchRequests = () => {
    const all = getStoredPasses();
    setRequests(all.filter(r => r.studentId === user.id));
  };

  useEffect(() => {
    fetchRequests();
  }, [user.id]);

  const getStatusColor = (status: PassStatus) => {
    switch (status) {
      case PassStatus.PENDING: return 'bg-amber-100 text-amber-700 border-amber-200';
      case PassStatus.FACULTY_APPROVED: return 'bg-blue-100 text-blue-700 border-blue-200';
      case PassStatus.APPROVED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case PassStatus.REJECTED: return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const isApproved = (status: PassStatus) => 
    status === PassStatus.APPROVED || status === PassStatus.FACULTY_APPROVED;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Travel Passes</h1>
          <p className="text-slate-500">Track and manage your institutional travel passes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <i className="fas fa-plus"></i> Apply New
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
          <div className="bg-slate-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <i className="fas fa-folder-open text-3xl"></i>
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Applications Yet</h3>
          <p className="text-slate-500 mt-2 mb-6">Apply for your first travel pass to see it here.</p>
          <button
            onClick={() => setShowModal(true)}
            className="text-blue-600 font-bold hover:underline"
          >
            Start application process
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map(req => (
            <div key={req.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl ${
                  req.passType === 'BUS' ? 'bg-orange-50 text-orange-600' : 'bg-cyan-50 text-cyan-600'
                }`}>
                  <i className={`fas fa-${req.passType === 'BUS' ? 'bus' : 'train'}`}></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-tight">{req.passType} PASS</h4>
                  <p className="text-sm text-slate-500 font-medium">
                    {req.source} <i className="fas fa-long-arrow-alt-right mx-1 text-slate-300"></i> {req.destination}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Applied: {new Date(req.appliedDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(req.status)}`}>
                  {req.status === PassStatus.FACULTY_APPROVED ? 'APPROVED (FACULTY)' : req.status.replace('_', ' ')}
                </span>
                
                {isApproved(req.status) && (
                  <button
                    onClick={() => generatePassPDF(req, user)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <i className="fas fa-download"></i> Download Pass
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <PassRequestModal
          user={user}
          onClose={() => setShowModal(false)}
          onSuccess={fetchRequests}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
