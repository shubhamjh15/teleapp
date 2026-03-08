/**
 * Clinician Admin Management — List and manage clinician admins
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

const ClinicianAdminManagementScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAdmins = useCallback(async () => {
    try {
      const users = await getUsers();
      setAdmins(users.filter((u: User) => u.role === 'clinician_admin'));
    } catch (err) {
      console.error('Failed to load clinician admins:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAdmins();
    }, [loadAdmins])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadAdmins();
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6D2ACE']} />}
      >
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#6D2ACE" />
          </TouchableOpacity>
          <View style={styles.pageTitleBlock}>
            <Text style={styles.pageTitle}>Clinician Admins</Text>
            <Text style={styles.pageSubtitle}>Administrative staff for clinicians</Text>
          </View>
        </View>

        {/* Stats Badge */}
        <View style={styles.statsBadge}>
          <View style={styles.statBadgeIcon}>
            <Ionicons name="people" size={18} color="#6D2ACE" />
          </View>
          <Text style={styles.statsBadgeText}>
            {loading ? '...' : `${admins.length} Clinician Admin${admins.length !== 1 ? 's' : ''}`}
          </Text>
        </View>

        {/* List */}
        {loading ? (
          <ActivityIndicator size="large" color="#6D2ACE" style={styles.loader} />
        ) : admins.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="person-circle-outline" size={64} color="#D0B8F0" />
            <Text style={styles.emptyTitle}>No Clinician Admins</Text>
            <Text style={styles.emptySubtitle}>No clinician admins have been added yet.</Text>
          </View>
        ) : (
          admins.map((admin) => (
            <View key={admin.id} style={styles.card}>
              <View style={styles.cardAccent} />
              <View style={styles.avatarBox}>
                <Ionicons name="person-circle" size={40} color="#6D2ACE" />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{admin.name || 'Unknown'}</Text>
                <Text style={styles.meta}>{admin.email || '—'}</Text>
                <Text style={styles.phone}>{admin.mobile_number}</Text>
              </View>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>Admin</Text>
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
    backgroundColor: '#EDE5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitleBlock: { flex: 1 },
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#1A1A1A' },
  pageSubtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  statsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE5FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    gap: 8,
  },
  statBadgeIcon: {},
  statsBadgeText: { fontSize: 13, fontWeight: '700', color: '#6D2ACE' },
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
    backgroundColor: '#6D2ACE',
  },
  avatarBox: { marginLeft: 10, marginRight: 14 },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 2 },
  meta: { fontSize: 12, color: '#888', marginBottom: 2 },
  phone: { fontSize: 12, color: '#6D2ACE', fontWeight: '600' },
  roleBadge: {
    backgroundColor: '#EDE5FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleText: { fontSize: 11, fontWeight: '700', color: '#6D2ACE' },
});

export default ClinicianAdminManagementScreen;
