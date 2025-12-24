
import React, { useState } from 'react';
import { User, PassType, TravelPassRequest, PassStatus } from '../types';
import { savePassRequest } from '../store';
import { verifyRoute } from '../services/geminiService';

interface PassRequestModalProps {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

const PassRequestModal: React.FC<PassRequestModalProps> = ({ user, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    passType: PassType.BUS,
    source: '',
    destination: '',
    durationMonths: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // AI Simulation of "Smart" check
    const aiCheck = await verifyRoute(formData.source, formData.destination);
    
    const now = new Date().toISOString();
    const newRequest: TravelPassRequest = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: user.id,
      studentName: user.name,
      institutionId: user.institutionId,
      passType: formData.passType,
      source: formData.source,
      destination: formData.destination,
      durationMonths: Number(formData.durationMonths),
      status: PassStatus.PENDING,
      appliedDate: now,
      uniqueCode: `SP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      history: [
        {
          status: 'APPLIED' as any,
          actionBy: `Student: ${user.name}`,
          timestamp: now,
          remarks: 'Initial application submitted.'
        }
      ]
    };

    savePassRequest(newRequest);
    setLoading(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-bold text-slate-900">Apply for Travel Pass</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Pass Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, passType: PassType.BUS})}
                className={`py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${
                  formData.passType === PassType.BUS ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 hover:border-slate-200 text-slate-500'
                }`}
              >
                <i className="fas fa-bus"></i> Bus Pass
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, passType: PassType.TRAIN})}
                className={`py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${
                  formData.passType === PassType.TRAIN ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 hover:border-slate-200 text-slate-500'
                }`}
              >
                <i className="fas fa-train"></i> Train Pass
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Source Station/Stop</label>
              <input
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="E.g. Downtown"
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
              <input
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="E.g. University Campus"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Months)</label>
            <select
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.durationMonths}
              onChange={(e) => setFormData({...formData, durationMonths: Number(e.target.value)})}
            >
              <option value={1}>1 Month</option>
              <option value={3}>3 Months</option>
              <option value={6}>6 Months</option>
              <option value={12}>1 Year</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PassRequestModal;
