/**
 * OnboardScreen — Functional onboarding dashboard with live stats,
 * recent activity, and quick-action cards for Clinic / Clinician Admin / Clinician.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../common/components/Header';
import { getClinics, getUsers, Clinic, User } from '../common/services/clinicService';

const { width } = Dimensions.get('window');

// ── Types ──────────────────────────────────────────────────────────────────

interface OnboardOption {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
  route: string;
  countKey: 'clinics' | 'clinicianAdmins' | 'clinicians';
}

interface DashboardCounts {
  clinics: number;
  clinicianAdmins: number;
  clinicians: number;
  pendingClinics: number;
  approvedClinics: number;
}

interface RecentItem {
  id: number;
  name: string;
  type: 'clinic' | 'clinician_admin' | 'clinician';
  detail: string;
  date: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}

// ── Data ───────────────────────────────────────────────────────────────────

const onboardOptions: OnboardOption[] = [
  {
    id: 'clinic',
    title: 'Clinic',
    description: 'Register and manage clinic facilities',
    icon: 'business-outline',
    color: '#6D2ACE',
    bgColor: '#EDE5FF',
    route: 'ClinicManagement',
    countKey: 'clinics',
  },
  {
    id: 'clinician-admin',
    title: 'Clinician Admin',
    description: 'Setup administrative staff for clinicians',
    icon: 'person-circle-outline',
    color: '#34C759',
    bgColor: '#E8F8F0',
    route: 'ClinicianAdminManagement',
    countKey: 'clinicianAdmins',
  },
  {
    id: 'clinician',
    title: 'Clinician',
    description: 'Add medical professionals to the system',
    icon: 'medkit-outline',
    color: '#3E82D7',
    bgColor: '#E3EEF9',
    route: 'ClinicianManagement',
    countKey: 'clinicians',
  },
];

// ── Component ──────────────────────────────────────────────────────────────

const OnboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [counts, setCounts] = useState<DashboardCounts>({
    clinics: 0,
    clinicianAdmins: 0,
    clinicians: 0,
    pendingClinics: 0,
    approvedClinics: 0,
  });
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ── Data Fetching ──────────────────────────────────────────────────────

  const loadDashboard = useCallback(async () => {
    try {
      setError(null);
      const [clinicsData, usersData] = await Promise.all([
        getClinics(),
        getUsers(),
      ]);

      // Compute counts
      const clinicianAdmins = usersData.filter(
        (u: User) => u.role === 'clinician_admin',
      );
      const clinicians = usersData.filter(
        (u: User) => u.role === 'clinician',
      );

      setCounts({
        clinics: clinicsData.length,
        clinicianAdmins: clinicianAdmins.length,
        clinicians: clinicians.length,
        pendingClinics: clinicsData.filter(
          (c: Clinic) => c.status === 'pending',
        ).length,
        approvedClinics: clinicsData.filter(
          (c: Clinic) => c.status === 'approved',
        ).length,
      });

      // Build recent-items list (latest 5 across all types)
      const items: RecentItem[] = [];

      clinicsData.forEach((c: Clinic) => {
        items.push({
          id: c.id,
          name: c.name,
          type: 'clinic',
          detail: `${c.clinic_type} · ${c.city || c.state}`,
          date: c.created_at,
          color: '#6D2ACE',
          icon: 'business-outline',
        });
      });

      clinicianAdmins.forEach((u: User) => {
        items.push({
          id: u.id + 1000, // offset to avoid id collision
          name: u.name || u.mobile_number,
          type: 'clinician_admin',
          detail: u.email || u.mobile_number,
          date: '', // users don't have created_at in current model
          color: '#34C759',
          icon: 'person-circle-outline',
        });
      });

      clinicians.forEach((u: User) => {
        items.push({
          id: u.id + 2000,
          name: u.name || u.mobile_number,
          type: 'clinician',
          detail: u.email || u.mobile_number,
          date: '',
          color: '#3E82D7',
          icon: 'medkit-outline',
        });
      });

      // Sort by date descending (clinics first since they have dates)
      items.sort(
        (a, b) =>
          new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime(),
      );

      setRecentItems(items.slice(0, 5));
    } catch (err: any) {
      console.error('Failed to load onboard dashboard:', err);
      setError(err?.message || 'Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadDashboard();
    }, [loadDashboard]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  // ── Helpers ────────────────────────────────────────────────────────────

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'clinic':
        return 'Clinic';
      case 'clinician_admin':
        return 'Admin';
      case 'clinician':
        return 'Clinician';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#22C55E';
      case 'pending':
        return '#FF9500';
      case 'rejected':
        return '#EF4444';
      default:
        return '#999';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'approved':
        return '#DCFCE7';
      case 'pending':
        return '#FFF4E6';
      case 'rejected':
        return '#FEE2E2';
      default:
        return '#F3F4F6';
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────

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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6D2ACE']}
            tintColor="#6D2ACE"
          />
        }
      >
        {/* ─── Title ──────────────────────────────────────────────── */}
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Onboarding</Text>
          <Text style={styles.pageSubtitle}>
            Manage clinics, admins, and clinicians from one place
          </Text>
        </View>

        {/* ─── Summary Stats Row ──────────────────────────────────── */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryBox, { backgroundColor: '#EDE5FF' }]}>
            <Ionicons name="business" size={20} color="#6D2ACE" />
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#6D2ACE"
                style={{ marginTop: 6 }}
              />
            ) : (
              <Text style={[styles.summaryNumber, { color: '#6D2ACE' }]}>
                {counts.clinics}
              </Text>
            )}
            <Text style={styles.summaryLabel}>Clinics</Text>
          </View>

          <View style={[styles.summaryBox, { backgroundColor: '#E8F8F0' }]}>
            <Ionicons name="people" size={20} color="#34C759" />
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#34C759"
                style={{ marginTop: 6 }}
              />
            ) : (
              <Text style={[styles.summaryNumber, { color: '#34C759' }]}>
                {counts.clinicianAdmins}
              </Text>
            )}
            <Text style={styles.summaryLabel}>Admins</Text>
          </View>

          <View style={[styles.summaryBox, { backgroundColor: '#E3EEF9' }]}>
            <Ionicons name="medkit" size={20} color="#3E82D7" />
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#3E82D7"
                style={{ marginTop: 6 }}
              />
            ) : (
              <Text style={[styles.summaryNumber, { color: '#3E82D7' }]}>
                {counts.clinicians}
              </Text>
            )}
            <Text style={styles.summaryLabel}>Clinicians</Text>
          </View>

          <View style={[styles.summaryBox, { backgroundColor: '#FFF4E6' }]}>
            <Ionicons name="time" size={20} color="#FF9500" />
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#FF9500"
                style={{ marginTop: 6 }}
              />
            ) : (
              <Text style={[styles.summaryNumber, { color: '#FF9500' }]}>
                {counts.pendingClinics}
              </Text>
            )}
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
        </View>

        {/* ─── Error Banner ───────────────────────────────────────── */}
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={onRefresh}>
              <Ionicons name="refresh" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}

        {/* ─── Onboard Options Cards ─────────────────────────────── */}
        <Text style={styles.sectionTitle}>Onboard New</Text>
        <View style={styles.optionsContainer}>
          {onboardOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(option.route)}
            >
              <View style={[styles.cardAccent, { backgroundColor: option.color }]} />

              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: option.bgColor },
                ]}
              >
                <Ionicons name={option.icon} size={36} color={option.color} />
              </View>

              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>
              </View>

              <View style={styles.countBadge}>
                {loading ? (
                  <ActivityIndicator size="small" color={option.color} />
                ) : (
                  <Text style={[styles.countText, { color: option.color }]}>
                    {counts[option.countKey]}
                  </Text>
                )}
              </View>

              <View
                style={[
                  styles.arrowContainer,
                  { backgroundColor: option.bgColor },
                ]}
              >
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={option.color}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── Recently Onboarded ─────────────────────────────────── */}
        {!loading && recentItems.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recently Onboarded</Text>

            {recentItems.map((item, index) => (
              <View key={`${item.type}-${item.id}`} style={styles.recentCard}>
                <View
                  style={[
                    styles.recentAccent,
                    { backgroundColor: item.color },
                  ]}
                />
                <View
                  style={[
                    styles.recentIconBox,
                    { backgroundColor: item.color + '18' },
                  ]}
                >
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.recentDetail} numberOfLines={1}>
                    {item.detail}
                  </Text>
                </View>
                <View
                  style={[
                    styles.typeBadge,
                    { backgroundColor: item.color + '18' },
                  ]}
                >
                  <Text style={[styles.typeText, { color: item.color }]}>
                    {getTypeLabel(item.type)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ─── Info Card ──────────────────────────────────────────── */}
        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#6D2ACE"
          />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Super Admin Access</Text>
            <Text style={styles.infoText}>
              You have full access to onboard and manage all entities in the
              system. Pull down to refresh the data.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────

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

  /* Header */
  headerSection: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },

  /* Summary Stats */
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  summaryBox: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
  },
  summaryNumber: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },

  /* Error */
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 10,
    gap: 10,
    marginBottom: 20,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#991B1B',
    fontWeight: '500',
  },

  /* Section title */
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 14,
  },

  /* Option Cards */
  optionsContainer: {
    gap: 12,
    marginBottom: 28,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  cardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  optionContent: {
    flex: 1,
    marginRight: 8,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  optionDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  countBadge: {
    marginRight: 10,
    minWidth: 28,
    alignItems: 'center',
  },
  countText: {
    fontSize: 20,
    fontWeight: '800',
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Recent Section */
  recentSection: {
    marginBottom: 24,
  },
  recentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  recentAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  recentIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 12,
  },
  recentInfo: {
    flex: 1,
    marginRight: 8,
  },
  recentName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  recentDetail: {
    fontSize: 12,
    color: '#888',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  /* Info Card */
  infoCard: {
    backgroundColor: '#EDE5FF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#6D2ACE',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
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
    lineHeight: 20,
  },
});

export default OnboardScreen;
