
export enum UserRole {
  STUDENT = 'STUDENT',
  FACULTY = 'FACULTY',
  ADMIN = 'ADMIN'
}

export enum PassStatus {
  PENDING = 'PENDING',
  FACULTY_APPROVED = 'FACULTY_APPROVED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum PassType {
  BUS = 'BUS',
  TRAIN = 'TRAIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  institutionId: string;
}

export interface HistoryEntry {
  status: PassStatus | 'APPLIED';
  actionBy: string;
  timestamp: string;
  remarks?: string;
}

export interface TravelPassRequest {
  id: string;
  studentId: string;
  studentName: string;
  institutionId: string;
  passType: PassType;
  source: string;
  destination: string;
  durationMonths: number;
  status: PassStatus;
  appliedDate: string;
  facultyRemarks?: string;
  adminRemarks?: string;
  uniqueCode?: string;
  lastActionBy?: string;
  history: HistoryEntry[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'EMAIL' | 'SYSTEM';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
