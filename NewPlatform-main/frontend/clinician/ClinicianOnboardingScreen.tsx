/**
 * Clinician Onboarding Screen
 *
 * Multi-step onboarding form:
 * 1. Professional Details
 * 2. License & Certification Upload
 * 3. Specialty & Sub-specialty (multi-select)
 * 4. Consultation Fees
 * 5. Review & Submit
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ClinicianAuthStackParamList } from '../navigation/types';
import { useClinicianAuthStore } from '../context/ClinicianAuthContext';
import { OnboardingData } from '../services/clinicianApi';
import { colors, textStyles, spacing, borderRadius, semanticSpacing } from '../theme';

/* ─── Purple palette (replaces blue theme colors) ─── */
const purple = {
  50: '#F4ECF7',
  100: '#E8D8EF',
  200: '#D7BDE2',
  300: '#C39BD3',
  400: '#AF7AC5',
  500: '#5B2C6F',
  700: '#4A235A',
};
const gray = {
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
};
const amber = {
  50: '#FEF3C7',
  100: '#FDE68A',
  300: '#FCD34D',
  500: '#D97706',
  700: '#92400E',
};
const green = {
  50: '#DCFCE7',
  500: '#16A34A',
};

const TOTAL_STEPS = 5;

const SPECIALTIES = [
  'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
  'General Practice', 'Internal Medicine', 'Neurology', 'Obstetrics & Gynecology',
  'Oncology', 'Ophthalmology', 'Orthopedics', 'Pediatrics',
  'Psychiatry', 'Pulmonology', 'Radiology', 'Urology',
];

type Props = {
  navigation: NativeStackNavigationProp<ClinicianAuthStackParamList, 'ClinicianOnboarding'>;
  onComplete?: () => void;
};

