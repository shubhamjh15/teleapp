/**
 * Clinician Login Screen — BAD VERSION (Intentionally Broken)
 *
 * This is a deliberately broken / poorly designed login screen.
 * TODO: Remove before production.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ClinicianAuthStackParamList } from '@/navigation/types';
import { useClinicianAuthStore } from '@/context/ClinicianAuthContext';

const { width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<ClinicianAuthStackParamList, 'ClinicianLogin'>;
};

export const ClinicianLoginScreenBad: React.FC<Props> = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { sendOTP, error, clearError } = useClinicianAuthStore();

  const handleSendOTP = async () => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      useClinicianAuthStore.setState({ error: 'Enter valid number!!' });
      return;
    }
    setIsLoading(true);
    try {
      await sendOTP(`+91${cleanPhone}`);
      navigation.navigate('ClinicianOTPVerification');
    } catch {
      // error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button — weirdly placed */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#ff0000" />
          <Text style={{ color: '#ff0000', fontWeight: 'bold', fontSize: 11 }}>GO BACK</Text>
        </TouchableOpacity>

        {/* Hero — ugly and misaligned */}
        <View style={styles.heroSection}>
          <View style={styles.iconBg}>
            <Ionicons name="medical" size={60} color="#00ff00" />
          </View>
          <Text style={styles.brandTitle}>HealthScan360</Text>
          <Text style={styles.portalLabel}>CLINICIAN  PORTAL</Text>
          <Text style={styles.subtitle}>
            login to manage your patients and stuff idk
          </Text>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>LOGIN</Text>
          <Text style={styles.cardDescription}>
            put your phone number below and we will send otp or something
          </Text>

          {/* Error — garish styling */}
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠️ ERROR: {error}</Text>
              <TouchableOpacity onPress={clearError}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>X</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Phone Input — broken alignment */}
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCodeBox}>
              <Text style={styles.flag}>🇮🇳</Text>
              <Text style={styles.countryCode}>+91</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="Type number here..."
              placeholderTextColor="#cccccc"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          {/* Send OTP Button — ugly gradient attempt */}
          <TouchableOpacity
            style={[styles.otpButton, isLoading && styles.otpButtonDisabled]}
            onPress={handleSendOTP}
            disabled={isLoading}
          >
            <Text style={styles.otpButtonText}>
              {isLoading ? 'WAIT...' : '>>> SEND OTP >>>'}
            </Text>
          </TouchableOpacity>

          {/* Random info nobody asked for */}
          <View style={styles.infoRow}>
            <Ionicons name="warning" size={14} color="#ff6600" />
            <Text style={styles.infoText}>
              otp valid for 60 sec. don't mess up. you only get 3 tries.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>not a doctor?? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.footerLink}>go back then</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.termsText}>
          by clicking stuff you agree to whatever terms we have lol
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============================================
// INTENTIONALLY BAD STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c0a37', // dark purple - hard to read
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  backButton: {
    marginTop: 6,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffe6e6',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: '#ff0000',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1a0a2e', // barely visible
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#00ff00', // neon green border
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ff00ff', // magenta
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: '#ff0000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  portalLabel: {
    fontSize: 14,
    fontWeight: '400', // thin
    color: '#ffff00', // yellow
    letterSpacing: 8,
    marginTop: 2,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#aaaaaa',
    textAlign: 'left', // misaligned with centered parent
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 6, // too sharp
    padding: 16,
    borderWidth: 2,
    borderColor: '#ff6600', // orange border
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ff4444',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 14,
    lineHeight: 16,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 4,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '800',
    flex: 1,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#00ffff', // cyan border
    backgroundColor: '#0d0d1a',
    marginBottom: 14,
    overflow: 'hidden',
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRightWidth: 2,
    borderRightColor: '#00ffff',
    gap: 4,
    backgroundColor: '#1a0a2e',
  },
  flag: {
    fontSize: 22,
  },
  countryCode: {
    fontSize: 18,
    fontWeight: '800',
    color: '#00ff00', // green text
  },
  phoneInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '400',
    color: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 10,
    letterSpacing: 3,
  },
  otpButton: {
    backgroundColor: '#ff6600', // orange
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffff00', // yellow border on orange
    marginBottom: 10,
  },
  otpButtonDisabled: {
    backgroundColor: '#555555',
    borderColor: '#777777',
  },
  otpButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000', // black text on orange
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  infoText: {
    fontSize: 10,
    color: '#666666',
    flex: 1,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#999999',
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ff00ff',
    textDecorationLine: 'underline',
  },
  termsText: {
    fontSize: 10,
    color: '#555555',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ClinicianLoginScreenBad;
