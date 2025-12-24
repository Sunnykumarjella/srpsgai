
import React from 'react';
import { TravelPassRequest, PassStatus } from '../types';

interface PassHistoryModalProps {
  request: TravelPassRequest;
  onClose: () => void;
}

const PassHistoryModal: React.FC<PassHistoryModalProps> = ({ request, onClose }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPLIED': return 'fa-file-signature text-blue-500 bg-blue-50';
      case PassStatus.PENDING: return 'fa-clock text-amber-500 bg-amber-50';
      case PassStatus.FACULTY_APPROVED: return 'fa-user-check text-indigo-500 bg-indigo-50';
      case PassStatus.APPROVED: return 'fa-check-circle text-emerald-500 bg-emerald-50';
      case PassStatus.REJECTED: return 'fa-times-circle text-rose-500 bg-rose-50';
      default: return 'fa-info-circle text-slate-500 bg-slate-50';
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === 'APPLIED') return 'Application Submitted';
    return status.replace('_', ' ');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-xl font-black text-slate-900">Application Audit Log</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{request.uniqueCode} • {request.studentName}</p>
          </div>
          <button onClick={onClose} className="bg-white p-2 rounded-full shadow-sm hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all border border-slate-200">
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {(!request.history || request.history.length === 0) ? (
            <div className="text-center py-12">
              <i className="fas fa-history text-4xl text-slate-200 mb-3"></i>
              <p className="text-slate-400 font-medium">No history log available for this application.</p>
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-100 ml-4 space-y-10">
              {request.history.map((entry, index) => (
                <div key={index} className="relative pl-10">
                  <div className={`absolute -left-[21px] top-0 h-10 w-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-sm ${getStatusIcon(entry.status)}`}>
                    <i className={`fas ${getStatusIcon(entry.status).split(' ')[0]}`}></i>
                  </div>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm">
                      {getStatusLabel(entry.status)}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      {new Date(entry.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                    <p className="text-xs text-slate-600 font-semibold mb-1">
                      <i className="fas fa-user-circle mr-1 text-slate-400"></i> {entry.actionBy}
                    </p>
                    {entry.remarks && (
                      <p className="text-xs text-slate-500 italic leading-relaxed">
                        <i className="fas fa-quote-left mr-2 opacity-20"></i>{entry.remarks}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-indigo-50 border-t border-indigo-100 flex items-center justify-center">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
            End of History Log • SmartPass Internal Audit
          </p>
        </div>
      </div>
    </div>
  );
};

export default PassHistoryModal;