export const ClinicianOnboardingScreen: React.FC<Props> = ({ navigation, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { submitOnboarding, error, clearError } = useClinicianAuthStore();

  const [formData, setFormData] = useState<OnboardingData>({
    full_name: '',
    email: '',
    registration_number: '',
    license_expiry_date: '',
    years_of_experience: 0,
    education: '',
    experience_details: '',
    hospital_affiliation: '',
    medical_license: null,
    degree_certificate: null,
    additional_certifications: [],
    specialties: [],
    sub_specialty: '',
    offers_video: true,
    offers_audio: true,
    offers_in_clinic: true,
    clinic_address: '',
    video_fee: 0,
    audio_fee: 0,
    in_clinic_fee: 0,
    currency: 'INR',
  });

  const updateField = (key: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        return !!(firstName && lastName && formData.email && formData.registration_number);
      case 2:
        return true; // Documents are optional for now
      case 3:
        return formData.specialties.length > 0;
      case 4:
        return true; // Fees can be 0
      case 5:
        return true;
      default:
        return false;
    }
  };

  const validateStep = (): boolean => {
    const errors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!firstName.trim()) errors.firstName = 'First name is required.';
      if (!lastName.trim()) errors.lastName = 'Last name is required.';
      if (!formData.email.trim()) errors.email = 'Email address is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Please enter a valid email.';
      if (!formData.registration_number.trim()) errors.registration_number = 'License ID is required.';
      if (formData.license_expiry_date && !/^\d{2}\/\d{2}\/\d{4}$/.test(formData.license_expiry_date))
        errors.license_expiry_date = 'Enter a valid date in DD/MM/YYYY format.';
      if (formData.years_of_experience > 70)
        errors.years_of_experience = 'Years of experience cannot exceed 70.';
    }
    if (currentStep === 3 && formData.specialties.length === 0) {
      errors.specialties = 'Please select at least one speciality.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (currentStep < TOTAL_STEPS) {
      setValidationErrors({});
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = { ...formData, full_name: `${firstName} ${lastName}`.trim() };
      await submitOnboarding(payload);
      setCurrentStep(6);
    } catch {
      Alert.alert('Error', 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentPick = (type: 'medical_license' | 'degree_certificate') => {
    // In a real app, use expo-document-picker
    Alert.alert(
      'Document Upload',
      'Document picker will be integrated with expo-document-picker.',
      [{ text: 'OK', onPress: () => updateField(type, 'mock-document-uri.pdf') }]
    );
  };

  // ========= STEP RENDERERS =========

  const renderStep0 = () => (
    <View style={styles.stepContent}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40, marginTop: 40 }}>
        <Ionicons name="medical" size={64} color={purple[500]} style={{ marginBottom: 20 }} />
        <Text style={[styles.stepTitle, { fontSize: 26, textAlign: 'center', marginBottom: 12 }]}>Welcome to HealthScan360</Text>
        <Text style={[styles.stepDescription, { fontSize: 16, textAlign: 'center', paddingHorizontal: 20, lineHeight: 24 }]}>
          Let's start by creating your profile in 5 simple steps
        </Text>
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepIconBg, { backgroundColor: purple[50] }]}>
          <Ionicons name="person" size={24} color={purple[500]} />
        </View>
        <Text style={styles.stepTitle}>1. Professional Details</Text>
        <Text style={styles.stepDescription}>
          Tell us about your professional background
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>First Name *</Text>
        <TextInput
          style={[styles.input, validationErrors.firstName && styles.inputError]}
          placeholder="John"
          placeholderTextColor={'#9CA3AF'}
          value={firstName}
          onChangeText={v => { setFirstName(v); setValidationErrors(prev => ({ ...prev, firstName: '' })); }}
        />
        {!!validationErrors.firstName && <Text style={styles.fieldError}>{validationErrors.firstName}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Last Name *</Text>
        <TextInput
          style={[styles.input, validationErrors.lastName && styles.inputError]}
          placeholder="Doe"
          placeholderTextColor={'#9CA3AF'}
          value={lastName}
          onChangeText={v => { setLastName(v); setValidationErrors(prev => ({ ...prev, lastName: '' })); }}
        />
        {!!validationErrors.lastName && <Text style={styles.fieldError}>{validationErrors.lastName}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={[styles.input, validationErrors.email && styles.inputError]}
          placeholder="doctor@example.com"
          placeholderTextColor={'#9CA3AF'}
          value={formData.email}
          onChangeText={v => { updateField('email', v); setValidationErrors(prev => ({ ...prev, email: '' })); }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {!!validationErrors.email && <Text style={styles.fieldError}>{validationErrors.email}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>License ID *</Text>
        <TextInput
          style={[styles.input, validationErrors.registration_number && styles.inputError]}
          placeholder="MCI-2024-XXXXX"
          placeholderTextColor={'#9CA3AF'}
          value={formData.registration_number}
          onChangeText={v => { updateField('registration_number', v); setValidationErrors(prev => ({ ...prev, registration_number: '' })); }}
          autoCapitalize="characters"
        />
        {!!validationErrors.registration_number && <Text style={styles.fieldError}>{validationErrors.registration_number}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Medical License Expiry Date</Text>
        <TextInput
          style={[styles.input, validationErrors.license_expiry_date && styles.inputError]}
          placeholder="DD/MM/YYYY"
          placeholderTextColor={'#9CA3AF'}
          value={formData.license_expiry_date}
          onChangeText={v => {
            // Auto-format as DD/MM/YYYY
            const digits = v.replace(/\D/g, '').slice(0, 8);
            let formatted = digits;
            if (digits.length > 4) formatted = digits.slice(0,2) + '/' + digits.slice(2,4) + '/' + digits.slice(4);
            else if (digits.length > 2) formatted = digits.slice(0,2) + '/' + digits.slice(2);
            updateField('license_expiry_date', formatted);
            setValidationErrors(prev => ({ ...prev, license_expiry_date: '' }));
          }}
          keyboardType="number-pad"
          maxLength={10}
        />
        {!!validationErrors.license_expiry_date && <Text style={styles.fieldError}>{validationErrors.license_expiry_date}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Years of Experience</Text>
        <TextInput
          style={[styles.input, validationErrors.years_of_experience && styles.inputError]}
          placeholder="0"
          placeholderTextColor={'#9CA3AF'}
          value={formData.years_of_experience ? String(formData.years_of_experience) : ''}
          onChangeText={v => {
            const num = parseInt(v) || 0;
            updateField('years_of_experience', num);
            setValidationErrors(prev => ({ ...prev, years_of_experience: num > 70 ? 'Years of experience cannot exceed 70.' : '' }));
          }}
          keyboardType="number-pad"
          maxLength={2}
        />
        {!!validationErrors.years_of_experience && <Text style={styles.fieldError}>{validationErrors.years_of_experience}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Education *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="e.g. MBBS — AIIMS Delhi, MD — PGI Chandigarh"
          placeholderTextColor={'#111827'}
          value={formData.education}
          onChangeText={v => updateField('education', v)}
          multiline
          numberOfLines={2}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Experience Details</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your clinical experience, previous roles, etc."
          placeholderTextColor={'#111827'}
          value={formData.experience_details}
          onChangeText={v => updateField('experience_details', v)}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Hospital / Clinic Affiliation</Text>
        <TextInput
          style={styles.input}
          placeholder="City Hospital, Mumbai"
          placeholderTextColor={'#111827'}
          value={formData.hospital_affiliation}
          onChangeText={v => updateField('hospital_affiliation', v)}
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepIconBg, { backgroundColor: purple[50] }]}>
          <Ionicons name="document-text" size={24} color={purple[500]} />
        </View>
        <Text style={styles.stepTitle}>2. Documents</Text>
        <Text style={styles.stepDescription}>
          Upload your license and certifications for verification
        </Text>
      </View>

      <TouchableOpacity
        style={styles.uploadCard}
        onPress={() => handleDocumentPick('medical_license')}
        activeOpacity={0.7}
      >
        <View style={styles.uploadIconBg}>
          <Ionicons
            name={formData.medical_license ? 'checkmark-circle' : 'cloud-upload'}
            size={28}
            color={formData.medical_license ? colors.safety.safe : purple[500]}
          />
        </View>
        <View style={styles.uploadInfo}>
          <Text style={styles.uploadTitle}>Medical License</Text>
          <Text style={styles.uploadSubtitle}>
            {formData.medical_license ? 'Document uploaded ✓' : 'PDF, JPG or PNG (max 5MB)'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={gray[400]} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.uploadCard}
        onPress={() => handleDocumentPick('degree_certificate')}
        activeOpacity={0.7}
      >
        <View style={styles.uploadIconBg}>
          <Ionicons
            name={formData.degree_certificate ? 'checkmark-circle' : 'cloud-upload'}
            size={28}
            color={formData.degree_certificate ? colors.safety.safe : purple[500]}
          />
        </View>
        <View style={styles.uploadInfo}>
          <Text style={styles.uploadTitle}>Degree Certificate</Text>
          <Text style={styles.uploadSubtitle}>
            {formData.degree_certificate ? 'Document uploaded ✓' : 'PDF, JPG or PNG (max 5MB)'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={gray[400]} />
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={18} color={purple[500]} />
        <Text style={styles.infoBoxText}>
          Documents are securely stored and only used for verification purposes.
        </Text>
      </View>
    </View>
  );

  const renderStep3 = () => {
    const toggleSpecialty = (spec: string) => {
      setFormData(prev => {
        const current = prev.specialties || [];
        if (current.includes(spec)) {
          return { ...prev, specialties: current.filter(s => s !== spec) };
        } else {
          return { ...prev, specialties: [...current, spec] };
        }
      });
    };

    return (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepIconBg, { backgroundColor: purple[50] }]}>
          <Ionicons name="medkit" size={24} color={purple[500]} />
        </View>
        <Text style={styles.stepTitle}>3. Speciality</Text>
        <Text style={styles.stepDescription}>
          Select your areas of expertise (multiple allowed)
        </Text>
      </View>

      <Text style={styles.label}>Specialities *</Text>
      <View style={styles.chipGrid}>
        {SPECIALTIES.map(spec => (
          <TouchableOpacity
            key={spec}
            style={[
              styles.chip,
              formData.specialties.includes(spec) && styles.chipSelected,
            ]}
            onPress={() => toggleSpecialty(spec)}
          >
            <Text
              style={[
                styles.chipText,
                formData.specialties.includes(spec) && styles.chipTextSelected,
              ]}
            >
              {spec}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
};

  // Step 4 (Consultation Types) has been removed

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepIconBg, { backgroundColor: purple[50] }]}>
          <Ionicons name="cash" size={24} color={purple[500]} />
        </View>
        <Text style={styles.stepTitle}>4. Consultation Fees</Text>
        <Text style={styles.stepDescription}>
          Set your fees for each consultation type
        </Text>
      </View>

      <View style={styles.currencyTag}>
        <Text style={styles.currencyText}>Currency: ₹ INR</Text>
      </View>

      {formData.offers_video && (
        <View style={styles.feeRow}>
          <View style={styles.feeLabel}>
            <Ionicons name="videocam" size={20} color={purple[500]} />
            <Text style={styles.feeLabelText}>Video</Text>
          </View>
          <View style={styles.feeInputWrap}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.feeInput}
              placeholder="800"
              placeholderTextColor={'#111827'}
              value={formData.video_fee ? String(formData.video_fee) : ''}
              onChangeText={v => updateField('video_fee', parseInt(v) || 0)}
              keyboardType="number-pad"
            />
          </View>
        </View>
      )}

      {formData.offers_audio && (
        <View style={styles.feeRow}>
          <View style={styles.feeLabel}>
            <Ionicons name="call" size={20} color={purple[500]} />
            <Text style={styles.feeLabelText}>Audio</Text>
          </View>
          <View style={styles.feeInputWrap}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.feeInput}
              placeholder="500"
              placeholderTextColor={'#111827'}
              value={formData.audio_fee ? String(formData.audio_fee) : ''}
              onChangeText={v => updateField('audio_fee', parseInt(v) || 0)}
              keyboardType="number-pad"
            />
          </View>
        </View>
      )}

      {formData.offers_in_clinic && (
        <View style={styles.feeRow}>
          <View style={styles.feeLabel}>
            <Ionicons name="business" size={20} color={purple[500]} />
            <Text style={styles.feeLabelText}>In-Clinic</Text>
          </View>
          <View style={styles.feeInputWrap}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.feeInput}
              placeholder="1200"
              placeholderTextColor={'#111827'}
              value={formData.in_clinic_fee ? String(formData.in_clinic_fee) : ''}
              onChangeText={v => updateField('in_clinic_fee', parseInt(v) || 0)}
              keyboardType="number-pad"
            />
          </View>
        </View>
      )}
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepIconBg, { backgroundColor: purple[50] }]}>
          <Ionicons name="checkmark-done" size={24} color={purple[500]} />
        </View>
        <Text style={styles.stepTitle}>5. Review & Submit</Text>
        <Text style={styles.stepDescription}>
          Verify your details before submitting
        </Text>
      </View>

      <View style={styles.reviewCard}>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Name</Text>
          <Text style={styles.reviewValue}>{firstName} {lastName}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Email</Text>
          <Text style={styles.reviewValue}>{formData.email || '—'}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>License ID</Text>
          <Text style={styles.reviewValue}>{formData.registration_number || '—'}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>License Expiry</Text>
          <Text style={styles.reviewValue}>{formData.license_expiry_date || '—'}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Experience</Text>
          <Text style={styles.reviewValue}>{formData.years_of_experience} years</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Education</Text>
          <Text style={styles.reviewValue}>{formData.education || '—'}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Experience Details</Text>
          <Text style={styles.reviewValue}>{formData.experience_details || '—'}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Affiliation</Text>
          <Text style={styles.reviewValue}>{formData.hospital_affiliation || '—'}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Speciality</Text>
          <Text style={styles.reviewValue}>{formData.specialties.join(', ') || '—'}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Consultations</Text>
          <Text style={styles.reviewValue}>
            {[
              formData.offers_video && 'Video',
              formData.offers_audio && 'Audio',
              formData.offers_in_clinic && 'In-Clinic',
            ].filter(Boolean).join(', ') || '—'}
          </Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Documents</Text>
          <Text style={styles.reviewValue}>
            {[
              formData.medical_license && 'License',
              formData.degree_certificate && 'Degree',
            ].filter(Boolean).join(', ') || 'None uploaded'}
          </Text>
        </View>
      </View>



      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={18} color={colors.safety.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );

  const renderStep6 = () => (
    <View style={styles.stepContent}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60, marginTop: 40 }}>
        <View style={[styles.stepIconBg, { backgroundColor: '#E8F5E9', width: 80, height: 80, borderRadius: 40, marginBottom: 0 }]}>
          <Ionicons name="checkmark" size={48} color={colors.safety.safe || '#4CAF50'} />
        </View>
        <Text style={[styles.stepTitle, { fontSize: 26, textAlign: 'center', marginBottom: 16, marginTop: 24 }]}>
          Thank you for submitting!
        </Text>
        <Text style={[styles.stepDescription, { fontSize: 16, textAlign: 'center', paddingHorizontal: 20, lineHeight: 26 }]}>
          You will be onboarded on the platform once the admin approves your request.
        </Text>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderStep0();
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      default: return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {currentStep > 0 && currentStep <= TOTAL_STEPS && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(currentStep / TOTAL_STEPS) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>Step {currentStep} of {TOTAL_STEPS}</Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentStep()}
      </ScrollView>

      {currentStep <= TOTAL_STEPS && (
        <View style={styles.navButtons}>
          {currentStep > 0 && (
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
          )}
          {currentStep < TOTAL_STEPS ? (
            <TouchableOpacity
              style={[styles.nextBtn, !canProceed() && styles.nextBtnDisabled]}
              onPress={handleNext}
              disabled={!canProceed()}
              activeOpacity={0.85}
            >
              <Text style={styles.nextBtnText}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.nextBtnText}>
                {isSubmitting ? 'Processing...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
  progressContainer: {
    paddingHorizontal: semanticSpacing.screenHorizontal,
    paddingTop: spacing['3'],
    paddingBottom: spacing['2'],
  },
  progressBar: {
    height: 6,
    backgroundColor: gray[200],
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing['2'],
  },
  progressFill: {
    height: '100%',
    backgroundColor: purple[500],
    borderRadius: 3,
  },
  progressText: {
    ...textStyles.caption,
    color: colors.text.tertiary,
    textAlign: 'right',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: semanticSpacing.screenHorizontal,
    paddingBottom: spacing['4'],
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: spacing['6'],
  },
  stepIconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['3'],
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing['1'],
  },
  stepDescription: {
    ...textStyles.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: spacing['4'],
  },
  label: {
    ...textStyles.bodySmall,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing['2'],
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['4'],
    fontSize: 15,
    color: colors.text.primary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: spacing['4'],
    marginBottom: spacing['3'],
    borderWidth: 1,
    borderColor: colors.border.light,
    gap: spacing['3'],
  },
  uploadIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: purple[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadInfo: { flex: 1 },
  uploadTitle: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
  },
  uploadSubtitle: {
    ...textStyles.caption,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: purple[50],
    padding: spacing['3'],
    borderRadius: borderRadius.lg,
    gap: spacing['2'],
    marginTop: spacing['2'],
  },
  infoBoxText: {
    ...textStyles.caption,
    color: purple[700],
    flex: 1,
    lineHeight: 18,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['2'],
  },
  chip: {
    paddingVertical: spacing['2'],
    paddingHorizontal: spacing['3'],
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  chipSelected: {
    backgroundColor: purple[500],
    borderColor: purple[500],
  },
  chipText: {
    ...textStyles.caption,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    marginTop: spacing['3'],
    paddingVertical: spacing['2'],
    paddingHorizontal: spacing['3'],
    backgroundColor: purple[50],
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  selectedInfoText: {
    ...textStyles.caption,
    fontWeight: '600',
    color: purple[700],
  },
  consultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: spacing['4'],
    marginBottom: spacing['3'],
    borderWidth: 1.5,
    borderColor: colors.border.light,
    gap: spacing['3'],
  },
  consultCardActive: {
    borderColor: purple[500],
    backgroundColor: purple[50],
  },
  consultIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  consultIconActive: {
    backgroundColor: purple[500],
  },
  consultInfo: { flex: 1 },
  consultTitle: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
  },
  consultTitleActive: {
    color: purple[700],
  },
  consultDesc: {
    ...textStyles.caption,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: purple[500],
    borderColor: purple[500],
  },
  currencyTag: {
    alignSelf: 'flex-start',
    backgroundColor: amber[100],
    paddingVertical: spacing['1'],
    paddingHorizontal: spacing['3'],
    borderRadius: 12,
    marginBottom: spacing['4'],
  },
  currencyText: {
    ...textStyles.caption,
    fontWeight: '600',
    color: amber[700],
  },
  feeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['4'],
    gap: spacing['3'],
  },
  feeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    width: 100,
  },
  feeLabelText: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
  },
  feeInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    overflow: 'hidden',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.tertiary,
    paddingLeft: spacing['3'],
  },
  feeInput: {
    flex: 1,
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['2'],
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingTop: spacing['3'],
    paddingBottom: spacing['3'],
    paddingHorizontal: spacing['4'],
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing['3'],
    paddingLeft: spacing['1'],
    borderBottomWidth: 1,
    borderBottomColor: gray[100],
  },
  reviewLabel: {
    ...textStyles.bodySmall,
    color: colors.text.tertiary,
    flex: 1,
    paddingLeft: spacing['1'],
  },
  reviewValue: {
    ...textStyles.bodySmall,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1.5,
    textAlign: 'right',
    paddingRight: spacing['1'],
  },
  inputError: {
    borderColor: colors.safety.danger,
    borderWidth: 1.5,
  },
  fieldError: {
    ...textStyles.caption,
    color: colors.safety.danger,
    marginTop: 4,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.safety.dangerLight,
    padding: spacing['3'],
    borderRadius: borderRadius.lg,
    gap: spacing['2'],
    marginTop: spacing['4'],
  },
  errorText: {
    ...textStyles.bodySmall,
    color: colors.safety.danger,
    flex: 1,
  },
  navButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['3'],
    paddingHorizontal: semanticSpacing.screenHorizontal,
    paddingVertical: spacing['3'],
    backgroundColor: '#F0F4F8',
    borderTopWidth: 1,
    borderTopColor: gray[200],
  },
  backBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['1'],
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['4'],
    borderRadius: 12,
    backgroundColor: 'rgb(142, 187, 159)',
  },
  backBtnText: {
    ...textStyles.bodyMedium,
    color: '#FFFFFF',
  },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['6'],
    borderRadius: 12,
    backgroundColor: 'rgb(116, 175, 46)',
  },
  nextBtnDisabled: {
    opacity: 0.5,
  },
  nextBtnText: {
    ...textStyles.bodyMedium,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  submitBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
    paddingVertical: spacing['3'],
    paddingHorizontal: spacing['6'],
    borderRadius: 12,
    backgroundColor: 'rgb(116, 175, 46)',
  },
  approvalNotice: {
    backgroundColor: amber[50],
    borderWidth: 1,
    borderColor: amber[300],
    borderRadius: 12,
    padding: spacing['4'],
    marginTop: spacing['4'],
  },
  approvalIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    marginBottom: spacing['2'],
  },
  approvalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: amber[700],
  },
  approvalText: {
    fontSize: 13,
    color: amber[700],
    lineHeight: 20,
  },
});

export default ClinicianOnboardingScreen;
