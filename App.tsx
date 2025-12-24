
import React, { useState } from 'react';
import { User, UserRole } from './types';
import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import StudentDashboard from './components/StudentDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('smartpass_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('smartpass_current_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('smartpass_current_user');
  };

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case UserRole.STUDENT:
        return <StudentDashboard user={user} />;
      case UserRole.FACULTY:
        return <FacultyDashboard user={user} />;
      case UserRole.ADMIN:
        return <AdminDashboard />;
      default:
        return <div>Access Denied</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="flex-grow">
        <div className="py-6">
          {renderDashboard()}
        </div>
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} SmartPass System. All travel rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
