/**
 * OTP Verification Screen
 *
 * 6-digit OTP input with auto-focus, countdown timer, resend, and lockout handling.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ClinicianAuthStackParamList } from '../navigation/types';
import { useClinicianAuthStore } from '../context/ClinicianAuthContext';
import { colors, textStyles, spacing, borderRadius, semanticSpacing } from '../theme';

const OTP_LENGTH = 6;

type Props = {
  navigation: NativeStackNavigationProp<ClinicianAuthStackParamList, 'ClinicianOTPVerification'>;
  onLoginSuccess?: () => void;
  onBackToUser?: () => void;
};

export const ClinicianOTPVerificationScreen: React.FC<Props> = ({ navigation, onLoginSuccess }) => {
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const {
    verifyOTP,
    resendOTP,
    otpPhone,
    otpAttempts,
    isOtpLocked,
    error,
    clearError,
    resetOTP,
  } = useClinicianAuthStore();

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Shake animation on error
  const triggerShake = () => {
    Vibration.vibrate(100);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleOtpChange = (text: string, index: number) => {
    clearError();
    const newOtp = [...otp];

    if (text.length > 1) {
      // Handle paste
      const chars = text.replace(/\D/g, '').split('').slice(0, OTP_LENGTH);
      chars.forEach((char, i) => {
        if (i + index < OTP_LENGTH) newOtp[i + index] = char;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + chars.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
    } else {
      newOtp[index] = text.replace(/\D/g, '');
      setOtp(newOtp);
      if (text && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }

    // Auto-submit when all digits filled
    const fullOtp = newOtp.join('');
    if (fullOtp.length === OTP_LENGTH && !fullOtp.includes('')) {
      handleVerify(fullOtp);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpString?: string) => {
    const code = otpString || otp.join('');
    if (code.length !== OTP_LENGTH) return;
    if (isOtpLocked) return;

    setIsVerifying(true);
    try {
      await verifyOTP(code);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch {
      triggerShake();
      setOtp(new Array(OTP_LENGTH).fill(''));
      setTimeout(() => inputRefs.current[0]?.focus(), 300);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(60);
    setOtp(new Array(OTP_LENGTH).fill(''));
    clearError();
    try {
      await resendOTP();
    } catch {
      // Error handled by store
    }
    inputRefs.current[0]?.focus();
  };

  const handleBack = () => {
    resetOTP();
    navigation.goBack();
  };

  const maskedPhone = otpPhone
    ? `${otpPhone.slice(0, 4)}****${otpPhone.slice(-2)}`
    : '';

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          {/* Icon */}
          <View style={styles.iconSection}>
            <View style={styles.otpIconBg}>
              <Ionicons name="keypad" size={36} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.description}>
            We sent a 6-digit code to{'\n'}
            <Text style={styles.phoneHighlight}>{maskedPhone}</Text>
          </Text>

          {/* Error / Lockout */}
          {error && (
            <View style={[styles.statusBanner, isOtpLocked && styles.lockBanner]}>
              <Ionicons
                name={isOtpLocked ? 'lock-closed' : 'alert-circle'}
                size={18}
                color={isOtpLocked ? '#B91C1C' : colors.safety.danger}
              />
              <Text style={[styles.statusText, isOtpLocked && styles.lockText]}>
                {error}
              </Text>
            </View>
          )}

          {/* OTP Inputs */}
          <Animated.View
            style={[styles.otpContainer, { transform: [{ translateX: shakeAnim }] }]}
          >
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={[
                  styles.otpInput,
                  digit ? styles.otpInputFilled : {},
                  error ? styles.otpInputError : {},
                  isOtpLocked ? styles.otpInputLocked : {},
                ]}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                editable={!isOtpLocked && !isVerifying}
                selectTextOnFocus
              />
            ))}
          </Animated.View>

          {/* Countdown + Resend */}
          <View style={styles.resendSection}>
            {!canResend ? (
              <View style={styles.countdownRow}>
                <Ionicons name="time-outline" size={16} color={colors.text.tertiary} />
                <Text style={styles.countdownText}>
                  Resend OTP in <Text style={styles.countdownBold}>{formatTime(countdown)}</Text>
                </Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
                <Ionicons name="refresh" size={16} color={colors.primary[500]} />
                <Text style={styles.resendText}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Attempt indicator */}
          {otpAttempts > 0 && !isOtpLocked && (
            <View style={styles.attemptIndicator}>
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.attemptDot,
                    i < otpAttempts ? styles.attemptDotUsed : {},
                  ]}
                />
              ))}
              <Text style={styles.attemptText}>
                {3 - otpAttempts} attempt{3 - otpAttempts !== 1 ? 's' : ''} remaining
              </Text>
            </View>
          )}

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              (otp.join('').length !== OTP_LENGTH || isOtpLocked) && styles.verifyButtonDisabled,
            ]}
            onPress={() => handleVerify()}
            disabled={otp.join('').length !== OTP_LENGTH || isOtpLocked || isVerifying}
            activeOpacity={0.85}
          >
            {isVerifying ? (
              <Text style={styles.verifyText}>Verifying...</Text>
            ) : (
              <View style={styles.verifyRow}>
                <Text style={styles.verifyText}>Verify & Continue</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>

          {/* Change Number */}
          <TouchableOpacity style={styles.changeNumber} onPress={handleBack}>
            <Text style={styles.changeNumberText}>Change mobile number</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  keyboardView: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: semanticSpacing.screenHorizontal,
    paddingTop: spacing['2'],
  },
  backButton: {
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
    marginBottom: spacing['6'],
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: spacing['5'],
  },
  otpIconBg: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.secondary[500],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.secondary[500],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing['2'],
  },
  description: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing['6'],
  },
  phoneHighlight: {
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: 1,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.safety.dangerLight,
    padding: spacing['3'],
    borderRadius: borderRadius.lg,
    gap: spacing['2'],
    marginBottom: spacing['4'],
  },
  lockBanner: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  statusText: {
    ...textStyles.bodySmall,
    color: colors.safety.danger,
    flex: 1,
  },
  lockText: {
    color: '#B91C1C',
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: spacing['6'],
  },
  otpInput: {
    width: 50,
    height: 58,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border.light,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  otpInputFilled: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  otpInputError: {
    borderColor: colors.safety.danger,
    backgroundColor: colors.safety.dangerLight,
  },
  otpInputLocked: {
    borderColor: colors.neutral[300],
    backgroundColor: colors.neutral[100],
    color: colors.neutral[400],
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: spacing['5'],
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  countdownText: {
    ...textStyles.bodySmall,
    color: colors.text.tertiary,
  },
  countdownBold: {
    fontWeight: '700',
    color: colors.text.primary,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    paddingVertical: spacing['2'],
    paddingHorizontal: spacing['4'],
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
  },
  resendText: {
    ...textStyles.bodySmall,
    color: colors.primary[500],
    fontWeight: '600',
  },
  attemptIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
    marginBottom: spacing['6'],
  },
  attemptDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neutral[200],
  },
  attemptDotUsed: {
    backgroundColor: colors.safety.danger,
  },
  attemptText: {
    ...textStyles.caption,
    color: colors.text.tertiary,
    marginLeft: spacing['2'],
  },
  verifyButton: {
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
  verifyButtonDisabled: {
    backgroundColor: colors.neutral[300],
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  verifyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  changeNumber: {
    alignItems: 'center',
    paddingVertical: spacing['2'],
  },
  changeNumberText: {
    ...textStyles.bodySmall,
    color: colors.primary[500],
    fontWeight: '500',
  },
});

export default ClinicianOTPVerificationScreen;
