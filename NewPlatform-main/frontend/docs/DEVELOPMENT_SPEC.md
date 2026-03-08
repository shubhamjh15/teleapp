# 🏥 HealthScan360 — Development Specification

> **⚠️ MANDATORY: Read this ENTIRE document before writing ANY code.**
> This is the single source of truth for all development work on this project.

---

## 📌 Project Overview

| Key          | Value                                        |
| ------------ | -------------------------------------------- |
| **App Name** | HealthScan360                                |
| **Platform** | React Native (Expo SDK 55)                   |
| **Target**   | iOS, Android, Web                            |
| **Frontend** | This repo (`frontend/`)                      |
| **Backend**  | Separate repo — handled by backend developer |
| **API Base** | `EXPO_PUBLIC_API_URL` from `.env`            |

---

## 🚨 GOLDEN RULES — MUST FOLLOW

### 1. ❌ NO Backend Code

- **Backend developer alag hai** — sirf API contracts define karo
- Backend ka koi bhi code (Django, FastAPI, Node, DB models) mat likho
- Sirf frontend TypeScript/React Native code likhna hai

### 2. ✅ Backend-Ready Architecture

- Har API call `common/services/` mein honi chahiye (centralized)
- Har service file mein **dual mode** hona chahiye:
  - `USE_STATIC_DATA = true` → Dummy/static data return karo (frontend testing ke liye)
  - `USE_STATIC_DATA = false` → Real API call karo (`fetch` with auth headers)
- `.env` mein `EXPO_PUBLIC_USE_STATIC_DATA=true` se toggle hota hai
- **Backend developer ko sirf `.env` mein URL daalna hai aur `EXPO_PUBLIC_USE_STATIC_DATA=false` karna hai** — bas, frontend backend se connect ho jayega

### 3. 📄 API Contracts Clearly Defined

- Har API endpoint ka **method, URL, request body, response body** clearly define karo
- TypeScript interfaces use karo — yeh backend developer ke liye documentation ka kaam karengi
- Backend developer ko ye file share karo taaki woh exact same shape mein API banaye

### 4. 🗂️ Folder Structure Follow Karo

```
frontend/
├── App.tsx                    # Entry point
├── .env                       # Environment variables
├── common/                    # Shared code across all roles
│   ├── auth/                  # Login, OTP, Splash, authService
│   ├── components/            # Reusable UI components (Header, Drawer)
│   ├── navigation/            # DrawerNavigator, StackNavigators
│   └── services/              # ALL API service files go here
├── client/                    # Patient/Client role screens
├── clinician/                 # Clinician role screens
├── clinicianadmin/            # Clinician Admin role screens
└── superadmin/                # Super Admin role screens
```

### 5. 🎨 Design System

- Primary color: `#6D2ACE` (Purple)
- Secondary colors: `#3E82D7` (Blue), `#34C759` (Green), `#FF9500` (Orange)
- Background: `#F8F9FA`
- Cards: White (`#FFFFFF`) with subtle shadows
- Border radius: `12-16px`
- Font weights: `700` for titles, `600` for labels, `400-500` for body

---

## 🔐 Authentication Flow

### Screens

1. **LoginScreen** → Enter mobile number → Request OTP
2. **OTPScreen** → Enter 6-digit OTP → Verify
3. **SplashScreen** → Welcome animation → Continue to Main App
4. **Main App** → Drawer Navigation with role-based screens

### API Endpoints

| #   | Endpoint            | Method | Request                                  | Response                                                     |
| --- | ------------------- | ------ | ---------------------------------------- | ------------------------------------------------------------ |
| 1   | `/auth/request-otp` | POST   | `{ mobile_number: string }`              | `{ message: string }`                                        |
| 2   | `/auth/verify-otp`  | POST   | `{ mobile_number: string, otp: string }` | `{ access_token, refresh_token, token_type, user_id, role }` |

### Token Storage

- Tokens stored in `AsyncStorage` with keys prefixed `@healthscan360_`
- `access_token` sent in `Authorization: Bearer <token>` header for all API calls
- File: `common/auth/authService.ts`

---

