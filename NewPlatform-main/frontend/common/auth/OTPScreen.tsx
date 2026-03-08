/**
 * OTPScreen — 6-digit OTP verification with timer and resend.
 *
 * Features:
 * - 6 individual input boxes for OTP digits
 * - Auto-focus next box, backspace to previous
 * - Paste support for full OTP
 * - 1-minute countdown timer (MM:SS format)
 * - Resend OTP link after timer expiry
 * - Submit OTP button with backend verification
 * - Success → SplashScreen, Failure → retry with error
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Vibration,
  ScrollView,
} from 'react-native';
import { LoginResponse, verifyOTP, requestOTP } from './authService';

const OTP_LENGTH = 6;
const TIMER_DURATION = 60; // seconds
const MAX_RESEND_ATTEMPTS = 3;

interface OTPScreenProps {
  mobileNumber: string;
  onVerified: (data: LoginResponse) => void;
  onGoBack: () => void;
}

const OTPScreen: React.FC<OTPScreenProps> = ({
  mobileNumber,
  onVerified,
  onGoBack,
}) => {
  // ─── State ────────────────────────────────────────────────────────────────
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [canResend, setCanResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  // ─── Refs ─────────────────────────────────────────────────────────────────
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ─── Animations ───────────────────────────────────────────────────────────
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    // Focus first input
    setTimeout(() => inputRefs.current[0]?.focus(), 500);
  }, []);

  // ─── Timer Logic ──────────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    setTimer(TIMER_DURATION);
    setCanResend(false);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  // ─── Format Timer ─────────────────────────────────────────────────────────
  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // ─── Shake Animation (Error Feedback) ─────────────────────────────────────
  const triggerShake = () => {
    Vibration.vibrate(300);
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // ─── Handle OTP Input ─────────────────────────────────────────────────────
  const handleOTPChange = (text: string, index: number) => {
    setError('');

    // Handle paste (multi-character input)
    if (text.length > 1) {
      const pastedDigits = text.replace(/[^0-9]/g, '').split('').slice(0, OTP_LENGTH);
      const newOtp = [...otp];
      pastedDigits.forEach((digit, i) => {
        if (index + i < OTP_LENGTH) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);

      // Focus the next empty box or last box
      const nextIndex = Math.min(index + pastedDigits.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();

      // Auto-submit if all filled
      if (newOtp.every((d) => d !== '')) {
        handleSubmit(newOtp.join(''));
      }
      return;
    }

    // Single character input
    const digit = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all filled
    if (digit && newOtp.every((d) => d !== '')) {
      handleSubmit(newOtp.join(''));
    }
  };

  // ─── Handle Backspace ─────────────────────────────────────────────────────
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // ─── Submit OTP ───────────────────────────────────────────────────────────
  const handleSubmit = async (otpString?: string) => {
    const otpCode = otpString || otp.join('');

    if (otpCode.length !== OTP_LENGTH) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsLoading(true);
    setError('');

    // Call real backend to verify OTP
    try {
      const data = await verifyOTP(mobileNumber, otpCode);
      onVerified(data);
    } catch (err: any) {
      const message = err?.message || 'Invalid OTP. Please try again.';
      setError(message);
      triggerShake();

      // Clear OTP boxes for retry
      setOtp(Array(OTP_LENGTH).fill(''));
      setTimeout(() => inputRefs.current[0]?.focus(), 300);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Resend OTP (max 3 attempts) ──────────────────────────────────────────
  const handleResend = async () => {
    if (resendCount >= MAX_RESEND_ATTEMPTS) {
      setError('Maximum resend attempts reached. Please go back and try again.');
      return;
    }

    setIsResending(true);
    setError('');

    // Call backend to resend OTP
    try {
      await requestOTP(mobileNumber);
      setResendCount((prev) => prev + 1);
      startTimer();
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
      const remaining = MAX_RESEND_ATTEMPTS - (resendCount + 1);
      Alert.alert(
        'OTP Sent',
        `A new OTP has been sent. Check the backend console for the code.${remaining > 0 ? ` (${remaining} resend${remaining === 1 ? '' : 's'} left)` : ' (last attempt)'}`
      );
    } catch (err: any) {
      const message = err?.message || 'Failed to resend OTP. Please try again.';
      setError(message);
    } finally {
      setIsResending(false);
    }
  };

  // ─── Masked Phone Number ──────────────────────────────────────────────────
  const maskedNumber =
    mobileNumber.length > 4
      ? mobileNumber.slice(0, -4).replace(/./g, '•') + mobileNumber.slice(-4)
      : mobileNumber;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0C29" />

      {/* Gradient Background */}
      <View style={styles.gradientBg}>
        <View style={styles.gradientLayer1} />
        <View style={styles.gradientLayer2} />
        <View style={styles.gradientLayer3} />
      </View>

      {/* Decorative Circles */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
              <Text style={styles.backArrow}>←</Text>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.otpIconContainer}>
                <Text style={styles.otpIcon}>🔐</Text>
              </View>
              <Text style={styles.title}>Verify OTP</Text>
              <Text style={styles.subtitle}>
                We've sent a 6-digit code to
              </Text>
              <Text style={styles.phoneDisplay}>{maskedNumber}</Text>
            </View>

            {/* OTP Card */}
            <View style={styles.card}>
              {/* OTP Input Boxes */}
              <Animated.View
                style={[
                  styles.otpContainer,
                  { transform: [{ translateX: shakeAnim }] },
                ]}
              >
                {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    style={[
                      styles.otpBox,
                      otp[index] ? styles.otpBoxFilled : null,
                      error ? styles.otpBoxError : null,
                    ]}
                    value={otp[index]}
                    onChangeText={(text) => handleOTPChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={index === 0 ? OTP_LENGTH : 1}
                    selectTextOnFocus
                    caretHidden
                  />
                ))}
              </Animated.View>

              {/* Error Message */}
              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorIcon}>⚠️</Text>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Timer */}
              <View style={styles.timerContainer}>
                {!canResend ? (
                  <>
                    <Text style={styles.timerLabel}>Resend OTP in</Text>
                    <View style={styles.timerBadge}>
                      <Text style={styles.timerText}>{formatTimer(timer)}</Text>
                    </View>
                  </>
                ) : resendCount >= MAX_RESEND_ATTEMPTS ? (
                  <Text style={styles.resendExhausted}>
                    No resend attempts remaining
                  </Text>
                ) : (
                  <TouchableOpacity
                    style={styles.resendButton}
                    onPress={handleResend}
                    disabled={isResending}
                    activeOpacity={0.7}
                  >
                    {isResending ? (
                      <ActivityIndicator color="#B388FF" size="small" />
                    ) : (
                      <Text style={styles.resendText}>
                        Didn't receive OTP?{' '}
                        <Text style={styles.resendLink}>
                          Resend OTP ({MAX_RESEND_ATTEMPTS - resendCount} left)
                        </Text>
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>

              {/* Backend OTP Hint */}
              <View style={styles.hintContainer}>
                <Text style={styles.hintText}>💡 Check the backend console for your OTP</Text>
              </View>

              {/* Submit Button */}
              <Animated.View
                style={{ transform: [{ scale: buttonScale }] }}
              >
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (isLoading || otp.some((d) => !d)) &&
                      styles.submitButtonDisabled,
                  ]}
                  onPress={() => handleSubmit()}
                  disabled={isLoading || otp.some((d) => !d)}
                  activeOpacity={0.85}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.submitButtonText}>Verify & Continue</Text>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0C29',
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F0C29',
  },
  gradientLayer2: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '50%',
    backgroundColor: 'rgba(48, 16, 99, 0.6)',
    borderBottomLeftRadius: 300,
    borderBottomRightRadius: 300,
  },
  gradientLayer3: {
    position: 'absolute',
    top: '10%',
    left: '20%',
    width: '80%',
    height: '40%',
    backgroundColor: 'rgba(69, 39, 160, 0.3)',
    borderRadius: 200,
  },
  decorCircle1: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(124, 77, 255, 0.15)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 176, 255, 0.1)',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  // ── Back Button ───────────────────────────────────────────────────────────
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  backArrow: {
    fontSize: 22,
    color: '#B388FF',
    marginRight: 6,
  },
  backText: {
    fontSize: 16,
    color: '#B388FF',
    fontWeight: '600',
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  otpIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(124, 77, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(124, 77, 255, 0.3)',
  },
  otpIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  phoneDisplay: {
    fontSize: 17,
    fontWeight: '700',
    color: '#B388FF',
    marginTop: 4,
    letterSpacing: 2,
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#7C4DFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },

  // ── OTP Boxes ─────────────────────────────────────────────────────────────
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  otpBoxFilled: {
    borderColor: '#7C4DFF',
    backgroundColor: 'rgba(124, 77, 255, 0.12)',
  },
  otpBoxError: {
    borderColor: '#FF5252',
    backgroundColor: 'rgba(255, 82, 82, 0.08)',
  },

  // ── Error ─────────────────────────────────────────────────────────────────
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#FF5252',
    flex: 1,
  },

  // ── Timer ─────────────────────────────────────────────────────────────────
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
    minHeight: 44,
    justifyContent: 'center',
  },
  timerLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 8,
  },
  timerBadge: {
    backgroundColor: 'rgba(124, 77, 255, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(124, 77, 255, 0.3)',
  },
  timerText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#B388FF',
    letterSpacing: 3,
    fontVariant: ['tabular-nums'],
  },
  resendButton: {
    paddingVertical: 8,
  },
  resendText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  resendLink: {
    color: '#B388FF',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  resendExhausted: {
    fontSize: 13,
    color: 'rgba(255, 82, 82, 0.7)',
    fontWeight: '500',
    textAlign: 'center' as const,
  },

  // ── Hint Badge ─────────────────────────────────────────────────────────────
  hintContainer: {
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  hintText: {
    fontSize: 13,
    color: 'rgba(179, 136, 255, 0.7)',
    fontWeight: '600' as const,
    backgroundColor: 'rgba(124, 77, 255, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    overflow: 'hidden' as const,
  },

  // ── Submit Button ─────────────────────────────────────────────────────────
  submitButton: {
    backgroundColor: '#7C4DFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C4DFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(124, 77, 255, 0.35)',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default OTPScreen;
