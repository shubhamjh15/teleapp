/**
 * Clinician Dashboard Screen — Clean & Simple
 *
 * Features:
 * - Time-based greeting header
 * - 4 stat cards in 2×2 grid
 * - Today's schedule with status badges
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useClinicianAuthStore } from '../context/ClinicianAuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClinicianMainStackParamList } from '../navigation/types';
import { ClinicianSidebar, ClinicianRoute } from '../components/clinician/ClinicianSidebar';

const { width: W } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<ClinicianMainStackParamList, 'ClinicianDashboard'>;
};

/* ─── DATA ──────────────────────────────────────────── */

const SCHEDULE = [
  { time: '09:00 AM', patient: 'Rajesh Kumar',   type: 'Follow-up',          status: 'completed'   as const, initials: 'RK', bg: '#BFDBFE' },
  { time: '10:30 AM', patient: 'Priya Sharma',   type: 'Arthroscopy Review', status: 'completed'   as const, initials: 'PS', bg: '#BBF7D0' },
  { time: '12:00 PM', patient: 'Amit Patel',     type: 'New Consultation',   status: 'in_progress' as const, initials: 'AP', bg: '#FED7AA' },
  { time: '02:30 PM', patient: 'Sneha Reddy',    type: 'Post-op Check',      status: 'upcoming'    as const, initials: 'SR', bg: '#FBCFE8' },
  { time: '04:00 PM', patient: 'Vikram Singh',   type: 'Report Review',      status: 'upcoming'    as const, initials: 'VS', bg: '#E9D5FF' },
];

const STATUS_CONFIG = {
  completed:   { label: 'Completed',   color: '#15803D', bg: '#DCFCE7' },
  in_progress: { label: 'In Progress', color: '#1D4ED8', bg: '#DBEAFE' },
  upcoming:    { label: 'Upcoming',    color: '#92400E', bg: '#FEF3C7' },
};

/* ─── HELPERS ───────────────────────────────────────── */

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getFormattedDate(): string {
  const d = new Date();
  const opts: Intl.DateTimeFormatOptions = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  };
  return d.toLocaleDateString('en-IN', opts);
}

/* ─── COMPONENT ─────────────────────────────────────── */

