/**
 * Clinician Appointments Screen — Production Ready
 *
 * Full appointment management with tabs, filters, and status badges.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClinicianMainStackParamList } from '@/navigation/types';
import { ClinicianSidebar, ClinicianRoute } from '@/components/clinician/ClinicianSidebar';

type Props = {
  navigation: NativeStackNavigationProp<ClinicianMainStackParamList, 'ClinicianAppointments'>;
};

type AppointmentStatus = 'confirmed' | 'completed' | 'pending' | 'cancelled';

interface Appointment {
  id: string;
  patient: string;
  initials: string;
  avatarBg: string;
  time: string;
  date: string;
  type: string;
  status: AppointmentStatus;
  duration: string;
}

const STATUS_CFG: Record<AppointmentStatus, { label: string; color: string; bg: string; icon: string }> = {
  confirmed:  { label: 'Confirmed',  color: '#1D4ED8', bg: '#DBEAFE', icon: 'checkmark-circle' },
  completed:  { label: 'Completed',  color: '#15803D', bg: '#DCFCE7', icon: 'checkmark-done'   },
  pending:    { label: 'Pending',    color: '#92400E', bg: '#FEF3C7', icon: 'time'              },
  cancelled:  { label: 'Cancelled',  color: '#DC2626', bg: '#FEE2E2', icon: 'close-circle'     },
};

const TABS = ['Today', 'Upcoming', 'Past', 'Cancelled'] as const;

const APPOINTMENTS: Appointment[] = [
  { id: '1', patient: 'Rajesh Kumar',    initials: 'RK', avatarBg: '#BFDBFE', time: '09:00 AM', date: 'Today',       type: 'Follow-up',          status: 'completed', duration: '30 min' },
  { id: '2', patient: 'Priya Sharma',    initials: 'PS', avatarBg: '#BBF7D0', time: '10:30 AM', date: 'Today',       type: 'Arthroscopy Review', status: 'completed', duration: '45 min' },
  { id: '3', patient: 'Amit Patel',      initials: 'AP', avatarBg: '#FED7AA', time: '12:00 PM', date: 'Today',       type: 'New Consultation',   status: 'confirmed', duration: '30 min' },
  { id: '4', patient: 'Sneha Reddy',     initials: 'SR', avatarBg: '#FBCFE8', time: '02:30 PM', date: 'Today',       type: 'Post-op Check',      status: 'pending',   duration: '30 min' },
  { id: '5', patient: 'Vikram Singh',    initials: 'VS', avatarBg: '#E9D5FF', time: '04:00 PM', date: 'Today',       type: 'Report Review',      status: 'pending',   duration: '30 min' },
  { id: '6', patient: 'Ananya Gupta',    initials: 'AG', avatarBg: '#FEF08A', time: '09:30 AM', date: '26 Feb',      type: 'Follow-up',          status: 'confirmed', duration: '30 min' },
  { id: '7', patient: 'Karthik Menon',   initials: 'KM', avatarBg: '#A5F3FC', time: '11:00 AM', date: '26 Feb',      type: 'ACL Assessment',     status: 'confirmed', duration: '45 min' },
  { id: '8', patient: 'Deepa Iyer',      initials: 'DI', avatarBg: '#D9F99D', time: '02:00 PM', date: '27 Feb',      type: 'X-ray Review',       status: 'confirmed', duration: '30 min' },
  { id: '9', patient: 'Rohit Menon',     initials: 'RM', avatarBg: '#FED7AA', time: '10:00 AM', date: '22 Feb',      type: 'Consultation',       status: 'completed', duration: '30 min' },
  { id: '10', patient: 'Neha Kapoor',    initials: 'NK', avatarBg: '#FBCFE8', time: '03:00 PM', date: '20 Feb',      type: 'Post-op Check',      status: 'cancelled', duration: '30 min' },
];

export const ClinicianAppointmentsScreen: React.FC<Props> = ({ navigation }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('Today');
  const [searchText, setSearchText] = useState('');

  const handleNavigate = (route: ClinicianRoute) => {
    navigation.navigate(route as any);
  };

  const filtered = APPOINTMENTS.filter(a => {
    if (activeTab === 'Today')     return a.date === 'Today' && a.status !== 'cancelled';
    if (activeTab === 'Upcoming')  return a.date !== 'Today' && !['completed', 'cancelled'].includes(a.status);
    if (activeTab === 'Past')      return a.status === 'completed';
    if (activeTab === 'Cancelled') return a.status === 'cancelled';
    return true;
  }).filter(a => !searchText || a.patient.toLowerCase().includes(searchText.toLowerCase()));

  const todayCount    = APPOINTMENTS.filter(a => a.date === 'Today').length;
  const upcomingCount = APPOINTMENTS.filter(a => a.date !== 'Today' && !['completed', 'cancelled'].includes(a.status)).length;
  const pendingCount  = APPOINTMENTS.filter(a => a.status === 'pending').length;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setDrawerOpen(true)}>
          <Ionicons name="menu" size={22} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Appointments</Text>
        <View style={{ flex: 1 }} />
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.miniStat, { backgroundColor: '#F4ECF7' }]}>
            <Ionicons name="today" size={24} color="#5B2C6F" />
            <Text style={styles.miniStatVal}>{todayCount}</Text>
            <Text style={styles.miniStatLabel}>Today</Text>
          </View>
          <View style={[styles.miniStat, { backgroundColor: '#DBEAFE' }]}>
            <Ionicons name="calendar" size={24} color="#1D4ED8" />
            <Text style={styles.miniStatVal}>{upcomingCount}</Text>
            <Text style={styles.miniStatLabel}>Upcoming</Text>
          </View>
          <View style={[styles.miniStat, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="time" size={24} color="#92400E" />
            <Text style={styles.miniStatVal}>{pendingCount}</Text>
            <Text style={styles.miniStatLabel}>Pending</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={16} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by patient name..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Appointment Cards */}
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={40} color="#D1D5DB" />
            <Text style={styles.emptyText}>No appointments found</Text>
          </View>
        )}

        {filtered.map(appt => {
          const cfg = STATUS_CFG[appt.status];
          return (
            <TouchableOpacity
              key={appt.id}
              style={styles.apptCard}
              onPress={() => navigation.navigate('ClinicianConsultation', { patientId: appt.id, patientName: appt.patient })}
              activeOpacity={0.7}
            >
              <View style={styles.apptTop}>
                <View style={[styles.apptAvatar, { backgroundColor: appt.avatarBg }]}>
                  <Text style={styles.apptAvatarText}>{appt.initials}</Text>
                </View>
                <View style={styles.apptInfo}>
                  <Text style={styles.apptName}>{appt.patient}</Text>
                  <Text style={styles.apptType}>{appt.type}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                  <Ionicons name={cfg.icon as any} size={10} color={cfg.color} />
                  <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
                </View>
              </View>
              <View style={styles.apptBottom}>
                <View style={styles.apptDetailItem}>
                  <Ionicons name="calendar-outline" size={12} color="#6B7280" />
                  <Text style={styles.apptDetailText}>{appt.date}</Text>
                </View>
                <View style={styles.apptDetailItem}>
                  <Ionicons name="time-outline" size={12} color="#6B7280" />
                  <Text style={styles.apptDetailText}>{appt.time}</Text>
                </View>
                <View style={styles.apptDetailItem}>
                  <Ionicons name="hourglass-outline" size={12} color="#6B7280" />
                  <Text style={styles.apptDetailText}>{appt.duration}</Text>
                </View>
                <View style={{ flex: 1 }} />
                <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>

      <ClinicianSidebar
        visible={drawerOpen}
        activeRoute="ClinicianAppointments"
        onNavigate={handleNavigate}
        onClose={() => setDrawerOpen(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 10,
  },
  menuBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center',
  },
  topBarTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },

  body: { flex: 1, paddingHorizontal: 14 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 12, paddingVertical: 14 },
  miniStat: {
    flex: 1, borderRadius: 12, padding: 16, alignItems: 'center',
  },
  miniStatVal: {
    fontSize: 24, fontWeight: '700', color: '#1A1A1A',
    marginTop: 8, marginBottom: 4,
  },
  miniStatLabel: { fontSize: 12, color: '#666', fontWeight: '600', marginTop: 2 },

  // Search
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 12,
    paddingHorizontal: 12, height: 40, gap: 8,
    borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#111827' },

  // Tabs
  tabRow: { flexDirection: 'row', gap: 6, marginBottom: 14 },
  tab: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  tabActive: { backgroundColor: '#5B2C6F' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  // Empty
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },

  // Appointment Card
  apptCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  apptTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  apptAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  apptAvatarText: { fontSize: 14, fontWeight: '700', color: '#374151' },
  apptInfo: { flex: 1 },
  apptName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  apptType: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '700' },

  // Bottom details
  apptBottom: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6',
  },
  apptDetailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  apptDetailText: { fontSize: 11, color: '#6B7280', fontWeight: '500' },
});

export default ClinicianAppointmentsScreen;
