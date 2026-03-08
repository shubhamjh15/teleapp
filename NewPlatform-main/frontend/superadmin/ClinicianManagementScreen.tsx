/**
 * Clinician Management — List and manage clinicians
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../common/components/Header';
import { getUsers } from '../common/services/clinicService';

interface User {
  id: number;
  mobile_number: string;
  role: string;
  name?: string;
  email?: string;
}

const ClinicianManagementScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [clinicians, setClinicians] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadClinicians = useCallback(async () => {
    try {
      const users = await getUsers();
      setClinicians(users.filter((u: User) => u.role === 'clinician'));
    } catch (err) {
      console.error('Failed to load clinicians:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadClinicians();
    }, [loadClinicians])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadClinicians();
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3E82D7']} />}
      >
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#3E82D7" />
          </TouchableOpacity>
          <View style={styles.pageTitleBlock}>
            <Text style={styles.pageTitle}>Clinicians</Text>
            <Text style={styles.pageSubtitle}>Medical professionals in the system</Text>
          </View>
        </View>

        {/* Stats Badge */}
        <View style={styles.statsBadge}>
          <View style={styles.statBadgeIcon}>
            <Ionicons name="medkit" size={18} color="#3E82D7" />
          </View>
          <Text style={styles.statsBadgeText}>
            {loading ? '...' : `${clinicians.length} Clinician${clinicians.length !== 1 ? 's' : ''}`}
          </Text>
        </View>

        {/* List */}
        {loading ? (
          <ActivityIndicator size="large" color="#3E82D7" style={styles.loader} />
        ) : clinicians.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="medkit-outline" size={64} color="#B3D0F0" />
            <Text style={styles.emptyTitle}>No Clinicians</Text>
            <Text style={styles.emptySubtitle}>No clinicians have been added yet.</Text>
          </View>
        ) : (
          clinicians.map((clinician) => (
            <View key={clinician.id} style={styles.card}>
              <View style={styles.cardAccent} />
              <View style={styles.avatarBox}>
                <Ionicons name="person-circle" size={40} color="#3E82D7" />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{clinician.name || 'Unknown'}</Text>
                <Text style={styles.meta}>{clinician.email || '—'}</Text>
                <Text style={styles.phone}>{clinician.mobile_number}</Text>
              </View>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>Clinician</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 32 },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E3EEF9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitleBlock: { flex: 1 },
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#1A1A1A' },
  pageSubtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  statsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3EEF9',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    gap: 8,
  },
  statBadgeIcon: {},
  statsBadgeText: { fontSize: 13, fontWeight: '700', color: '#3E82D7' },
  loader: { marginTop: 60 },
  emptyState: { alignItems: 'center', marginTop: 60, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#555' },
  emptySubtitle: { fontSize: 13, color: '#888', textAlign: 'center' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  cardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#3E82D7',
  },
  avatarBox: { marginLeft: 10, marginRight: 14 },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 2 },
  meta: { fontSize: 12, color: '#888', marginBottom: 2 },
  phone: { fontSize: 12, color: '#3E82D7', fontWeight: '600' },
  roleBadge: {
    backgroundColor: '#E3EEF9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleText: { fontSize: 11, fontWeight: '700', color: '#3E82D7' },
});

export default ClinicianManagementScreen;
