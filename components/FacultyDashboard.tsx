
import React, { useState, useEffect } from 'react';
import { User, TravelPassRequest, PassStatus, Notification, HistoryEntry } from '../types';
import { getStoredPasses, updatePassRequest, saveNotification } from '../store';
import { analyzeRequests } from '../services/geminiService';

interface FacultyDashboardProps {
  user: User;
}

const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ user }) => {
  const [requests, setRequests] = useState<TravelPassRequest[]>([]);
  const [aiSummary, setAiSummary] = useState('Generating AI insights...');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const all = getStoredPasses();
    const pending = all.filter(r => r.status === PassStatus.PENDING);
    setRequests(pending);
    
    if (pending.length > 0) {
      const summary = await analyzeRequests(pending);
      setAiSummary(summary);
    } else {
      setAiSummary("No pending requests to analyze.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = (request: TravelPassRequest, status: PassStatus) => {
    const now = new Date().toISOString();
    const actionBy = `Faculty: ${user.name}`;
    const remarks = `Verified and recommended by ${user.name}`;
    
    const newHistoryEntry: HistoryEntry = {
      status,
      actionBy,
      timestamp: now,
      remarks
    };

    const updated = {
      ...request,
      status,
      lastActionBy: actionBy,
      facultyRemarks: remarks,
      history: [...(request.history || []), newHistoryEntry]
    };
    updatePassRequest(updated);

    // Trigger Email Notification simulation
    const emailNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: request.studentId,
      title: status === PassStatus.FACULTY_APPROVED ? 'Pass Application Updated' : 'Application Status Update',
      message: `Dear ${request.studentName}, your ${request.passType} pass application from ${request.source} to ${request.destination} has been ${status === PassStatus.FACULTY_APPROVED ? 'APPROVED' : 'REJECTED'} by Faculty ${user.name}. ${status === PassStatus.FACULTY_APPROVED ? 'You can now download your pass from the dashboard.' : 'Please contact the faculty for more details.'}`,
      timestamp: now,
      isRead: false,
      type: 'EMAIL'
    };
    saveNotification(emailNotif);

    fetchData();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Faculty Verification</h1>
        <p className="text-slate-500">Review and verify student travel pass applications</p>
      </div>

      {/* AI Assistant Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-8 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <i className="fas fa-robot"></i>
          </div>
          <h3 className="font-bold text-lg">AI Verification Assistant</h3>
        </div>
        <p className="text-blue-50/90 leading-relaxed text-sm">
          {loading ? "Analyzing queue..." : aiSummary}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800">Pending Approvals ({requests.length})</h3>
        </div>
        
        {requests.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <i className="fas fa-check-circle text-4xl mb-3 block"></i>
            <p className="font-medium">All caught up! No pending requests.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {requests.map(req => (
              <div key={req.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-900">{req.studentName}</h4>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-md font-bold border border-slate-200 uppercase">{req.institutionId}</span>
                  </div>
                  <div className="text-sm text-slate-600 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <i className={`fas fa-${req.passType === 'BUS' ? 'bus' : 'train'} text-slate-400`}></i>
                      {req.passType}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="fas fa-map-marker-alt text-slate-400"></i>
                      {req.source} to {req.destination}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(req, PassStatus.REJECTED)}
                    className="px-4 py-2 rounded-lg text-sm font-bold border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction(req, PassStatus.FACULTY_APPROVED)}
                    className="px-4 py-2 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors"
                  >
                    Approve Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
