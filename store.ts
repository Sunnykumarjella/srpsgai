
import { User, TravelPassRequest, UserRole, Notification } from './types';

const USERS_KEY = 'smartpass_users';
const PASSES_KEY = 'smartpass_requests';
const NOTIFICATIONS_KEY = 'smartpass_notifications';

export const getStoredUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUser = (user: User) => {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getStoredPasses = (): TravelPassRequest[] => {
  const data = localStorage.getItem(PASSES_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePassRequest = (pass: TravelPassRequest) => {
  const passes = getStoredPasses();
  passes.push(pass);
  localStorage.setItem(PASSES_KEY, JSON.stringify(passes));
};

export const updatePassRequest = (updatedPass: TravelPassRequest) => {
  const passes = getStoredPasses();
  const index = passes.findIndex(p => p.id === updatedPass.id);
  if (index !== -1) {
    passes[index] = updatedPass;
    localStorage.setItem(PASSES_KEY, JSON.stringify(passes));
  }
};

export const deleteUser = (userId: string) => {
  const users = getStoredUsers();
  const filtered = users.filter(u => u.id !== userId);
  localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
};

export const getStoredNotifications = (): Notification[] => {
  const data = localStorage.getItem(NOTIFICATIONS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveNotification = (notification: Notification) => {
  const notifications = getStoredNotifications();
  notifications.unshift(notification);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
};

export const markNotificationsAsRead = (userId: string) => {
  const notifications = getStoredNotifications();
  const updated = notifications.map(n => n.userId === userId ? { ...n, isRead: true } : n);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
};

// Initial admin if none exists
if (getStoredUsers().length === 0) {
  saveUser({
    id: 'admin-001',
    name: 'System Administrator',
    email: 'admin@smartpass.com',
    role: UserRole.ADMIN,
    password: 'password123',
    institutionId: 'ADMIN-01'
  });
}
