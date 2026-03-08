/**
 * LoginScreen — Mobile number input with country code dropdown.
 *
 * Features:
 * - Searchable country code dropdown with flag emojis
 * - Mobile number input with numeric keyboard
 * - "Get OTP" button (calls backend API)
 * - Country-based phone validation
 * - Fixed viewport layout (no scroll overflow)
 * - Mobile-optimized country picker modal
 */

import React, { useState, useRef } from 'react';
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
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { COUNTRIES, DEFAULT_COUNTRY, Country } from './countryData';
import { requestOTP } from './authService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface LoginScreenProps {
  onOTPRequested: (mobileNumber: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onOTPRequested }) => {
  // ─── State ────────────────────────────────────────────────────────────────
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  // ─── Animations ───────────────────────────────────────────────────────────
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ─── Filtered countries ───────────────────────────────────────────────────
  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dial_code.includes(searchQuery)
  );

  // ─── Validation (country-based digit length) ──────────────────────────────
  const validatePhone = (): boolean => {
    if (!phoneNumber.trim()) {
      setError('Please enter your mobile number');
      return false;
    }
    const { minDigits, maxDigits, name } = selectedCountry;
    if (phoneNumber.length < minDigits || phoneNumber.length > maxDigits) {
      if (minDigits === maxDigits) {
        setError(`${name} requires exactly ${minDigits} digits`);
      } else {
        setError(`${name} requires ${minDigits}-${maxDigits} digits`);
      }
      return false;
    }
    setError('');
    return true;
  };

  // ─── Handle Get OTP ───────────────────────────────────────────────────────
  const handleGetOTP = async () => {
    if (!validatePhone()) return;

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

    const fullNumber = `${selectedCountry.dial_code}${phoneNumber}`;

    // Call backend to request OTP
    try {
      await requestOTP(fullNumber);
      onOTPRequested(fullNumber);
    } catch (err: any) {
      const message = err?.message || 'Failed to send OTP. Please try again.';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Country Picker Item ──────────────────────────────────────────────────
  const renderCountryItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => {
        setSelectedCountry(item);
        setShowCountryPicker(false);
        setSearchQuery('');
      }}
      activeOpacity={0.7}
    >
      <Text style={styles.countryFlag}>{item.flag}</Text>
      <View style={styles.countryInfo}>
        <Text style={styles.countryName} numberOfLines={1}>{item.name}</Text>
      </View>
      <Text style={styles.countryDialCode}>{item.dial_code}</Text>
    </TouchableOpacity>
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0C29" />

      {/* Background layers (overflow hidden prevents scroll issues) */}
      <View style={styles.bgLayer1} />
      <View style={styles.bgLayer2} />
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logoText}>HealthScan360</Text>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Enter your mobile number to receive a verification code
            </Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            {/* Mobile Number Input */}
            <Text style={styles.label}>Mobile Number</Text>
            <View
              style={[
                styles.phoneInputContainer,
                phoneNumber.length > 0 && phoneNumber.length >= selectedCountry.minDigits && phoneNumber.length <= selectedCountry.maxDigits
                  ? styles.phoneInputValid
                  : phoneNumber.length > selectedCountry.maxDigits
                  ? styles.phoneInputInvalid
                  : null,
              ]}
            >
              <TouchableOpacity
                style={styles.dialCodeBadge}
                onPress={() => setShowCountryPicker(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.countrySelectorFlag}>{selectedCountry.flag}</Text>
                <Text style={styles.dialCodeText}>{selectedCountry.dial_code}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.phoneInput}
                placeholder="Enter mobile number"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9]/g, '');
                  setPhoneNumber(cleaned.slice(0, selectedCountry.maxDigits));
                  if (error) setError('');
                }}
                maxLength={selectedCountry.maxDigits}
              />
            </View>

            {/* Digit counter + hint */}
            <View style={styles.validationRow}>
              <Text style={styles.validationHint}>
                {selectedCountry.minDigits === selectedCountry.maxDigits
                  ? `${selectedCountry.name} requires ${selectedCountry.minDigits} digits`
                  : `${selectedCountry.name}: ${selectedCountry.minDigits}-${selectedCountry.maxDigits} digits`}
              </Text>
              <Text
                style={[
                  styles.digitCounter,
                  phoneNumber.length >= selectedCountry.minDigits && phoneNumber.length <= selectedCountry.maxDigits
                    ? styles.digitCounterValid
                    : null,
                ]}
              >
                {phoneNumber.length}/{selectedCountry.minDigits === selectedCountry.maxDigits ? selectedCountry.minDigits : selectedCountry.maxDigits}
              </Text>
            </View>

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠ {error}</Text>
              </View>
            ) : null}

            {/* Get OTP Button */}
            <Animated.View
              style={{ transform: [{ scale: buttonScale }] }}
            >
              <TouchableOpacity
                style={[
                  styles.otpButton,
                  isLoading && styles.otpButtonDisabled,
                ]}
                onPress={handleGetOTP}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.otpButtonText}>Get OTP</Text>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Terms */}
            <Text style={styles.termsText}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* ────── Country Picker Modal (Full-Screen, Mobile-Optimized) ────── */}
      <Modal
        visible={showCountryPicker}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  setShowCountryPicker(false);
                  setSearchQuery('');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search country or dial code..."
                placeholderTextColor="rgba(255, 255, 255, 0.35)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={false}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={styles.searchClear}>✕</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Country List */}
            <FlatList
              data={filteredCountries}
              renderItem={renderCountryItem}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={true}
              style={styles.countryList}
              contentContainerStyle={styles.countryListContent}
              ItemSeparatorComponent={() => (
                <View style={styles.countryItemSeparator} />
              )}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={15}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Root Container (overflow hidden prevents scroll bleed) ─────────────────
  container: {
    flex: 1,
    backgroundColor: '#0F0C29',
    overflow: 'hidden',
  },

  // ── Background Layers (contained within parent) ───────────────────────────
  bgLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F0C29',
  },
  bgLayer2: {
    position: 'absolute',
    top: -SCREEN_HEIGHT * 0.15,
    left: -SCREEN_WIDTH * 0.2,
    width: SCREEN_WIDTH * 1.4,
    height: SCREEN_HEIGHT * 0.6,
    backgroundColor: 'rgba(48, 16, 99, 0.5)',
    borderRadius: SCREEN_WIDTH * 0.7,
  },
  bgCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(124, 77, 255, 0.12)',
  },
  bgCircle2: {
    position: 'absolute',
    bottom: 40,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 176, 255, 0.08)',
  },

  // ── Layout ────────────────────────────────────────────────────────────────
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#7C4DFF',
    letterSpacing: 1,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.55)',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // ── Country Selector ──────────────────────────────────────────────────────
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  countrySelectorFlag: {
    fontSize: 20,
  },
  countrySelectorText: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  countrySelectorCode: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    marginRight: 8,
  },
  dropdownArrow: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
  },

  // ── Phone Input ───────────────────────────────────────────────────────────
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  phoneInputValid: {
    borderColor: 'rgba(76, 175, 80, 0.6)',
  },
  phoneInputInvalid: {
    borderColor: 'rgba(255, 82, 82, 0.6)',
  },
  validationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  validationHint: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.35)',
  },
  digitCounter: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.35)',
    fontWeight: '600',
    fontVariant: ['tabular-nums'] as any,
  },
  digitCounterValid: {
    color: 'rgba(76, 175, 80, 0.8)',
  },
  dialCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(124, 77, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
    gap: 6,
  },
  dialCodeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#B388FF',
  },
  phoneInput: {
    flex: 1,
    fontSize: 17,
    color: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontWeight: '500',
    letterSpacing: 1,
  },

  // ── Error ─────────────────────────────────────────────────────────────────
  errorContainer: {
    backgroundColor: 'rgba(255, 82, 82, 0.12)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 13,
    color: '#FF5252',
  },

  // ── OTP Button ────────────────────────────────────────────────────────────
  otpButton: {
    backgroundColor: '#7C4DFF',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  otpButtonDisabled: {
    backgroundColor: 'rgba(124, 77, 255, 0.4)',
  },
  otpButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // ── Terms ─────────────────────────────────────────────────────────────────
  termsText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.35)',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
  termsLink: {
    color: '#B388FF',
    fontWeight: '600',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ── Country Picker Modal (Full-Screen, Mobile-Optimized) ──────────────────
  // ══════════════════════════════════════════════════════════════════════════
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#0F0C29',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0F0C29',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },

  // ── Search ────────────────────────────────────────────────────────────────
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    paddingVertical: 12,
  },
  searchClear: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
    padding: 4,
  },

  // ── Country List ──────────────────────────────────────────────────────────
  countryList: {
    flex: 1,
  },
  countryListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  countryFlag: {
    fontSize: 26,
    width: 40,
    textAlign: 'center',
  },
  countryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  countryName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  countryDialCode: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'right',
  },
  countryItemSeparator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});

export default LoginScreen;
