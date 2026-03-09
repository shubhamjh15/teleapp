# teleapp

![React](https://img.shields.io/badge/-React-blue?logo=react&logoColor=white) ![React Native](https://img.shields.io/badge/-React Native-blue?logo=reactnative&logoColor=white) ![TypeScript](https://img.shields.io/badge/-TypeScript-blue?logo=typescript&logoColor=white)

## 📝 Description

teleapp is a high-performance, cross-platform communication solution designed to provide a seamless user experience across both web and mobile environments. Developed with TypeScript for superior type safety and maintainability, the application leverages React and React Native to ensure a unified interface and smooth transitions between devices. Core functionalities include a secure authentication system for user privacy, an integrated database for real-time data persistence, and a comprehensive testing suite to maintain the highest standards of reliability. teleapp is engineered to be a robust and scalable platform, delivering modern connectivity with a focus on stability and security.

## ✨ Features

- 🗄️ Database
- 🔐 Auth
- 🧪 Testing
- 📱 Mobile


## 🛠️ Tech Stack

- ⚛️ React
- 📱 React Native
- 📜 TypeScript


## 📦 Key Dependencies

```
@expo/metro-runtime: ~4.0.1
@expo/vector-icons: ^15.1.1
@react-native-async-storage/async-storage: 2.1.0
@react-native-picker/picker: ^2.11.4
@react-navigation/drawer: ^7.9.2
@react-navigation/native: ^7.1.31
@react-navigation/native-stack: ^7.14.2
expo: ^55.0.3
expo-document-picker: ~55.0.8
expo-linear-gradient: ~55.0.8
expo-print: ^55.0.8
expo-sharing: ^55.0.11
expo-status-bar: ~2.0.0
react: 18.3.1
react-dom: 18.3.1
```

## 🚀 Run Commands

- **start**: `npm run start`
- **android**: `npm run android`
- **ios**: `npm run ios`
- **web**: `npm run web`


## 📁 Project Structure

```
NewPlatform-main
├── backend
│   ├── alembic
│   │   ├── README
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions
│   │       ├── 78ff68132d18_added_otp_and_users_tables.py
│   │       └── 97e06562d84d_create_clinician_model.py
│   ├── alembic.ini
│   ├── app
│   │   ├── common
│   │   │   └── dependencies.py
│   │   ├── core
│   │   │   ├── config.py
│   │   │   ├── logging.py
│   │   │   ├── rate_limit.py
│   │   │   └── security.py
│   │   ├── db
│   │   │   ├── all_models.py
│   │   │   ├── base.py
│   │   │   ├── deps.py
│   │   │   └── session.py
│   │   ├── main.py
│   │   └── modules
│   │       ├── authentication
│   │       │   ├── dependencies.py
│   │       │   ├── models.py
│   │       │   ├── router.py
│   │       │   ├── schemas.py
│   │       │   └── services
│   │       │       ├── otp_service.py
│   │       │       └── token_service.py
│   │       ├── clinician
│   │       │   ├── dependencies.py
│   │       │   ├── models.py
│   │       │   ├── router.py
│   │       │   ├── schemas.py
│   │       │   └── service.py
│   │       ├── clinics
│   │       │   └── model.py
│   │       └── users
│   │           ├── dependencies.py
│   │           ├── models.py
│   │           ├── router.py
│   │           ├── schemas.py
│   │           └── service.py
│   ├── docs
│   │   └── database_init.md
│   ├── pyproject.toml
│   ├── pytest.ini
│   ├── scripts
│   │   └── drop_types.py
│   ├── tests
│   │   └── test_otp_manual.py
│   └── uv.lock
└── frontend
    ├── App.tsx
    ├── app.json
    ├── babel.config.js
    ├── client
    │   ├── HomeScreen.tsx
    │   ├── OnboardScreen.tsx
    │   ├── PlaceholderScreen.tsx
    │   └── SettingsScreen.tsx
    ├── clinician
    │   ├── BusinessAssistantScreen.tsx
    │   ├── ClinicianAppointmentsScreen.tsx
    │   ├── ClinicianConsultationScreen.tsx
    │   ├── ClinicianDashboardScreen.tsx
    │   ├── ClinicianLoginScreen.tsx
    │   ├── ClinicianLoginScreenBad.tsx
    │   ├── ClinicianMessagesScreen.tsx
    │   ├── ClinicianOTPVerificationScreen.tsx
    │   ├── ClinicianOnboardingScreen.tsx
    │   ├── ClinicianPatientsScreen.tsx
    │   ├── ClinicianPaymentsScreen.tsx
    │   ├── ClinicianPlaceholderScreen.tsx
    │   ├── ClinicianProductsScreen.tsx
    │   ├── ClinicianReportPreviewScreen.tsx
    │   ├── ClinicianReportScreen.tsx
    │   ├── ClinicianReportsScreen.tsx
    │   ├── ClinicianScheduleScreen.tsx
    │   ├── ClinicianSessionsScreen.tsx
    │   ├── ClinicianSettingsScreen.tsx
    │   ├── ReportsScreen.tsx
    │   └── index.ts
    ├── clinicianadmin
    │   ├── AddClinicScreen.tsx
    │   ├── ClinicDashboardScreen.tsx
    │   └── ReviewClinicDetailsScreen.tsx
    ├── common
    │   ├── auth
    │   │   ├── LoginScreen.tsx
    │   │   ├── OTPScreen.tsx
    │   │   ├── SplashScreen.tsx
    │   │   ├── authService.ts
    │   │   └── countryData.ts
    │   ├── components
    │   │   ├── CustomDrawerContent.tsx
    │   │   └── Header.tsx
    │   ├── navigation
    │   │   ├── ClinicStackNavigator.tsx
    │   │   └── DrawerNavigator.tsx
    │   └── services
    │       └── clinicService.ts
    ├── components
    │   └── clinician
    │       └── ClinicianSidebar.tsx
    ├── context
    │   ├── ClinicianAuthContext.tsx
    │   └── LogoutContext.tsx
    ├── docs
    │   └── DEVELOPMENT_SPEC.md
    ├── eas.json
    ├── errors_clean.txt
    ├── global.css
    ├── index.js
    ├── metro.config.js
    ├── nativewind-env.d.ts
    ├── navigation
    │   ├── ClinicianMainNavigator.tsx
    │   └── types.ts
    ├── package.json
    ├── services
    │   └── clinicianApi.ts
    ├── superadmin
    │   ├── AllClinicsScreen.tsx
    │   ├── ApproveClinicScreen.tsx
    │   ├── AssignClinicianAdminScreen.tsx
    │   ├── ClinicianAdminManagementScreen.tsx
    │   ├── ClinicianManagementScreen.tsx
    │   └── ConfigurationsScreen.tsx
    ├── tailwind.config.js
    ├── theme
    │   └── index.ts
    ├── ts_errors.txt
    ├── ts_errors2.txt
    ├── ts_errors3.txt
    ├── tsc_out.txt
    ├── tsc_output.txt
    ├── tsc_output_debug.txt
    └── tsconfig.json
```

## 🛠️ Development Setup

### Node.js/JavaScript Setup
1. Install Node.js (v18+ recommended)
2. Install dependencies: `npm install` or `yarn install`
3. Start development server: (Check scripts in `package.json`, e.g., `npm run dev`)


## 👥 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/shubhamjh15/teleapp.git`
3. **Create** a new branch: `git checkout -b feature/your-feature`
4. **Commit** your changes: `git commit -am 'Add some feature'`
5. **Push** to your branch: `git push origin feature/your-feature`
6. **Open** a pull request

Please ensure your code follows the project's style guidelines and includes tests where applicable.

---
*This README was generated with ❤️ by ReadmeBuddy*
