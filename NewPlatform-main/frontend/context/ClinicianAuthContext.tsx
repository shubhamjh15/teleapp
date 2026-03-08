/**
 * Clinician Auth Context (Zustand store)
 *
 * Manages all clinician authentication state:
 *   - OTP flow
 *   - Clinician profile
 *   - Session management
 *   - Onboarding
 */

import { create } from 'zustand';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ClinicianProfile {
  id?: number;
  name?: string;
  full_name?: string;
  email?: string;
  specialty?: string;
  phone?: string;
  registrationId?: string;
}

export interface ActiveSession {
  id: string;
  device_name: string;
  device_type: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  location: string;
  ip_address: string;
  last_active: string;
  is_current: boolean;
}

export interface ClinicianAuthState {
  // Auth state
  error: string | null;
  otpPhone: string | null;
  otpAttempts: number;
  isOtpLocked: boolean;
  isAuthenticated: boolean;

  // Profile
  clinician: ClinicianProfile | null;

  // Sessions
  sessions: ActiveSession[];
  sessionWarningVisible: boolean;
  lastActivity: number;

  // Actions — OTP
  clearError: () => void;
  sendOTP: (phone: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  resendOTP: () => Promise<void>;
  resetOTP: () => void;

  // Actions — Onboarding
  submitOnboarding: (data: any) => Promise<void>;

  // Actions — Sessions
  loadSessions: () => Promise<void>;
  terminateSession: (sessionId: string) => Promise<void>;
  logoutAll: () => Promise<void>;
  logout: () => Promise<void>;
  showSessionWarning: () => void;
  hideSessionWarning: () => void;
  recordActivity: () => void;
}

// ─── Mock Sessions Data ───────────────────────────────────────────────────────

const MOCK_SESSIONS: ActiveSession[] = [
  {
    id: 'session_001',
    device_name: 'iPhone 15 Pro — iOS 17',
    device_type: 'mobile',
    location: 'Mumbai, Maharashtra',
    ip_address: '103.27.9.82',
    last_active: new Date().toISOString(),
    is_current: true,
  },
  {
    id: 'session_002',
    device_name: 'MacBook Pro — Chrome 121',
    device_type: 'desktop',
    location: 'Pune, Maharashtra',
    ip_address: '117.55.23.14',
    last_active: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    is_current: false,
  },
];

// ─── Store ────────────────────────────────────────────────────────────────────

export const useClinicianAuthStore = create<ClinicianAuthState>((set, get) => ({
  // ── Initial state ──────────────────────────────────────────────────────────
  error: null,
  otpPhone: null,
  otpAttempts: 0,
  isOtpLocked: false,
  isAuthenticated: false,

  clinician: {
    id: 1,
    name: 'Dr. Esther Howard',
    full_name: 'Dr. Esther Howard',
    email: 'esther.howard@arthrosync.com',
    specialty: 'Orthopedic Surgeon',
    phone: '+91 9876543210',
    registrationId: 'MCI-2019-1234',
  },

  sessions: [],
  sessionWarningVisible: false,
  lastActivity: Date.now(),

  // ── Error ──────────────────────────────────────────────────────────────────
  clearError: () => set({ error: null }),

  // ── OTP Flow ───────────────────────────────────────────────────────────────
  sendOTP: async (phone) => {
    console.log('[ClinicianAuth] Sending OTP to', phone);
    set({ otpPhone: phone, error: null });
  },
  verifyOTP: async (otp) => {
    console.log('[ClinicianAuth] Verifying OTP', otp);
    if (otp === '123456') {
      set({ error: null, isAuthenticated: true });
    } else {
      set((state) => ({
        otpAttempts: state.otpAttempts + 1,
        error: 'Invalid OTP',
      }));
      throw new Error('Invalid OTP');
    }
  },
  resendOTP: async () => {
    console.log('[ClinicianAuth] Resending OTP');
  },
  resetOTP: () =>
    set({ otpPhone: null, otpAttempts: 0, isOtpLocked: false, error: null }),

  // ── Onboarding ─────────────────────────────────────────────────────────────
  submitOnboarding: async (data) => {
    console.log('[ClinicianAuth] Submitting onboarding data', data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Update clinician profile with submitted data
    set((state) => ({
      clinician: {
        ...state.clinician,
        name: data.fullName || state.clinician?.name,
        full_name: data.fullName || state.clinician?.full_name,
        specialty: data.specialty || state.clinician?.specialty,
        registrationId: data.registrationId || state.clinician?.registrationId,
      },
      isAuthenticated: true,
    }));
  },

  // ── Sessions ───────────────────────────────────────────────────────────────
  loadSessions: async () => {
    console.log('[ClinicianAuth] Loading sessions');
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({ sessions: MOCK_SESSIONS });
  },

  terminateSession: async (sessionId) => {
    console.log('[ClinicianAuth] Terminating session', sessionId);
    await new Promise((resolve) => setTimeout(resolve, 300));
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== sessionId),
    }));
  },

  logoutAll: async () => {
    console.log('[ClinicianAuth] Logging out all sessions');
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({
      sessions: [],
      isAuthenticated: false,
      clinician: null,
      otpPhone: null,
    });
  },

  logout: async () => {
    console.log('[ClinicianAuth] Logging out');
    await new Promise((resolve) => setTimeout(resolve, 200));
    set({
      isAuthenticated: false,
      clinician: null,
      otpPhone: null,
      sessions: [],
      error: null,
    });
  },

  showSessionWarning: () => set({ sessionWarningVisible: true }),
  hideSessionWarning: () => set({ sessionWarningVisible: false }),
  recordActivity: () => set({ lastActivity: Date.now() }),
}));

export default useClinicianAuthStore;
