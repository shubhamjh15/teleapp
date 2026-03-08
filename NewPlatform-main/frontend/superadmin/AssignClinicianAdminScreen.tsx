/**
 * Assign Clinician Admin Screen — Map clinic with administrative staff
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
import {
  getClinics,
  getUsers,
  assignClinicianAdmin,
  Clinic,
  User,
} from '../common/services/clinicService';

const AssignClinicianAdminScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [clinicsData, usersData] = await Promise.all([
        getClinics(),
        getUsers(),
      ]);
      setClinics(clinicsData);
      setUsers(usersData);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedClinicId || !selectedUserId) {
      Alert.alert('Validation Error', 'Please select both clinic and user');
      return;
    }

    setSubmitting(true);
    try {
      await assignClinicianAdmin({
        clinic_id: selectedClinicId,
        user_id: selectedUserId,
      });
      Alert.alert(
        'Success',
        'Clinician admin assigned successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to assign admin');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedClinic = clinics.find((c) => c.id === selectedClinicId);
  const selectedUser = users.find((u) => u.id === selectedUserId);

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
            <Text style={styles.pageTitle}>Assign Clinician Admin</Text>
            <Text style={styles.pageSubtitle}>Map clinic with administrative staff</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6D2ACE" />
            <Text style={styles.loadingText}>Loading data...</Text>
          </View>
        ) : (
          <>
            {/* Select Clinic */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Select Clinic *</Text>
              <View style={styles.pickerWrapper}>
                <Ionicons name="business-outline" size={20} color="#666" style={styles.pickerIcon} />
                <Picker
                  selectedValue={selectedClinicId}
                  onValueChange={(value) => setSelectedClinicId(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Choose a clinic..." value={null} />
                  {clinics.map((clinic) => (
                    <Picker.Item
                      key={clinic.id}
                      label={`${clinic.name} (${clinic.city})`}
                      value={clinic.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Selected Clinic Details */}
            {selectedClinic && (
              <View style={styles.detailsCard}>
                <Text style={styles.detailsTitle}>Selected Clinic Details</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailValue}>{selectedClinic.name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location:</Text>
                  <Text style={styles.detailValue}>
                    {selectedClinic.city}, {selectedClinic.state}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          selectedClinic.status === 'approved' ? '#E8F8F0' : '#FFF4E6',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            selectedClinic.status === 'approved' ? '#34C759' : '#FF9500',
                        },
                      ]}
                    >
                      {selectedClinic.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                {selectedClinic.assigned_admin_name && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Current Admin:</Text>
                    <Text style={styles.detailValue}>{selectedClinic.assigned_admin_name}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Select User */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Select User *</Text>
              <View style={styles.pickerWrapper}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.pickerIcon} />
                <Picker
                  selectedValue={selectedUserId}
                  onValueChange={(value) => setSelectedUserId(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Choose a user..." value={null} />
                  {users.map((user) => (
                    <Picker.Item
                      key={user.id}
                      label={`${user.name || user.mobile_number} (${user.role})`}
                      value={user.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Selected User Details */}
            {selectedUser && (
              <View style={styles.detailsCard}>
                <Text style={styles.detailsTitle}>Selected User Details</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Mobile:</Text>
                  <Text style={styles.detailValue}>{selectedUser.mobile_number}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Role:</Text>
                  <Text style={styles.detailValue}>{selectedUser.role}</Text>
                </View>
                {selectedUser.email && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue}>{selectedUser.email}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={24} color="#3E82D7" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Assignment Note</Text>
                <Text style={styles.infoText}>
                  The selected user will be assigned as the administrative staff for the chosen clinic
                </Text>
              </View>
            </View>

            {/* Assign Button */}
            <TouchableOpacity
              style={[styles.assignButton, submitting && styles.assignButtonDisabled]}
              onPress={handleAssign}
              disabled={submitting || !selectedClinicId || !selectedUserId}
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="link" size={24} color="#FFFFFF" />
                  <Text style={styles.assignButtonText}>Assign Admin</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

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
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#6D2ACE',
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    width: 120,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3EEF9',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3E82D7',
    marginBottom: 24,
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
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3E82D7',
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  assignButtonDisabled: {
    opacity: 0.6,
  },
  assignButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default AssignClinicianAdminScreen;
