
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { getStoredNotifications } from '../store';
import NotificationCenter from './NotificationCenter';
import MobileGuide from './MobileGuide';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileGuide, setShowMobileGuide] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      const fetchCount = () => {
        const all = getStoredNotifications();
        const count = all.filter(n => n.userId === user.id && !n.isRead).length;
        setUnreadCount(count);
      };
      fetchCount();
      const interval = setInterval(fetchCount, 3000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <i className="fas fa-ticket-alt"></i>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
              SmartPass
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {user && (
              <>
                <button 
                  onClick={() => setShowMobileGuide(true)}
                  className="p-2 text-indigo-500 hover:text-indigo-700 transition-colors bg-indigo-50 rounded-full"
                  title="Mobile App Setup"
                >
                  <i className="fas fa-mobile-screen-button"></i>
                </button>

                <button 
                  onClick={() => setShowNotifications(true)}
                  className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 rounded-full"
                >
                  <i className="fas fa-bell"></i>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-slate-900 leading-none mb-1">{user.name}</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{user.role}</p>
                </div>
                
                <button
                  onClick={onLogout}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 sm:px-4 sm:py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  <i className="fas fa-sign-out-alt sm:mr-2"></i>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {showNotifications && user && (
        <NotificationCenter user={user} onClose={() => setShowNotifications(false)} />
      )}
      {showMobileGuide && (
        <MobileGuide onClose={() => setShowMobileGuide(false)} />
      )}
    </nav>
  );
};

export default Navbar;
