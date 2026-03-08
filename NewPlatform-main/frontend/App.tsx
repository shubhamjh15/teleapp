/**
 * HealthScan360 Mobile — App Entry Point
 *
 * Manages navigation between LoginScreen → OTPScreen → SplashScreen → Main App
 * with Drawer Navigation.
 */

import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './common/auth/LoginScreen';
import OTPScreen from './common/auth/OTPScreen';
import SplashScreen from './common/auth/SplashScreen';
import DrawerNavigator from './common/navigation/DrawerNavigator';
import { LoginResponse } from './common/auth/authService';
import { ClinicianOnboardingScreen } from './clinician/ClinicianOnboardingScreen';
import ClinicianMainNavigator from './navigation/ClinicianMainNavigator';
import { LogoutProvider } from './context/LogoutContext';

type Screen = 'login' | 'otp' | 'splash' | 'main' | 'clinician_onboarding' | 'clinician_main';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [mobileNumber, setMobileNumber] = useState('');
  const [loginData, setLoginData] = useState<LoginResponse | null>(null);

  // ── Screen Handlers ─────────────────────────────────────────────────────

  const handleOTPRequested = (number: string) => {
    setMobileNumber(number);
    setCurrentScreen('otp');
  };

  const handleVerified = (data: LoginResponse) => {
    setLoginData(data);
    setCurrentScreen('splash');
  };

  const handleGoBackToLogin = () => {
    setCurrentScreen('login');
    setMobileNumber('');
  };

  const handleContinue = () => {
    if (loginData?.role === 'clinician') {
        if (loginData?.is_clinician_onboarded) {
            console.log('Clinician already onboarded. Navigating to clinician dashboard.');
            setCurrentScreen('clinician_main');
        } else {
            console.log('First time clinician. Navigating to clinician onboarding.');
            setCurrentScreen('clinician_onboarding');
        }
    } else {
        console.log('Navigating to user dashboard. Tokens:', loginData);
        setCurrentScreen('main');
    }
  };

  const handleLogout = async () => {
    // Clear stored tokens
    const { clearTokens } = await import('./common/auth/authService');
    await clearTokens();
    
    // Reset state and navigate to login
    setLoginData(null);
    setMobileNumber('');
    setCurrentScreen('login');
    console.log('User logged out successfully');
  };

  // ── Render ──────────────────────────────────────────────────────────────

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onOTPRequested={handleOTPRequested} />;

      case 'otp':
        return (
          <OTPScreen
            mobileNumber={mobileNumber}
            onVerified={handleVerified}
            onGoBack={handleGoBackToLogin}
          />
        );

      case 'splash':
        return (
          <SplashScreen
            loginData={loginData!}
            onContinue={handleContinue}
          />
        );

      case 'main':
        return (
          <NavigationContainer>
            <DrawerNavigator onLogout={handleLogout} />
          </NavigationContainer>
        );

      case 'clinician_onboarding':
        return (
          // @ts-ignore - passing a dummy navigation prop for now or handle through state
          <ClinicianOnboardingScreen 
            navigation={{ 
              navigate: () => {}, 
              goBack: () => setCurrentScreen('login'),
              // ... mock other nav methods if needed
            } as any}
            // If the onboarding screen has its own completion handler, we can pass it here.
            // For now, let's assume it calls submitOnboarding from store and we want to transition to clinician_main
            // We'll need to update ClinicianOnboardingScreen to call a prop on completion or we just show the navigator for clinician_main here if we modify it.
            onComplete={() => setCurrentScreen('clinician_main')} />
        );

      case 'clinician_main':
        return (
          <LogoutProvider onLogout={handleLogout}>
            <NavigationContainer>
              <ClinicianMainNavigator />
            </NavigationContainer>
          </LogoutProvider>
        );

      default:
        return <LoginScreen onOTPRequested={handleOTPRequested} />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style={currentScreen === 'main' ? 'dark' : 'light'} />
        {renderScreen()}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0C29',
  },
});
