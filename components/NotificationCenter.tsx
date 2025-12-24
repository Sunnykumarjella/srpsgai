
import React, { useEffect, useState } from 'react';
import { Notification, User } from '../types';
import { getStoredNotifications, markNotificationsAsRead } from '../store';

interface NotificationCenterProps {
  user: User;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ user, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const all = getStoredNotifications();
    setNotifications(all.filter(n => n.userId === user.id));
    markNotificationsAsRead(user.id);
  }, [user.id]);

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
          <div>
            <h3 className="text-xl font-bold">Your Mailbox</h3>
            <p className="text-xs text-indigo-100">Simulated Email Notifications</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <i className="fas fa-envelope-open text-5xl opacity-20"></i>
              <p className="font-medium">No emails yet.</p>
            </div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className={`p-4 rounded-2xl border ${n.type === 'EMAIL' ? 'border-indigo-100 bg-indigo-50/30' : 'border-slate-100 bg-white'} hover:shadow-md transition-all group`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center text-sm ${n.type === 'EMAIL' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                    <i className={n.type === 'EMAIL' ? 'fas fa-envelope' : 'fas fa-bell'}></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 font-bold">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                    <div className="mt-2 text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                      <i className="fas fa-paper-plane text-[8px]"></i> E-Mail Notification Sent
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <p className="text-[10px] text-center text-slate-400 font-medium">
            SmartPass Automated Notification Engine
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
