/**
 * Clinician Login Screen
 *
 * Mobile number input with country code for OTP-based authentication.
 * Premium medical-themed design.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ClinicianAuthStackParamList } from '../navigation/types';
import { useClinicianAuthStore } from '../context/ClinicianAuthContext';
import { colors, textStyles, spacing, borderRadius, semanticSpacing } from '../theme';

const { width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<ClinicianAuthStackParamList, 'ClinicianLogin'>;
  onBackToUser?: () => void;
};

export const ClinicianLoginScreen: React.FC<Props> = ({ navigation, onBackToUser }) => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { sendOTP, error, clearError } = useClinicianAuthStore();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleSendOTP = async () => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      useClinicianAuthStore.setState({ error: 'Please enter a valid 10-digit mobile number.' });
      return;
    }
    setIsLoading(true);
    try {
      await sendOTP(`+91${cleanPhone}`);
      navigation.navigate('ClinicianOTPVerification');
    } catch {
      // Error handled by store
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhone = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 10);
    if (cleaned.length > 5) {
      return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return cleaned;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back to User Login */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => onBackToUser ? onBackToUser() : navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.iconBg}>
                <Ionicons name="medical" size={48} color="#FFFFFF" />
              </View>
            </Animated.View>
            <Text style={styles.brandTitle}>HealthScan360</Text>
            <Text style={styles.portalLabel}>CLINICIAN PORTAL</Text>
            <Text style={styles.subtitle}>
              Manage patients, consultations & health insights
            </Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Login with Mobile</Text>
            <Text style={styles.cardDescription}>
              Enter your registered mobile number to receive a one-time password
            </Text>

            {/* Error */}
            {error && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={20} color={colors.safety.danger} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={clearError} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close" size={18} color={colors.safety.danger} />
                </TouchableOpacity>
              </View>
            )}

            {/* Phone Input */}
            <View style={styles.phoneInputContainer}>
              <View style={styles.countryCodeBox}>
                <Text style={styles.flag}>🇮🇳</Text>
                <Text style={styles.countryCode}>+91</Text>
                <Ionicons name="chevron-down" size={14} color={colors.text.tertiary} />
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="98765 43210"
                placeholderTextColor={colors.neutral[400]}
                value={formatPhone(phone)}
                onChangeText={(text) => setPhone(text.replace(/\D/g, ''))}
                keyboardType="phone-pad"
                maxLength={11} // 10 digits + 1 space
                autoFocus
              />
            </View>

            {/* Send OTP Button */}
            <TouchableOpacity
              style={[styles.otpButton, isLoading && styles.otpButtonDisabled]}
              onPress={handleSendOTP}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <View style={styles.loadingRow}>
                  <Ionicons name="hourglass-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.otpButtonText}>Sending OTP...</Text>
                </View>
              ) : (
                <View style={styles.loadingRow}>
                  <Ionicons name="send" size={20} color="#FFFFFF" />
                  <Text style={styles.otpButtonText}>Send OTP</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Info */}
            <View style={styles.infoRow}>
              <Ionicons name="shield-checkmark" size={16} color={colors.primary[500]} />
              <Text style={styles.infoText}>
                OTP is valid for 60 seconds. Maximum 3 attempts allowed.
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Not a clinician? </Text>
            <TouchableOpacity onPress={() => onBackToUser ? onBackToUser() : navigation.goBack()}>
              <Text style={styles.footerLink}>Switch to User Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.termsRow}>
            <Text style={styles.termsText}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: semanticSpacing.screenHorizontal,
    paddingBottom: spacing['8'],
  },
  backButton: {
    marginTop: spacing['2'],
    marginBottom: spacing['4'],
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing['8'],
  },
  iconContainer: {
    marginBottom: spacing['4'],
  },
  iconBg: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  portalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary[500],
    letterSpacing: 3,
    marginTop: spacing['1'],
    marginBottom: spacing['3'],
  },
  subtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing['6'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: spacing['6'],
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing['2'],
  },
  cardDescription: {
    ...textStyles.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing['5'],
    lineHeight: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.safety.dangerLight,
    padding: spacing['3'],
    borderRadius: borderRadius.lg,
    marginBottom: spacing['4'],
    gap: spacing['2'],
  },
  errorText: {
    ...textStyles.bodySmall,
    color: colors.safety.danger,
    flex: 1,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border.light,
    backgroundColor: colors.background.tertiary,
    marginBottom: spacing['5'],
    overflow: 'hidden',
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['4'],
    borderRightWidth: 1,
    borderRightColor: colors.border.light,
    gap: spacing['1'],
    backgroundColor: '#FFFFFF',
  },
  flag: {
    fontSize: 20,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: colors.text.primary,
    paddingVertical: spacing['4'],
    paddingHorizontal: spacing['4'],
    letterSpacing: 1,
  },
  otpButton: {
    backgroundColor: colors.primary[500],
    borderRadius: 14,
    paddingVertical: spacing['4'],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: spacing['4'],
  },
  otpButtonDisabled: {
    backgroundColor: colors.neutral[300],
    shadowOpacity: 0,
    elevation: 0,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  otpButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    paddingTop: spacing['2'],
  },
  infoText: {
    ...textStyles.caption,
    color: colors.text.tertiary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['4'],
  },
  footerText: {
    ...textStyles.body,
    color: colors.text.secondary,
  },
  footerLink: {
    ...textStyles.bodyMedium,
    color: colors.primary[500],
  },
  termsRow: {
    alignItems: 'center',
    paddingHorizontal: spacing['4'],
  },
  termsText: {
    ...textStyles.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary[500],
    fontWeight: '500',
  },
});

export default ClinicianLoginScreen;
