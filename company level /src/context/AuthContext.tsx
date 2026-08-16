import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminSession } from '../types';
import { initialAdminSession } from '../data/mockData';

interface AuthContextType {
  session: AdminSession | null;
  user: AdminSession | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<AdminSession>;
  logout: () => void;
  hasPermission: (permission: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AdminSession | null>(() => {
    const saved = localStorage.getItem('tuckit_admin_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialAdminSession;
      }
    }
    return initialAdminSession; // Logged in by default for smooth demo/replica
  });

  const login = async (username: string, password: string): Promise<AdminSession> => {
    // Exact requested credentials check or standard admin
    if ((username === 'parash' && password === 'Tuckit@200') || (username === 'admin' && password === 'admin123')) {
      const userSession: AdminSession = {
        ...initialAdminSession,
        username,
        name: username === 'parash' ? 'Parash Rautela' : 'Super Administrator',
      };
      setSession(userSession);
      localStorage.setItem('tuckit_admin_session', JSON.stringify(userSession));
      return userSession;
    }

    if (username.toLowerCase().includes('ops')) {
      const userSession: AdminSession = {
        id: 'usr_ops_01',
        username,
        name: 'Operations Officer',
        email: `${username}@tuckit.in`,
        role: 'OPERATIONS',
        roleName: 'Operations Lead',
        permissions: ['PAGE:DASHBOARD', 'PAGE:BOOKINGS', 'PAGE:REPORTS', 'PAGE:TERMINALS', 'PAGE:REFUNDS', 'PAGE:ALERTS', 'ACTION:LOCKER_FORCE_OPEN', 'ACTION:LOCKER_RELEASE', 'ACTION:TERMINAL_REBOOT'],
      };
      setSession(userSession);
      localStorage.setItem('tuckit_admin_session', JSON.stringify(userSession));
      return userSession;
    }

    throw new Error('Invalid credentials. Please enter parash / Tuckit@200');
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem('tuckit_admin_session');
  };

  const hasPermission = (permission: string | string[]): boolean => {
    if (!session) return false;
    if (session.role === 'SUPERADMIN' || session.permissions.includes('ALL')) return true;
    const required = Array.isArray(permission) ? permission : [permission];
    return required.some(p => session.permissions.includes(p));
  };

  return (
    <AuthContext.Provider value={{ session, user: session, isAuthenticated: !!session, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
