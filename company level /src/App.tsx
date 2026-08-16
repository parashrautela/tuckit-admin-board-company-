import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RealtimeProvider } from './context/RealtimeContext';
import { Layout } from './components/layout/Layout';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Reports } from './pages/Reports';
import { DeviceStatus } from './pages/DeviceStatus';
import { LockerStatus } from './pages/LockerStatus';
import { FutureFirst } from './pages/FutureFirst';
import { PESITTerminals } from './pages/PESITTerminals';
import { PESITStudents } from './pages/PESITStudents';
import { PESITManagers } from './pages/PESITManagers';
import { RefundRequests } from './pages/RefundRequests';
import { RefundHistory } from './pages/RefundHistory';
import { PricingControl } from './pages/PricingControl';
import { StateGST } from './pages/StateGST';
import { StaffCredit } from './pages/StaffCredit';
import { StaffProfiles } from './pages/StaffProfiles';
import { UsersPage } from './pages/Users';
import { Admins } from './pages/Admins';
import { EmployeeMonitor } from './pages/EmployeeMonitor';
import { Roles } from './pages/Roles';
import { BlacklistHistory } from './pages/BlacklistHistory';
import { AuditLogs } from './pages/AuditLogs';
import { Profile } from './pages/Profile';
import { SystemAlerts } from './pages/SystemAlerts';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RealtimeProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="reports" element={<Reports />} />
              <Route path="device-status" element={<DeviceStatus />} />
              <Route path="locker-status" element={<LockerStatus />} />
              <Route path="future-first" element={<FutureFirst />} />
              <Route path="pesit-terminals" element={<PESITTerminals />} />
              <Route path="pesit-students" element={<PESITStudents />} />
              <Route path="pesit-managers" element={<PESITManagers />} />
              <Route path="refund-requests" element={<RefundRequests />} />
              <Route path="refund-history" element={<RefundHistory />} />
              <Route path="pricing" element={<PricingControl />} />
              <Route path="state-gst" element={<StateGST />} />
              <Route path="staff-credit" element={<StaffCredit />} />
              <Route path="staff-profiles" element={<StaffProfiles />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="admins" element={<Admins />} />
              <Route path="employee-monitor" element={<EmployeeMonitor />} />
              <Route path="roles" element={<Roles />} />
              <Route path="blacklist-history" element={<BlacklistHistory />} />
              <Route path="audit-logs" element={<AuditLogs />} />
              <Route path="profile" element={<Profile />} />
              <Route path="alerts" element={<SystemAlerts />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </RealtimeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
