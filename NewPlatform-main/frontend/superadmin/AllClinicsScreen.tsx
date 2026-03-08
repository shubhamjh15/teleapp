/**
 * All Clinics Screen — View all registered clinics
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../common/components/Header';
import { getClinics, Clinic } from '../common/services/clinicService';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending:  { label: 'Pending',  color: '#FF9500', bg: '#FFF4E6', icon: 'time' },
  approved: { label: 'Approved', color: '#34C759', bg: '#E8F8F0', icon: 'checkmark-circle' },
  rejected: { label: 'Rejected', color: '#FF3B30', bg: '#FFECEA', icon: 'close-circle' },
};

const AllClinicsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getClinics();
      setClinics(data);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to load clinics');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleViewDetails = (clinic: Clinic) => {
    navigation.navigate('ReviewClinicDetails', { clinicId: clinic.id });
  };

  return (
    <View style={styles.container}>
      <Header
        navigation={navigation}
        userName="Super Admin"
        onNotificationPress={() => {}}
        onAvatarPress={() => {}}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.pageTitle}>All Clinics</Text>
            <Text style={styles.pageSubtitle}>Complete list of registered clinics</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#6D2ACE" />
            <Text style={styles.loadingText}>Loading clinics...</Text>
          </View>
        ) : clinics.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="business-outline" size={64} color="#CCC" />
            <Text style={styles.emptyTitle}>No Clinics Found</Text>
            <Text style={styles.emptyText}>No clinics have been registered yet.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.countLabel}>{clinics.length} clinic{clinics.length !== 1 ? 's' : ''} total</Text>
            <View style={styles.list}>
              {clinics.map((clinic) => {
                const s = STATUS_CONFIG[clinic.status] ?? STATUS_CONFIG.pending;
                return (
                  <View key={clinic.id} style={styles.card}>
                    {/* Left accent */}
                    <View style={[styles.accent, { backgroundColor: s.color }]} />

                    {/* Top row */}
                    <View style={styles.cardTop}>
                      <View style={[styles.iconBox, { backgroundColor: '#EDE5FF' }]}>
                        <Ionicons name="business" size={28} color="#6D2ACE" />
                      </View>
                      <View style={styles.cardMeta}>
                        <Text style={styles.clinicName}>{clinic.name}</Text>
                        <Text style={styles.clinicLocation}>{clinic.city}, {clinic.state}</Text>
                      </View>
                      <View style={[styles.badge, { backgroundColor: s.bg }]}>
                        <Ionicons name={s.icon} size={13} color={s.color} />
                        <Text style={[styles.badgeText, { color: s.color }]}>{s.label}</Text>
                      </View>
                    </View>

                    {/* Details */}
                    <View style={styles.details}>
                      <View style={styles.detailRow}>
                        <Ionicons name="document-text-outline" size={15} color="#999" />
                        <Text style={styles.detailText}>{clinic.registration_number}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="call-outline" size={15} color="#999" />
                        <Text style={styles.detailText}>{clinic.contact_number}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="mail-outline" size={15} color="#999" />
                        <Text style={styles.detailText} numberOfLines={1}>{clinic.email}</Text>
                      </View>
                    </View>

                    {/* Action */}
                    <TouchableOpacity
                      style={styles.viewBtn}
                      onPress={() => handleViewDetails(clinic)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="eye-outline" size={18} color="#3E82D7" />
                      <Text style={styles.viewBtnText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 40 },
  pageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  backButton: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  pageTitle: { fontSize: 22, fontWeight: '700', color: '#1A1A1A' },
  pageSubtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  center: { alignItems: 'center', paddingVertical: 60 },
  loadingText: { marginTop: 12, fontSize: 15, color: '#666' },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A', marginTop: 16 },
  emptyText: { fontSize: 14, color: '#888', marginTop: 6, textAlign: 'center' },
  countLabel: { fontSize: 13, color: '#999', fontWeight: '600', marginBottom: 12 },
  list: { gap: 14 },
  card: {
    backgroundColor: '#FFF', borderRadius: 16,
    padding: 18, paddingLeft: 22,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
    position: 'relative', overflow: 'hidden',
  },
  accent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  iconBox: {
    width: 52, height: 52, borderRadius: 13,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  cardMeta: { flex: 1 },
  clinicName: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 3 },
  clinicLocation: { fontSize: 13, color: '#888' },
  badge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 8, gap: 4,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
  details: { gap: 8, marginBottom: 16 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: 13, color: '#666', flex: 1 },
  viewBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#E3EEF9', borderRadius: 10,
    paddingVertical: 11, gap: 6,
  },
  viewBtnText: { fontSize: 14, fontWeight: '700', color: '#3E82D7' },
});

export default AllClinicsScreen;
