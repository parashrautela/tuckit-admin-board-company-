export interface AdminSession {
  id: string;
  username: string;
  name: string;
  email?: string | null;
  role: 'SUPERADMIN' | 'OPERATIONS' | 'FIELD_STAFF' | 'PESIT_MANAGER' | string;
  roleName: string;
  permissions: string[];
  avatarUrl?: string;
}

export interface Booking {
  id: string;
  serialNumber?: number;
  terminalCode: string;
  terminalSiteName?: string;
  invoiceNumber: string;
  customerName: string;
  mobileNumber: string;
  openDateTime: string;
  bookingStatus: 'ACTIVE' | 'PAID_ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'CANCEL_WITHOUT_TXN' | 'CANCEL_WITH_TXN' | 'PENDING' | 'OVERDUE' | 'WARNING' | 'DONE';
  paymentMethod: 'UPI' | 'ONLINE' | 'PAY LATER' | 'CASH' | 'CARD' | 'WALLET' | 'BANK' | 'UPI + Cash' | 'Credit Pay' | 'Manual Rev.' | string;
  dateOfBirth?: string;
  lockName: string;
  passcode: string;
  duration: string;
  bookingType: 'BAGGAGE' | 'MOBILE' | 'HYBRID';
  bookingSource: 'Web' | 'Touchscreen' | 'Mobile App' | 'WhatsApp' | 'Offline Payment / QR' | string;
  siteType: string;
  state: string;
  city: string;
  amount: number;
  extraCharges?: number;
  totalPaid?: number;
  status?: string;
  source?: string;
  lockerType?: string;
  lockerSize?: string;
  lockerDoorNumber?: string;
  checkinTime?: string;
  durationHours?: number;
  expectedCheckoutTime?: string;
  actualCheckoutTime?: string;
  transactionRef?: string;
  invoiceUrl?: string;
}

export interface Terminal {
  id: string;
  code: string;
  siteName: string;
  state: string;
  city: string;
  siteType: string;
  lockerType: 'BAGGAGE' | 'MOBILE' | 'HYBRID' | string;
  lifecycleStatus: 'ACTIVE' | 'INACTIVE' | string;
  connectivityStatus: 'ONLINE' | 'OFFLINE' | string;
  networkType: 'LAN' | 'SIM' | 'WiFi' | 'WS' | string;
  firmwareVersion: string;
  deviceType: string;
  locationPin: string;
  lastHeartbeatAt?: string;
  heartbeatSecondsAgo: number;
  totalLockers: number;
  availableLockers: number;
  occupiedLockers: number;
  ipAddress?: string;
  tailscaleIp?: string;
  wsConnected?: boolean;
}

export interface StateCoverage {
  state: string;
  total: number;
  online: number;
  offline: number;
}

export interface LockerItem {
  id: string;
  terminalId: string;
  terminalCode: string;
  siteName: string;
  state: string;
  lockName: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE' | 'XL' | '2 PHONE' | '4 PHONE' | '8 PHONE' | string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'BLOCKED' | 'FAULTY' | string;
  currentBookingId?: string;
  customerName?: string;
  customerMobile?: string;
  assignedTime?: string;
  duration?: string;
  amount?: number;
  passcode?: string;
  remarks?: string;
}

export interface PESITStudent {
  id: string;
  rollNumber: string;
  name: string;
  department: string;
  year: string;
  rfidCard: string;
  assignedTerminal: string;
  assignedLocker: string;
  allocatedAt: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
}

export interface PESITManager {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  mobileNumber: string;
  email: string;
  assignedTerminals: string[];
  status: 'ACTIVE' | 'INACTIVE';
}

export interface RefundRequest {
  id: string;
  bookingInvoice: string;
  customerName: string;
  mobileNumber: string;
  terminalCode: string;
  amount: number;
  requestedAt: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  paymentGatewayRef?: string;
}

export interface RefundTransaction {
  id: string;
  refundId: string;
  bookingInvoice: string;
  customerName: string;
  amount: number;
  settledAt: string;
  status: 'SETTLED' | 'FAILED';
  gateway: string;
  processedBy: string;
}

export interface StaffCreditRequest {
  id: string;
  staffName: string;
  staffMobile: string;
  amount: number;
  requestedAt: string;
  purpose: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface StaffProfile {
  id: string;
  name: string;
  mobile: string;
  role: 'CASH_COLLECTOR' | 'FIELD_ENGINEER' | 'SUPERVISOR' | string;
  branch: string;
  creditLimit: number;
  cashCollected: number;
  pendingSettlement: number;
  status: 'AVAILABLE' | 'ON_LEAVE' | 'INACTIVE' | string;
  bankAccount: string;
  ifscCode: string;
}

export interface PricingConfig {
  id: string;
  siteType: string;
  lockerSize: string;
  hourlyRate: number;
  threeHourRate: number;
  sixHourRate: number;
  twelveHourRate: number;
  twentyFourHourRate: number;
  excessHourlyRate: number;
  freeGraceMinutes: number;
}

export interface StateGSTConfig {
  id: string;
  state: string;
  cgst: number;
  sgst: number;
  igst: number;
  status: 'ACTIVE' | 'INACTIVE';
  updatedAt: string;
}

export interface UserItem {
  id: string;
  name: string;
  mobileNumber: string;
  email: string;
  totalBookings: number;
  lastBookingDate: string;
  status: 'ACTIVE' | 'BLOCKED';
  blockedReason?: string;
  blockedAt?: string;
  blockedBy?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'OPERATIONS' | 'FIELD_STAFF' | 'PESIT_MANAGER' | string;
  roleName: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin: string;
}

export interface RoleConfig {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
}

export interface AlertItem {
  id: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | string;
  title: string;
  description: string;
  terminalCode?: string;
  timestamp: string;
  status: 'UNRESOLVED' | 'ACKNOWLEDGED' | 'RESOLVED';
}
