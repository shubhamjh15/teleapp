/**
 * Review Clinic Details Screen — View comprehensive clinic information
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Header from '../common/components/Header';
import { getClinics, getClinicById, Clinic } from '../common/services/clinicService';

const ReviewClinicDetailsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<number | null>(null);
  const [clinicDetails, setClinicDetails] = useState<Clinic | null>(null);

  useEffect(() => {
    loadClinics();
  }, []);

  const loadClinics = async () => {
    try {
      setLoading(true);
      const data = await getClinics();
      setClinics(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load clinics');
    } finally {
      setLoading(false);
    }
  };

  const loadClinicDetails = async (clinicId: number) => {
    try {
      setLoadingDetails(true);
      const data = await getClinicById(clinicId);
      setClinicDetails(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load clinic details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleClinicSelect = (clinicId: number | null) => {
    setSelectedClinicId(clinicId);
    if (clinicId) {
      loadClinicDetails(clinicId);
    } else {
      setClinicDetails(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return { bg: '#E8F8F0', text: '#34C759' };
      case 'pending':
        return { bg: '#FFF4E6', text: '#FF9500' };
      case 'rejected':
        return { bg: '#FFE5E5', text: '#FF3B30' };
      default:
        return { bg: '#F5F5F5', text: '#666' };
    }
  };

  return (
    <View style={styles.container}>
      <Header
        navigation={navigation}
        userName="Super Admin"
        onNotificationPress={() => console.log('Notifications pressed')}
        onAvatarPress={() => console.log('Avatar pressed')}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.pageTitle}>Review Clinic Details</Text>
            <Text style={styles.pageSubtitle}>View comprehensive clinic information</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6D2ACE" />
            <Text style={styles.loadingText}>Loading clinics...</Text>
          </View>
        ) : (
          <>
            {/* Select Clinic */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Select Clinic</Text>
              <View style={styles.pickerWrapper}>
                <Ionicons name="business-outline" size={20} color="#666" style={styles.pickerIcon} />
                <Picker
                  selectedValue={selectedClinicId}
                  onValueChange={handleClinicSelect}
                  style={styles.picker}
                >
                  <Picker.Item label="Choose a clinic to review..." value={null} />
                  {clinics.map((clinic) => (
                    <Picker.Item
                      key={clinic.id}
                      label={`${clinic.name} - ${clinic.city}`}
                      value={clinic.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Clinic Details */}
            {loadingDetails ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6D2ACE" />
                <Text style={styles.loadingText}>Loading details...</Text>
              </View>
            ) : clinicDetails ? (
              <View style={styles.detailsContainer}>
                {/* Status Badge */}
                <View
                  style={[
                    styles.statusCard,
                    { backgroundColor: getStatusColor(clinicDetails.status).bg },
                  ]}
                >
                  <Ionicons
                    name={
                      clinicDetails.status === 'approved'
                        ? 'checkmark-circle'
                        : clinicDetails.status === 'pending'
                        ? 'time'
                        : 'close-circle'
                    }
                    size={32}
                    color={getStatusColor(clinicDetails.status).text}
                  />
                  <View style={styles.statusContent}>
                    <Text style={styles.statusLabel}>Current Status</Text>
                    <Text
                      style={[
                        styles.statusValue,
                        { color: getStatusColor(clinicDetails.status).text },
                      ]}
                    >
                      {clinicDetails.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Basic Information */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Basic Information</Text>
                  <View style={styles.card}>
                    <DetailRow
                      icon="business"
                      label="Clinic Name"
                      value={clinicDetails.name}
                    />
                    <DetailRow
                      icon="document-text"
                      label="Registration Number"
                      value={clinicDetails.registration_number}
                    />
                    <DetailRow
                      icon="mail"
                      label="Email"
                      value={clinicDetails.email}
                    />
                    <DetailRow
                      icon="call"
                      label="Contact Number"
                      value={clinicDetails.contact_number}
                    />
                  </View>
                </View>

                {/* Location Information */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Location Details</Text>
                  <View style={styles.card}>
                    <DetailRow
                      icon="location"
                      label="Address"
                      value={clinicDetails.address}
                    />
                    <DetailRow icon="pin" label="City" value={clinicDetails.city} />
                    <DetailRow icon="map" label="State" value={clinicDetails.state} />
                  </View>
                </View>

                {/* License Document */}
                {clinicDetails.license_document && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>License Document</Text>
                    <TouchableOpacity style={styles.documentCard} activeOpacity={0.7}>
                      <View style={styles.documentIcon}>
                        <Ionicons name="document" size={32} color="#6D2ACE" />
                      </View>
                      <View style={styles.documentContent}>
                        <Text style={styles.documentName}>License.pdf</Text>
                        <Text style={styles.documentInfo}>Tap to view document</Text>
                      </View>
                      <Ionicons name="eye-outline" size={24} color="#6D2ACE" />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Assigned Admin */}
                {clinicDetails.assigned_admin_name ? (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Assigned Admin</Text>
                    <View style={styles.card}>
                      <DetailRow
                        icon="person"
                        label="Admin Name"
                        value={clinicDetails.assigned_admin_name}
                      />
                      <DetailRow
                        icon="shield-checkmark"
                        label="Admin ID"
                        value={`#${clinicDetails.assigned_admin_id}`}
                      />
                    </View>
                  </View>
                ) : (
                  <View style={styles.infoCard}>
                    <Ionicons name="information-circle" size={24} color="#FF9500" />
                    <View style={styles.infoContent}>
                      <Text style={styles.infoTitle}>No Admin Assigned</Text>
                      <Text style={styles.infoText}>
                        This clinic doesn't have an assigned administrator yet
                      </Text>
                    </View>
                  </View>
                )}

                {/* Timestamps */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Timeline</Text>
                  <View style={styles.card}>
                    <DetailRow
                      icon="calendar"
                      label="Created At"
                      value={new Date(clinicDetails.created_at).toLocaleString()}
                    />
                    <DetailRow
                      icon="time"
                      label="Last Updated"
                      value={new Date(clinicDetails.updated_at).toLocaleString()}
                    />
                  </View>
                </View>
              </View>
            ) : selectedClinicId ? (
              <View style={styles.emptyState}>
                <Ionicons name="document-outline" size={64} color="#CCC" />
                <Text style={styles.emptyText}>No details available</Text>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={64} color="#CCC" />
                <Text style={styles.emptyText}>Select a clinic to view details</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

// Helper component for detail rows
const DetailRow: React.FC<{ icon: any; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <View style={detailRowStyles.container}>
    <View style={detailRowStyles.labelContainer}>
      <Ionicons name={icon} size={18} color="#666" style={detailRowStyles.icon} />
      <Text style={detailRowStyles.label}>{label}</Text>
    </View>
    <Text style={detailRowStyles.value}>{value}</Text>
  </View>
);

const detailRowStyles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  value: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
    paddingLeft: 26,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666',
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingLeft: 16,
  },
  pickerIcon: {
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 52,
  },
  detailsContainer: {
    gap: 20,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    gap: 16,
  },
  statusContent: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  documentIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#EDE5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentContent: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  documentInfo: {
    fontSize: 13,
    color: '#666',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF4E6',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
});

export default ReviewClinicDetailsScreen;
