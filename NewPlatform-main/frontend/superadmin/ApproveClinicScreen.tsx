/**
 * Approve Clinic Screen — Review and approve pending clinics
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
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../common/components/Header';
import { getClinics, approveClinic, Clinic } from '../common/services/clinicService';

const ApproveClinicScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingClinics, setPendingClinics] = useState<Clinic[]>([]);
  const [approvingId, setApprovingId] = useState<number | null>(null);

  useEffect(() => {
    loadPendingClinics();
  }, []);

  const loadPendingClinics = async () => {
    try {
      setLoading(true);
      const clinics = await getClinics();
      setPendingClinics(clinics.filter((c) => c.status === 'pending'));
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load clinics');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPendingClinics();
    setRefreshing(false);
  };

  const handleApprove = (clinic: Clinic) => {
    Alert.alert(
      'Approve Clinic',
      `Are you sure you want to approve "${clinic.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Approve',
          style: 'default',
          onPress: () => performApproval(clinic),
        },
      ]
    );
  };

  const performApproval = async (clinic: Clinic) => {
    try {
      setApprovingId(clinic.id);
      await approveClinic(clinic.id);
      Alert.alert(
        'Success',
        `"${clinic.name}" has been approved successfully!`,
        [
          {
            text: 'OK',
            onPress: () => loadPendingClinics(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to approve clinic');
    } finally {
      setApprovingId(null);
    }
  };

  const handleViewDetails = (clinic: Clinic) => {
    navigation.navigate('ReviewClinicDetails', { clinicId: clinic.id });
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.pageTitle}>Approve Clinics</Text>
            <Text style={styles.pageSubtitle}>
              Review and approve pending clinic registrations
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={28} color="#FF9500" />
            <Text style={styles.statNumber}>{pendingClinics.length}</Text>
            <Text style={styles.statLabel}>Pending Approvals</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6D2ACE" />
            <Text style={styles.loadingText}>Loading pending clinics...</Text>
          </View>
        ) : pendingClinics.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="checkmark-done" size={64} color="#34C759" />
            </View>
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptyText}>
              There are no pending clinic approvals at the moment
            </Text>
          </View>
        ) : (
          <View style={styles.clinicsContainer}>
            <Text style={styles.sectionTitle}>Pending Clinics</Text>
            {pendingClinics.map((clinic) => (
              <View key={clinic.id} style={styles.clinicCard}>
                {/* Header */}
                <View style={styles.clinicHeader}>
                  <View style={styles.clinicIconContainer}>
                    <Ionicons name="business" size={32} color="#6D2ACE" />
                  </View>
                  <View style={styles.clinicInfo}>
                    <Text style={styles.clinicName}>{clinic.name}</Text>
                    <Text style={styles.clinicLocation}>
                      {clinic.city}, {clinic.state}
                    </Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Ionicons name="time" size={14} color="#FF9500" />
                    <Text style={styles.statusText}>Pending</Text>
                  </View>
                </View>

                {/* Details */}
                <View style={styles.clinicDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="document-text-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{clinic.registration_number}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="call-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>{clinic.contact_number}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="mail-outline" size={16} color="#666" />
                    <Text style={styles.detailText} numberOfLines={1}>
                      {clinic.email}
                    </Text>
                  </View>
                  {clinic.assigned_admin_name && (
                    <View style={styles.detailItem}>
                      <Ionicons name="person-outline" size={16} color="#666" />
                      <Text style={styles.detailText}>
                        Admin: {clinic.assigned_admin_name}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Actions */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => handleViewDetails(clinic)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="eye-outline" size={20} color="#3E82D7" />
                    <Text style={styles.detailsButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>

                {/* Accent */}
                <View style={styles.cardAccent} />
              </View>
            ))}
          </View>
        )}

        {/* Info Card */}
        {pendingClinics.length > 0 && (
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#3E82D7" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Approval Process</Text>
              <Text style={styles.infoText}>
                Review each clinic's details before approval. Once approved, the clinic status
                will change to "Approved" and they can start using the system.
              </Text>
            </View>
          </View>
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
    marginBottom: 20,
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
  statsCard: {
    backgroundColor: '#FFF4E6',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 40,
  },
  clinicsContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  clinicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  clinicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  clinicIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#EDE5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  clinicInfo: {
    flex: 1,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  clinicLocation: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF9500',
  },
  clinicDetails: {
    gap: 10,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  detailsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3EEF9',
    borderRadius: 10,
    padding: 13,
    gap: 6,
  },
  detailsButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3E82D7',
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    borderRadius: 10,
    padding: 12,
    gap: 6,
  },
  approveButtonDisabled: {
    opacity: 0.6,
  },
  approveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#FF9500',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E3EEF9',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3E82D7',
    marginTop: 24,
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
});

export default ApproveClinicScreen;
