export interface AdminSession {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'OPERATIONS' | 'FIELD_STAFF' | 'PESIT_MANAGER';
  roleName: string;
  permissions: string[];
  avatarUrl?: string;
}

export interface Booking {
  id: string;
  serialNumber: number;
  terminalCode: string;
  invoiceNumber: string;
  customerName: string;
  mobileNumber: string;
  openDateTime: string;
  bookingStatus: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'PENDING' | 'OVERDUE';
  paymentMethod: 'UPI' | 'ONLINE' | 'PAY LATER' | 'CASH' | 'CARD' | 'WALLET';
  dateOfBirth?: string;
  lockName: string;
  passcode: string;
  duration: string;
  bookingType: 'BAGGAGE' | 'MOBILE';
  bookingSource: 'Web' | 'Touchscreen' | 'Mobile App' | 'WhatsApp';
  siteType: 'Mall' | 'Metro' | 'Railway' | 'Temple' | 'Airport' | 'Campus' | 'Commercial';
  state: string;
  city: string;
  amount: number;
  extraCharges?: number;
}

export interface Terminal {
  id: string;
  code: string;
  siteName: string;
  state: string;
  city: string;
  siteType: 'Mall' | 'Metro' | 'Railway' | 'Temple' | 'Airport' | 'Campus' | 'Commercial';
  lockerType: 'BAGGAGE' | 'MOBILE' | 'HYBRID';
  lifecycleStatus: 'ACTIVE' | 'INACTIVE';
  connectivityStatus: 'ONLINE' | 'OFFLINE';
  networkType: 'LAN' | 'SIM' | 'WiFi' | 'WS';
  firmwareVersion: string;
  deviceType: 'LEGACY' | 'BEST VIEW' | 'NEXTGEN';
  locationPin: string;
  lastHeartbeatAt: string;
  heartbeatSecondsAgo: number;
  totalLockers: number;
  availableLockers: number;
  occupiedLockers: number;
  ipAddress?: string;
  tailscaleIp?: string;
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
  size: 'SMALL' | 'MEDIUM' | 'LARGE' | 'XL' | '2 PHONE' | '4 PHONE' | '8 PHONE';
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'BLOCKED' | 'FAULTY';
  currentBookingId?: string;
  customerMobile?: string;
  assignedTime?: string;
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
  role: 'CASH_COLLECTOR' | 'FIELD_ENGINEER' | 'SUPERVISOR';
  branch: string;
  creditLimit: number;
  cashCollected: number;
  pendingSettlement: number;
  status: 'AVAILABLE' | 'ON_LEAVE' | 'INACTIVE';
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
  role: 'SUPERADMIN' | 'OPERATIONS' | 'FIELD_STAFF' | 'PESIT_MANAGER';
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
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  terminalCode?: string;
  timestamp: string;
  status: 'UNRESOLVED' | 'ACKNOWLEDGED' | 'RESOLVED';
}
