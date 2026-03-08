/**
 * Clinic Service — API calls for clinic management
 * Using STATIC/DUMMY data for frontend testing
 */

import { getAccessToken } from '../auth/authService';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';
const USE_STATIC_DATA = process.env.EXPO_PUBLIC_USE_STATIC_DATA !== 'false';

// ─── Types ────────────────────────────────────────────────────────────────

export interface Clinic {
  id: number;
  name: string;
  registration_number: string;
  clinic_type: string;
  contact_number: string;
  email: string;
  license_document?: string;
  country: string;
  state: string;
  city: string;
  address: string;
  zip_code: string;
  status: 'pending' | 'approved' | 'rejected';
  assigned_admin_id?: number;
  assigned_admin_name?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClinicPayload {
  name: string;
  registration_number: string;
  clinic_type: string;
  admin_name: string;
  contact_number: string;
  email: string;
  license_document?: string;
  country: string;
  state: string;
  city: string;
  address: string;
  zip_code: string;
}

export interface AssignAdminPayload {
  clinic_id: number;
  user_id: number;
}

export interface User {
  id: number;
  mobile_number: string;
  role: string;
  name?: string;
  email?: string;
}

// ─── Static/Dummy Data ────────────────────────────────────────────────────

let staticClinics: Clinic[] = [
  {
    id: 1,
    name: 'City Medical Center',
    registration_number: 'REG-2024-001',
    clinic_type: 'Hospital',
    contact_number: '9876543210',
    email: 'contact@citymedical.com',
    license_document: 'license_001.pdf',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: '123 Main Street, Downtown',
    zip_code: '400001',
    status: 'approved',
    assigned_admin_id: 2,
    assigned_admin_name: 'Dr. Rajesh Kumar',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-02-01T14:20:00Z',
  },
  {
    id: 2,
    name: 'Green Valley Hospital',
    registration_number: 'REG-2024-002',
    clinic_type: 'Multi-Specialty Clinic',
    contact_number: '9876543211',
    email: 'info@greenvalley.com',
    license_document: 'license_002.pdf',
    country: 'India',
    state: 'Maharashtra',
    city: 'Pune',
    address: '456 Park Avenue, Green Valley',
    zip_code: '411001',
    status: 'pending',
    created_at: '2024-02-10T09:15:00Z',
    updated_at: '2024-02-10T09:15:00Z',
  },
  {
    id: 3,
    name: 'Apollo Diagnostics',
    registration_number: 'REG-2024-003',
    clinic_type: 'Diagnostic Center',
    contact_number: '9876543212',
    email: 'apollo@diagnostics.com',
    license_document: 'license_003.pdf',
    country: 'India',
    state: 'Karnataka',
    city: 'Bangalore',
    address: '789 Healthcare Lane, Medical District',
    zip_code: '560001',
    status: 'approved',
    assigned_admin_id: 3,
    assigned_admin_name: 'Dr. Priya Sharma',
    created_at: '2024-01-20T11:45:00Z',
    updated_at: '2024-01-28T16:30:00Z',
  },
  {
    id: 4,
    name: 'HealthCare Plus Clinic',
    registration_number: 'REG-2024-004',
    clinic_type: 'Primary Care Clinic',
    contact_number: '9876543213',
    email: 'contact@healthcareplus.com',
    country: 'India',
    state: 'Delhi',
    city: 'Delhi',
    address: '321 Wellness Road, Health Plaza',
    zip_code: '110001',
    status: 'pending',
    created_at: '2024-02-15T08:00:00Z',
    updated_at: '2024-02-15T08:00:00Z',
  },
  {
    id: 5,
    name: 'Sunrise Medical Hub',
    registration_number: 'REG-2024-005',
    clinic_type: 'Specialty Clinic',
    contact_number: '9876543214',
    email: 'info@sunrisemedical.com',
    license_document: 'license_005.pdf',
    country: 'India',
    state: 'Telangana',
    city: 'Hyderabad',
    address: '555 Sunrise Boulevard, East Wing',
    zip_code: '500001',
    status: 'pending',
    created_at: '2024-02-18T10:30:00Z',
    updated_at: '2024-02-18T10:30:00Z',
  },
];

let staticUsers: User[] = [
  {
    id: 1,
    mobile_number: '9876543210',
    role: 'super_admin',
    name: 'Super Admin',
    email: 'admin@healthscan360.com',
  },
  {
    id: 2,
    mobile_number: '9876543211',
    role: 'clinician_admin',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh@citymedical.com',
  },
  {
    id: 3,
    mobile_number: '9876543212',
    role: 'clinician_admin',
    name: 'Dr. Priya Sharma',
    email: 'priya@apollo.com',
  },
  {
    id: 4,
    mobile_number: '9876543213',
    role: 'clinician_admin',
    name: 'Dr. Amit Patel',
    email: 'amit@healthcare.com',
  },
  {
    id: 5,
    mobile_number: '9876543214',
    role: 'clinician',
    name: 'Dr. Sneha Reddy',
    email: 'sneha@medical.com',
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────

const getAuthHeaders = async () => {
  const token = await getAccessToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Simulate network delay
const delay = (ms: number) => new Promise<void>(resolve => setTimeout(() => resolve(), ms));

// ─── API Functions ────────────────────────────────────────────────────────

/**
 * Fetch all clinics
 */
export const getClinics = async (): Promise<Clinic[]> => {
  // Static data mode
  if (USE_STATIC_DATA) {
    await delay(500); // Simulate network delay
    return [...staticClinics];
  }

  // Real API mode
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/clinics/`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch clinics');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching clinics:', error);
    throw error;
  }
};

/**
 * Get clinic by ID
 */
export const getClinicById = async (id: number): Promise<Clinic> => {
  // Static data mode
  if (USE_STATIC_DATA) {
    await delay(500); // Simulate network delay
    const clinic = staticClinics.find((c) => c.id === id);
    if (!clinic) {
      throw new Error('Clinic not found');
    }
    return { ...clinic };
  }

  // Real API mode
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/clinics/${id}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch clinic');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching clinic:', error);
    throw error;
  }
};

/**
 * Create new clinic
 */
export const createClinic = async (data: CreateClinicPayload): Promise<Clinic> => {
  // Static data mode
  if (USE_STATIC_DATA) {
    await delay(800); // Simulate network delay
    const newClinic: Clinic = {
      id: staticClinics.length + 1,
      ...data,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    staticClinics.push(newClinic);
    return { ...newClinic };
  }

  // Real API mode
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/clinics/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create clinic');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating clinic:', error);
    throw error;
  }
};

/**
 * Approve clinic
 */
export const approveClinic = async (id: number): Promise<Clinic> => {
  // Static data mode
  if (USE_STATIC_DATA) {
    await delay(600); // Simulate network delay
    const clinic = staticClinics.find((c) => c.id === id);
    if (!clinic) {
      throw new Error('Clinic not found');
    }
    clinic.status = 'approved';
    clinic.updated_at = new Date().toISOString();
    return { ...clinic };
  }

  // Real API mode
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/clinics/${id}/approve`, {
      method: 'PUT',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to approve clinic');
    }

    return await response.json();
  } catch (error) {
    console.error('Error approving clinic:', error);
    throw error;
  }
};

/**
 * Assign clinician admin to clinic
 */
export const assignClinicianAdmin = async (data: AssignAdminPayload): Promise<any> => {
  // Static data mode
  if (USE_STATIC_DATA) {
    await delay(600); // Simulate network delay
    const clinic = staticClinics.find((c) => c.id === data.clinic_id);
    const user = staticUsers.find((u) => u.id === data.user_id);
    
    if (!clinic) {
      throw new Error('Clinic not found');
    }
    if (!user) {
      throw new Error('User not found');
    }
    
    clinic.assigned_admin_id = user.id;
    clinic.assigned_admin_name = user.name || user.mobile_number;
    clinic.updated_at = new Date().toISOString();
    
    return { message: 'Admin assigned successfully', clinic: { ...clinic } };
  }

  // Real API mode
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/clinics/${data.clinic_id}/assign-admin`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ user_id: data.user_id }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to assign admin');
    }

    return await response.json();
  } catch (error) {
    console.error('Error assigning admin:', error);
    throw error;
  }
};

/**
 * Get all users (for admin assignment)
 */
export const getUsers = async (): Promise<User[]> => {
  // Static data mode
  if (USE_STATIC_DATA) {
    await delay(500); // Simulate network delay
    return [...staticUsers];
  }

  // Real API mode
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/users/`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch users');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