## 🏗️ Modules & Screens

### Module 1: Onboarding (Super Admin)

**Screen: OnboardScreen** (`client/OnboardScreen.tsx`)

- Dashboard showing counts: Total Clinics, Clinician Admins, Clinicians, Pending
- 3 action cards → Navigate to Clinic / Clinician Admin / Clinician management
- Pull-to-refresh, live data from API

---

### Module 2: Clinic Management

**Screens:**
| Screen | File | Purpose |
|---|---|---|
| ClinicDashboardScreen | `clinicianadmin/ClinicDashboardScreen.tsx` | Dashboard with stats + recent clinics |
| AddClinicScreen | `clinicianadmin/AddClinicScreen.tsx` | Multi-section form to register clinic |
| AllClinicsScreen | `superadmin/AllClinicsScreen.tsx` | List all clinics with status |
| ApproveClinicScreen | `superadmin/ApproveClinicScreen.tsx` | View & approve pending clinics |
| AssignClinicianAdminScreen | `superadmin/AssignClinicianAdminScreen.tsx` | Assign admin to clinic |
| ReviewClinicDetailsScreen | `clinicianadmin/ReviewClinicDetailsScreen.tsx` | View full clinic details |

**Navigation:** `ClinicStackNavigator` (Stack inside Drawer)

**API Endpoints:**

| #   | Endpoint                    | Method | Request               | Response              | Purpose           |
| --- | --------------------------- | ------ | --------------------- | --------------------- | ----------------- |
| 1   | `/clinics/`                 | GET    | —                     | `Clinic[]`            | List all clinics  |
| 2   | `/clinics/:id`              | GET    | —                     | `Clinic`              | Get clinic by ID  |
| 3   | `/clinics/`                 | POST   | `CreateClinicPayload` | `Clinic`              | Create new clinic |
| 4   | `/clinics/:id/approve`      | PUT    | —                     | `Clinic`              | Approve clinic    |
| 5   | `/clinics/:id/assign-admin` | POST   | `{ user_id: number }` | `{ message, clinic }` | Assign admin      |

**TypeScript Interfaces:**

```typescript
interface Clinic {
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
  status: "pending" | "approved" | "rejected";
  assigned_admin_id?: number;
  assigned_admin_name?: string;
  created_at: string;
  updated_at: string;
}

interface CreateClinicPayload {
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
```

**Service File:** `common/services/clinicService.ts`

---

### Module 3: User Management

**Screens:**
| Screen | File | Purpose |
|---|---|---|
| ClinicianManagementScreen | `superadmin/ClinicianManagementScreen.tsx` | List clinicians |
| ClinicianAdminManagementScreen | `superadmin/ClinicianAdminManagementScreen.tsx` | List clinician admins |

**API Endpoints:**

| #   | Endpoint  | Method | Request | Response | Purpose        |
| --- | --------- | ------ | ------- | -------- | -------------- |
| 1   | `/users/` | GET    | —       | `User[]` | List all users |

**TypeScript Interface:**

```typescript
interface User {
  id: number;
  mobile_number: string;
  role: string; // 'super_admin' | 'clinician_admin' | 'clinician' | 'patient'
  name?: string;
  email?: string;
}
```

---

## 🧩 Service File Pattern — MUST FOLLOW

Every service file in `common/services/` **MUST** follow this exact pattern:

