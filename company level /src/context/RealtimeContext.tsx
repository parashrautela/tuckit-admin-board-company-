import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Terminal,
  Booking,
  StateCoverage,
  PESITStudent,
  PESITManager,
  RefundRequest,
  RefundTransaction,
  StaffCreditRequest,
  StaffProfile,
  PricingConfig,
  StateGSTConfig,
  UserItem,
  AdminUser,
  RoleConfig,
  AuditLog,
  AlertItem,
} from '../types';
import {
  initialTerminals,
  calculateStateCoverage,
  initialBookings,
  initialPESITStudents,
  initialPESITManagers,
  initialRefundRequests,
  initialRefundTransactions,
  initialStaffCreditRequests,
  initialStaffProfiles,
  initialPricingConfigs,
  initialStateGST,
  initialUsers,
  initialAdmins,
  initialRoles,
  initialAuditLogs,
  initialAlerts,
} from '../data/mockData';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface RealtimeContextType {
  terminals: Terminal[];
  stateCoverage: StateCoverage[];
  bookings: Booking[];
  pesitStudents: PESITStudent[];
  pesitManagers: PESITManager[];
  refundRequests: RefundRequest[];
  refundTransactions: RefundTransaction[];
  staffCreditRequests: StaffCreditRequest[];
  staffProfiles: StaffProfile[];
  pricingConfigs: PricingConfig[];
  stateGSTConfigs: StateGSTConfig[];
  users: UserItem[];
  admins: AdminUser[];
  roles: RoleConfig[];
  auditLogs: AuditLog[];
  alerts: AlertItem[];
  
  // Real-time Feed KPIs
  lastCheckedTime: string;
  heartbeatTick: number;
  totalTerminals: number;
  onlineDevices: number;
  offlineDevices: number;
  onlinePercentage: number;
  wsConnectedCount: number;
  connectionDistribution: { ws: number; lan: number; sim: number; wifi: number };
  pendingRefundsCount: number;
  pendingStaffCreditsCount: number;
  totalAlertsCount: number;

  // Actions
  addAuditLog: (action: string, resource: string, resourceId: string, details?: string, status?: 'SUCCESS' | 'WARNING' | 'FAILED') => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  forceUnlockLocker: (terminalCode: string, lockerName: string, reason?: string) => Promise<boolean>;
  smsUnlockLocker: (mobile: string, terminalCode: string, lockerName: string) => Promise<boolean>;
  rebootTerminal: (terminalCode: string) => Promise<boolean>;
  restartTerminalService: (terminalCode: string) => Promise<boolean>;
  updateTerminalSoftware: (terminalCode: string, version: string) => Promise<boolean>;
  blacklistUser: (mobile: string, reason: string) => Promise<boolean>;
  unblockUser: (mobile: string) => Promise<boolean>;
  approveRefund: (refundId: string) => Promise<boolean>;
  rejectRefund: (refundId: string) => Promise<boolean>;
  approveStaffCredit: (creditId: string) => Promise<boolean>;
  addBooking: (booking: Partial<Booking>) => void;
  addSiteAndTerminal: (siteName: string, state: string, city: string, siteType: Terminal['siteType']) => void;
  refreshFeed: () => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [terminals, setTerminals] = useState<Terminal[]>(initialTerminals);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [pesitStudents, setPesitStudents] = useState<PESITStudent[]>(initialPESITStudents);
  const [pesitManagers, setPesitManagers] = useState<PESITManager[]>(initialPESITManagers);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>(initialRefundRequests);
  const [refundTransactions, setRefundTransactions] = useState<RefundTransaction[]>(initialRefundTransactions);
  const [staffCreditRequests, setStaffCreditRequests] = useState<StaffCreditRequest[]>(initialStaffCreditRequests);
  const [staffProfiles, setStaffProfiles] = useState<StaffProfile[]>(initialStaffProfiles);
  const [pricingConfigs, setPricingConfigs] = useState<PricingConfig[]>(initialPricingConfigs);
  const [stateGSTConfigs, setStateGSTConfigs] = useState<StateGSTConfig[]>(initialStateGST);
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);
  const [roles, setRoles] = useState<RoleConfig[]>(initialRoles);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [heartbeatTick, setHeartbeatTick] = useState(0);
  const [lastCheckedTime, setLastCheckedTime] = useState(() => new Date().toLocaleTimeString());

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = `${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // 10-second automatic IoT heartbeat simulation as specified
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartbeatTick(t => t + 1);
      const now = new Date();
      setLastCheckedTime(now.toLocaleTimeString());

      // Update heartbeat timestamps subtly
      setTerminals(prev =>
        prev.map(term => {
          if (term.connectivityStatus === 'ONLINE') {
            const newSeconds = Math.max(2, (term.heartbeatSecondsAgo + 10) % 25);
            return {
              ...term,
              heartbeatSecondsAgo: newSeconds,
              lastHeartbeatAt: `${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`,
            };
          } else {
            return {
              ...term,
              heartbeatSecondsAgo: term.heartbeatSecondsAgo + 10,
            };
          }
        })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const refreshFeed = () => {
    const now = new Date();
    setLastCheckedTime(now.toLocaleTimeString());
    setTerminals(prev =>
      prev.map(term => ({
        ...term,
        heartbeatSecondsAgo: term.connectivityStatus === 'ONLINE' ? Math.floor(Math.random() * 8) + 1 : term.heartbeatSecondsAgo,
        lastHeartbeatAt: term.connectivityStatus === 'ONLINE' ? `${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : term.lastHeartbeatAt,
      }))
    );
    showToast('Terminal telemetry synchronized in real time', 'success');
  };

  const stateCoverage = useMemo(() => calculateStateCoverage(terminals), [terminals]);

  const totalTerminals = terminals.length;
  const onlineDevices = useMemo(() => terminals.filter(t => t.connectivityStatus === 'ONLINE').length, [terminals]);
  const offlineDevices = totalTerminals - onlineDevices;
  const onlinePercentage = totalTerminals > 0 ? Math.round((onlineDevices / totalTerminals) * 100) : 0;
  const wsConnectedCount = onlineDevices;

  const connectionDistribution = useMemo(() => {
    let ws = 0, lan = 0, sim = 0, wifi = 0;
    terminals.forEach(t => {
      if (t.networkType === 'WS' || t.networkType === 'LAN') lan++;
      if (t.networkType === 'SIM') sim++;
      if (t.networkType === 'WiFi') wifi++;
      if (t.connectivityStatus === 'ONLINE') ws++;
    });
    return { ws, lan, sim, wifi };
  }, [terminals]);

  const pendingRefundsCount = useMemo(() => refundRequests.filter(r => r.status === 'PENDING').length, [refundRequests]);
  const pendingStaffCreditsCount = useMemo(() => staffCreditRequests.filter(s => s.status === 'PENDING').length, [staffCreditRequests]);
  const totalAlertsCount = useMemo(() => alerts.filter(a => a.status === 'UNRESOLVED').length, [alerts]);

  const addAuditLog = (action: string, resource: string, resourceId: string, details: string = '', status: 'SUCCESS' | 'WARNING' | 'FAILED' = 'SUCCESS') => {
    const newLog: AuditLog = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toLocaleString([], { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      actor: 'parash',
      actorRole: 'SUPERADMIN',
      action,
      resource,
      resourceId,
      ipAddress: '103.212.144.12',
      status,
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const forceUnlockLocker = async (terminalCode: string, lockerName: string, reason = 'Operator force unlock command'): Promise<boolean> => {
    addAuditLog('LOCKER_FORCE_OPEN', 'LOCKER', `${terminalCode}/${lockerName}`, `Force unlocked locker door: ${reason}`);
    showToast(`Command sent: Force open signal broadcast to ${terminalCode} (${lockerName})`, 'success');
    return true;
  };

  const smsUnlockLocker = async (mobile: string, terminalCode: string, lockerName: string): Promise<boolean> => {
    addAuditLog('LOCKER_SMS_OPEN', 'LOCKER', `${terminalCode}/${lockerName}`, `SMS unlock link dispatched to mobile ${mobile}`);
    showToast(`SMS unlock payload sent to ${mobile} for locker ${lockerName}`, 'success');
    return true;
  };

  const rebootTerminal = async (terminalCode: string): Promise<boolean> => {
    addAuditLog('TERMINAL_REBOOT', 'TERMINAL', terminalCode, 'Dispatched remote hardware reboot via MQTT daemon');
    showToast(`Reboot signal successfully delivered to terminal ${terminalCode}`, 'warning');
    return true;
  };

  const restartTerminalService = async (terminalCode: string): Promise<boolean> => {
    addAuditLog('TERMINAL_RESTART', 'TERMINAL', terminalCode, 'Dispatched systemd kiosk service restart');
    showToast(`Kiosk service restarted on ${terminalCode}`, 'success');
    return true;
  };

  const updateTerminalSoftware = async (terminalCode: string, version: string): Promise<boolean> => {
    addAuditLog('TERMINAL_UPDATE_SOFTWARE', 'TERMINAL', terminalCode, `Triggered OTA update pipeline to firmware ${version}`);
    setTerminals(prev => prev.map(t => (t.code === terminalCode ? { ...t, firmwareVersion: version } : t)));
    showToast(`Firmware update ${version} queued for ${terminalCode}`, 'success');
    return true;
  };

  const blacklistUser = async (mobile: string, reason: string): Promise<boolean> => {
    setUsers(prev =>
      prev.map(u => (u.mobileNumber.includes(mobile) ? { ...u, status: 'BLOCKED', blockedReason: reason, blockedAt: new Date().toLocaleString(), blockedBy: 'parash' } : u))
    );
    addAuditLog('USER_BLACKLIST', 'USER', mobile, `Blacklisted user with reason: ${reason}`, 'WARNING');
    showToast(`User ${mobile} has been blacklisted from Tuckit network`, 'error');
    return true;
  };

  const unblockUser = async (mobile: string): Promise<boolean> => {
    setUsers(prev =>
      prev.map(u => (u.mobileNumber.includes(mobile) ? { ...u, status: 'ACTIVE', blockedReason: undefined, blockedAt: undefined, blockedBy: undefined } : u))
    );
    addAuditLog('USER_UNBLOCK', 'USER', mobile, 'Lifted blacklist restriction from user profile');
    showToast(`User ${mobile} unblocked successfully`, 'success');
    return true;
  };

  const approveRefund = async (refundId: string): Promise<boolean> => {
    const ref = refundRequests.find(r => r.id === refundId);
    if (!ref) return false;

    setRefundRequests(prev => prev.map(r => (r.id === refundId ? { ...r, status: 'APPROVED' } : r)));
    const newTx: RefundTransaction = {
      id: `ref_tx_${Date.now()}`,
      refundId: ref.id,
      bookingInvoice: ref.bookingInvoice,
      customerName: ref.customerName,
      amount: ref.amount,
      settledAt: new Date().toLocaleString(),
      status: 'SETTLED',
      gateway: 'Razorpay UPI Autopay',
      processedBy: 'parash',
    };
    setRefundTransactions(prev => [newTx, ...prev]);
    addAuditLog('REFUND_APPROVED', 'REFUND', ref.bookingInvoice, `Approved refund of ₹${ref.amount} for customer ${ref.customerName}`);
    showToast(`Refund of ₹${ref.amount} approved and settled for ${ref.customerName}`, 'success');
    return true;
  };

  const rejectRefund = async (refundId: string): Promise<boolean> => {
    const ref = refundRequests.find(r => r.id === refundId);
    if (!ref) return false;

    setRefundRequests(prev => prev.map(r => (r.id === refundId ? { ...r, status: 'REJECTED' } : r)));
    addAuditLog('REFUND_REJECTED', 'REFUND', ref.bookingInvoice, `Rejected refund request for customer ${ref.customerName}`, 'WARNING');
    showToast(`Refund request rejected for ${ref.customerName}`, 'info');
    return true;
  };

  const approveStaffCredit = async (creditId: string): Promise<boolean> => {
    const req = staffCreditRequests.find(s => s.id === creditId);
    if (!req) return false;

    setStaffCreditRequests(prev => prev.map(s => (s.id === creditId ? { ...s, status: 'APPROVED' } : s)));
    setStaffProfiles(prev =>
      prev.map(p => (p.name === req.staffName ? { ...p, creditLimit: p.creditLimit + req.amount } : p))
    );
    addAuditLog('STAFF_CREDIT_APPROVED', 'STAFF_CREDIT', req.staffName, `Allocated cash float credit of ₹${req.amount}`);
    showToast(`Approved float credit of ₹${req.amount} for ${req.staffName}`, 'success');
    return true;
  };

  const addBooking = (booking: Partial<Booking>) => {
    const newBkg: Booking = {
      id: `bkg_${Date.now()}`,
      serialNumber: bookings.length + 1,
      terminalCode: booking.terminalCode || 'TCK-KA-001',
      invoiceNumber: `TCK-INV-2026-${9000 + bookings.length}`,
      customerName: booking.customerName || 'Walk-in Guest',
      mobileNumber: booking.mobileNumber || '+91 99000 11223',
      openDateTime: new Date().toLocaleString(),
      bookingStatus: 'ACTIVE',
      paymentMethod: booking.paymentMethod || 'UPI',
      lockName: booking.lockName || 'LKR-A01',
      passcode: `${Math.floor(1000 + Math.random() * 9000)}`,
      duration: booking.duration || '3 Hours',
      bookingType: booking.bookingType || 'BAGGAGE',
      bookingSource: booking.bookingSource || 'Web',
      siteType: booking.siteType || 'Mall',
      state: booking.state || 'Karnataka',
      city: booking.city || 'Bangalore',
      amount: booking.amount || 150,
    };
    setBookings(prev => [newBkg, ...prev]);
    showToast(`New booking created: ${newBkg.invoiceNumber}`, 'success');
  };

  const addSiteAndTerminal = (siteName: string, state: string, city: string, siteType: Terminal['siteType']) => {
    const count = terminals.length + 1;
    const code = `TCK-${state.substring(0, 2).toUpperCase()}-${String(count).padStart(3, '0')}`;
    const newTerminal: Terminal = {
      id: `term_${code.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      code,
      siteName,
      state,
      city,
      siteType,
      lockerType: 'BAGGAGE',
      lifecycleStatus: 'ACTIVE',
      connectivityStatus: 'ONLINE',
      networkType: 'WS',
      firmwareVersion: 'v1.2.04',
      deviceType: 'BEST VIEW',
      locationPin: `${5000 + count}`,
      lastHeartbeatAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      heartbeatSecondsAgo: 2,
      totalLockers: 24,
      availableLockers: 24,
      occupiedLockers: 0,
      ipAddress: `192.168.1.${10 + (count % 240)}`,
      tailscaleIp: `100.64.0.${count}`,
    };
    setTerminals(prev => [newTerminal, ...prev]);
    addAuditLog('SITE_CREATE_AND_INSTALL', 'SITE', code, `Installed new terminal station at ${siteName}, ${city}`);
    showToast(`Site and terminal ${code} configured successfully!`, 'success');
  };

  return (
    <RealtimeContext.Provider
      value={{
        terminals,
        stateCoverage,
        bookings,
        pesitStudents,
        pesitManagers,
        refundRequests,
        refundTransactions,
        staffCreditRequests,
        staffProfiles,
        pricingConfigs,
        stateGSTConfigs,
        users,
        admins,
        roles,
        auditLogs,
        alerts,
        lastCheckedTime,
        heartbeatTick,
        totalTerminals,
        onlineDevices,
        offlineDevices,
        onlinePercentage,
        wsConnectedCount,
        connectionDistribution,
        pendingRefundsCount,
        pendingStaffCreditsCount,
        totalAlertsCount,
        addAuditLog,
        showToast,
        toasts,
        removeToast,
        forceUnlockLocker,
        smsUnlockLocker,
        rebootTerminal,
        restartTerminalService,
        updateTerminalSoftware,
        blacklistUser,
        unblockUser,
        approveRefund,
        rejectRefund,
        approveStaffCredit,
        addBooking,
        addSiteAndTerminal,
        refreshFeed,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};