export const ClinicianDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { clinician } = useClinicianAuthStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [timeFilter, setTimeFilter] = useState<'Today' | 'Week' | 'Month'>('Today');
  const [financeFilter, setFinanceFilter] = useState<'Today' | 'WTD' | 'MTD' | 'YTD'>('Today');

  const getStats = () => {
    switch (timeFilter) {
      case 'Month': return { pending: 120, patients: 248, reports: 120, revenue: '₹1.2L' };
      case 'Week': return { pending: 35, patients: 248, reports: 40, revenue: '₹35K' };
      case 'Today':
      default: return { pending: 7, patients: 248, reports: 12, revenue: '₹4,500' };
    }
  };
  const stats = getStats();

  const doctorName    = clinician?.name || 'Dr. Esther Howard';
  const greeting      = useMemo(() => getGreeting(), []);
  const formattedDate = useMemo(() => getFormattedDate(), []);

  const handleNavigate = (route: ClinicianRoute) => {
    navigation.navigate(route as any);
  };

  const renderStatusBadge = (status: keyof typeof STATUS_CONFIG) => {
    const cfg = STATUS_CONFIG[status];
    return (
      <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
        <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* ── TOP HEADER ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setDrawerOpen(true)}>
          <Ionicons name="menu" size={22} color="#374151" />
        </TouchableOpacity>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={16} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients, reports..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('ClinicianSettings' as any)}>
          <Text style={styles.profileBtnText}>{doctorName.replace('Dr. ', '').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

      {/* ── BODY ── */}
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        {/* ── GREETING ── */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>{greeting}, {doctorName} 👋</Text>
          <Text style={styles.greetingDate}>{formattedDate}</Text>
        </View>

        {/* ── TIME FILTER ── */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          {['Today', 'Week', 'Month'].map(f => (
            <TouchableOpacity 
              key={f}
              onPress={() => setTimeFilter(f as any)}
              style={{
                paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
                backgroundColor: timeFilter === f ? '#5B2C6F' : '#E5E7EB'
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: timeFilter === f ? '#FFFFFF' : '#374151' }}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── 4 STAT CARDS (2×2 grid) ── */}
        <View style={styles.cardGrid}>
          {/* Row 1 */}
          <View style={styles.cardRow}>
            <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="time-outline" size={24} color="#D97706" />
              <Text style={styles.statValue}>{stats.pending < 10 ? `0${stats.pending}` : stats.pending}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: '#E8F5E0' }]}>
              <Ionicons name="people" size={24} color="#4A7C2F" />
              <Text style={styles.statValue}>{stats.patients}</Text>
              <Text style={styles.statLabel}>Patients</Text>
            </View>
          </View>

          {/* Row 2 */}
          <View style={styles.cardRow}>
            <View style={[styles.statCard, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="document-text" size={24} color="#2563EB" />
              <Text style={styles.statValue}>{stats.reports < 10 && stats.reports > 0 ? `0${stats.reports}` : stats.reports}</Text>
              <Text style={styles.statLabel}>Reports</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="cash" size={24} color="#16A34A" />
              <Text style={styles.statValue}>{stats.revenue}</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
          </View>
        </View>

        {/* ── FINANCE COLLECTION ── */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Finance Collections</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ClinicianPayments' as any)}>
              <Text style={{ fontSize: 13, color: '#4A7C2F', fontWeight: '600' }}>View Details</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Chips */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            {(['Today', 'WTD', 'MTD', 'YTD'] as const).map(f => (
              <TouchableOpacity
                key={f}
                onPress={() => setFinanceFilter(f)}
                style={{
                  paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
                  backgroundColor: financeFilter === f ? '#74AF2E' : '#F3F4F6',
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: financeFilter === f ? '#FFFFFF' : '#6B7280' }}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Value Display */}
          <View style={{ alignItems: 'center', paddingVertical: 12 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#111827', letterSpacing: -0.5 }}>
              {financeFilter === 'Today' ? '₹4,500' : financeFilter === 'WTD' ? '₹12K' : financeFilter === 'MTD' ? '₹45K' : '₹2.1L'}
            </Text>
            <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
              {financeFilter === 'Today' ? "Today's Collections" : financeFilter === 'WTD' ? 'Week to Date' : financeFilter === 'MTD' ? 'Month to Date' : 'Year to Date'}
            </Text>
          </View>
        </View>

        {/* ── RATING & REVIEWS ── */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Rating & Reviews</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#111827' }}>4.8</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#F8FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#F1F5F9' }}
            activeOpacity={0.7}
          >
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1D4ED8' }}>JD</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#111827' }}>"Very attentive and knowledgeable..."</Text>
              <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>John Doe · Top positive review</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* ── TODAY'S SCHEDULE ── */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Today's Schedule</Text>
            <View style={styles.scheduleBadge}>
              <Text style={styles.scheduleBadgeText}>{SCHEDULE.length} appointments</Text>
            </View>
          </View>
          {SCHEDULE.slice(0, 1).map((s, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.scheduleRow, SCHEDULE.length === 1 && i === SCHEDULE.length - 1 && styles.scheduleRowBorder]}
              onPress={() => navigation.navigate('ClinicianConsultation', { patientId: String(i), patientName: s.patient })}
              activeOpacity={0.7}
            >
              <Text style={[styles.scheduleTime, { color: '#000000' }]}>{s.time}</Text>
              <View style={[styles.scheduleAv, { backgroundColor: s.bg }]}>
                <Text style={styles.scheduleAvText}>{s.initials}</Text>
              </View>
              <View style={styles.scheduleInfo}>
                <Text style={styles.schedulePatient} numberOfLines={1}>{s.patient}</Text>
                <Text style={styles.scheduleType}>{s.type}</Text>
              </View>
              {renderStatusBadge(s.status)}
            </TouchableOpacity>
          ))}

          {SCHEDULE.length > 1 && (
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => navigation.navigate('ClinicianAppointments' as any)}
            >
              <Text style={styles.viewAllText}>View {SCHEDULE.length - 1} More</Text>
              <Ionicons name="arrow-forward" size={14} color="#5B2C6F" />
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── SIDEBAR DRAWER ── */}
      <ClinicianSidebar
        visible={drawerOpen}
        activeRoute="ClinicianDashboard"
        onNavigate={handleNavigate}
        onClose={() => setDrawerOpen(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },

  // header
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    gap: 8,
  },
  menuBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center', justifyContent: 'center',
  },
  searchWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFC', borderRadius: 10,
    paddingHorizontal: 10, height: 38,
    borderWidth: 1, borderColor: '#E5E7EB', gap: 6,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#111827' },
  profileBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#5B2C6F', alignItems: 'center', justifyContent: 'center',
  },
  profileBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },

  // body
  body: { flex: 1, paddingHorizontal: 14 },

  // greeting
  greetingSection: { paddingTop: 18, paddingBottom: 14 },
  greetingText: { fontSize: 22, fontWeight: '800', color: '#111827' },
  greetingDate: { fontSize: 13, color: '#6B7280', marginTop: 4 },

  // 2×2 card grid
  cardGrid: { gap: 12, marginBottom: 24 },
  cardRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: { fontSize: 12, color: '#666', fontWeight: '600' },

  // generic card
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 12,
    padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },

  // schedule
  scheduleBadge: {
    backgroundColor: '#E8F5E0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  scheduleBadgeText: { fontSize: 11, fontWeight: '600', color: '#4A7C2F' },
  scheduleRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10,
  },
  scheduleRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  scheduleTime: { fontSize: 11, fontWeight: '700', color: '#4A7C2F', width: 65 },
  scheduleAv: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  scheduleAvText: { fontSize: 11, fontWeight: '700', color: '#374151' },
  scheduleInfo: { flex: 1 },
  schedulePatient: { fontSize: 13, fontWeight: '600', color: '#111827' },
  scheduleType: { fontSize: 11, color: '#6B7280', marginTop: 1 },

  // status badge
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText:  { fontSize: 10, fontWeight: '700' },

  viewAllBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F3F4F6',
    marginTop: 4,
  },
  viewAllText: { fontSize: 13, fontWeight: '600', color: '#5B2C6F' },
});

export default ClinicianDashboardScreen;