```typescript
// common/services/exampleService.ts

import { getAccessToken } from "../auth/authService";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
const USE_STATIC_DATA = process.env.EXPO_PUBLIC_USE_STATIC_DATA !== "false";

// ─── Types ────────────────────────────────────────────────
export interface ExampleItem {
  id: number;
  name: string;
  // ... define all fields
}

// ─── Static Data (for frontend testing) ───────────────────
let staticItems: ExampleItem[] = [
  { id: 1, name: "Test Item" },
  // ... dummy data
];

// ─── Helper ───────────────────────────────────────────────
const getAuthHeaders = async () => {
  const token = await getAccessToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// ─── API Functions ────────────────────────────────────────
export const getItems = async (): Promise<ExampleItem[]> => {
  // STATIC MODE
  if (USE_STATIC_DATA) {
    await delay(500);
    return [...staticItems];
  }

  // REAL API MODE
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/items/`, {
      method: "GET",
      headers,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to fetch items");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};
```

### Key Points:

- `USE_STATIC_DATA` → `true` = dummy data, `false` = real API
- Static data mein realistic dummy data daalo
- Real API mein proper error handling rakho
- All API calls authenticated via `getAuthHeaders()`

---

## ⚙️ Environment Setup (.env)

```env
# API Base URL — backend developer apna URL daalega
EXPO_PUBLIC_API_URL=https://your-backend-url.com/api/v1

# Static Data Toggle
# true  = Frontend dummy data (development)
# false = Real backend API calls (production/integration)
EXPO_PUBLIC_USE_STATIC_DATA=true

# Dummy OTP for testing (only works when USE_STATIC_DATA=true)
EXPO_PUBLIC_DUMMY_OTP=123456
```

### Backend Developer Ko Instructions:

1. `.env` mein `EXPO_PUBLIC_API_URL` update karo apne server ka URL
2. `EXPO_PUBLIC_USE_STATIC_DATA=false` set karo
3. API endpoints match karo is document ke saath
4. Response shapes match karo TypeScript interfaces ke saath
5. All endpoints authenticated honge via `Authorization: Bearer <token>`
6. CORS enable karo frontend ke domain ke liye

---

## 📋 Screen Development Checklist

Jab bhi naya screen banao, ye follow karo:

- [ ] Screen file correct folder mein hai (role-based: `client/`, `clinician/`, `superadmin/`, `clinicianadmin/`)
- [ ] `Header` component use kiya hai
- [ ] Loading state hai (`ActivityIndicator`)
- [ ] Error handling hai (try/catch + user-friendly message)
- [ ] Empty state hai (jab data empty ho)
- [ ] Pull-to-refresh hai (agar list screen hai)
- [ ] Navigation properly configured hai (`DrawerNavigator` ya `StackNavigator` mein)
- [ ] API calls `common/services/` mein centralized hain
- [ ] Service file mein dual mode hai (static + real API)
- [ ] TypeScript interfaces defined hain
- [ ] Form validation hai (agar form screen hai)
- [ ] Back button hai (agar stack screen hai)

---

## 🔄 Navigation Structure

```
App.tsx
├── LoginScreen
├── OTPScreen
├── SplashScreen
└── DrawerNavigator
    ├── Home (HomeScreen)
    ├── Onboard (OnboardScreen)
    ├── ClinicManagement (ClinicStackNavigator)
    │   ├── ClinicDashboard
    │   ├── AddClinic
    │   ├── AssignClinicianAdmin
    │   ├── ReviewClinicDetails
    │   ├── ApproveClinic
    │   └── AllClinics
    ├── Configurations (ConfigurationsScreen)
    ├── Reports (ReportsScreen)
    ├── BusinessAssistant (BusinessAssistantScreen)
    ├── Settings (SettingsScreen)
    ├── ClinicianAdminManagement
    └── ClinicianManagement
```

---

## 📝 How to Add a New Feature

1. **Step 1:** Isme pehle requirement likho (is MD file mein)
2. **Step 2:** API endpoints define karo (method, URL, request, response)
3. **Step 3:** TypeScript interfaces banao
4. **Step 4:** Service file banao ya update karo (`common/services/`)
5. **Step 5:** Static/dummy data daalo testing ke liye
6. **Step 6:** Screen(s) banao
7. **Step 7:** Navigation mein add karo
8. **Step 8:** Test karo static data ke saath
9. **Step 9:** Backend developer ko API contract share karo

---

## 🚀 Upcoming Modules (To Be Defined)

> Neeche naye modules add honge jab user bolega. Har module ke liye screens, API endpoints, aur interfaces define kiye jayenge.

<!--
Add new modules below this line.
Format:
### Module X: [Name]
**Screens:** ...
**API Endpoints:** ...
**TypeScript Interfaces:** ...
-->

---

_Last updated: 2026-03-02_
_Maintained by: Development Team_
