import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClinicianMainStackParamList } from '../navigation/types';
import { ClinicianSidebar, ClinicianRoute } from '../components/clinician/ClinicianSidebar';

type NavigationProp = NativeStackNavigationProp<ClinicianMainStackParamList, 'ClinicianReports'>;

// ─── DUMMY DATA ────────────────────────────────────────────────────────────────

const CLIENT_DATA = [
  { name: 'Rajesh Kumar',  initials: 'RK', bg: '#BFDBFE', age: 45, gender: 'Male',   visits: 8,  lastVisit: '28 Feb 2026', condition: 'Arthritis',    status: 'Active'   },
  { name: 'Priya Sharma',  initials: 'PS', bg: '#BBF7D0', age: 32, gender: 'Female', visits: 3,  lastVisit: '26 Feb 2026', condition: 'Knee Surgery', status: 'Active'   },
  { name: 'Amit Patel',    initials: 'AP', bg: '#FED7AA', age: 58, gender: 'Male',   visits: 12, lastVisit: '25 Feb 2026', condition: 'Osteoporosis', status: 'Active'   },
  { name: 'Sneha Reddy',   initials: 'SR', bg: '#FBCFE8', age: 27, gender: 'Female', visits: 2,  lastVisit: '22 Feb 2026', condition: 'Fracture',     status: 'Inactive' },
  { name: 'Vikram Singh',  initials: 'VS', bg: '#E9D5FF', age: 63, gender: 'Male',   visits: 6,  lastVisit: '18 Feb 2026', condition: 'Spine Issue',  status: 'Active'   },
];

const APPT_DATA = [
  { date: '03 Mar 2026', time: '09:00 AM', patient: 'Rajesh Kumar',  initials: 'RK', bg: '#BFDBFE', type: 'Follow-up',     status: 'Completed',   mode: 'In-Clinic', duration: '30 min' },
  { date: '03 Mar 2026', time: '10:30 AM', patient: 'Priya Sharma',  initials: 'PS', bg: '#BBF7D0', type: 'Review',         status: 'Completed',   mode: 'Video',     duration: '20 min' },
  { date: '03 Mar 2026', time: '12:00 PM', patient: 'Amit Patel',    initials: 'AP', bg: '#FED7AA', type: 'Consultation',   status: 'In Progress', mode: 'In-Clinic', duration: '45 min' },
  { date: '03 Mar 2026', time: '02:30 PM', patient: 'Sneha Reddy',   initials: 'SR', bg: '#FBCFE8', type: 'Post-op Check',  status: 'Upcoming',    mode: 'Audio',     duration: '15 min' },
  { date: '03 Mar 2026', time: '04:00 PM', patient: 'Vikram Singh',  initials: 'VS', bg: '#E9D5FF', type: 'Report Review',  status: 'Upcoming',    mode: 'In-Clinic', duration: '30 min' },
];

const FINANCE_SUMMARY = [
  { label: 'Today',   amount: '₹4,500',  raw: 4500,   appts: 3,   growth: '+12%', up: true  },
  { label: 'WTD',     amount: '₹12,000', raw: 12000,  appts: 9,   growth: '+8%',  up: true  },
  { label: 'MTD',     amount: '₹45,000', raw: 45000,  appts: 31,  growth: '+5%',  up: true  },
  { label: 'YTD',     amount: '₹2.1L',   raw: 210000, appts: 142, growth: '-2%',  up: false },
  { label: 'Total',   amount: '₹5.5L',   raw: 550000, appts: 312, growth: '+18%', up: true  },
];

const PAYMENT_BREAKDOWN = [
  { mode: 'In-Clinic', icon: 'business' as const,    color: '#5B2C6F', bg: '#F3E8FF', pct: 55, amount: '₹3,02,500' },
  { mode: 'Video',     icon: 'videocam' as const,     color: '#1D4ED8', bg: '#DBEAFE', pct: 30, amount: '₹1,65,000' },
  { mode: 'Audio',     icon: 'headset' as const,      color: '#15803D', bg: '#DCFCE7', pct: 15, amount: '₹82,500'   },
];

const RATING_DATA = [
  { patient: 'Rajesh Kumar',  initials: 'RK', bg: '#BFDBFE', rating: 5, comment: 'Excellent doctor, very attentive and thorough in his examination.',  date: '28 Feb 2026', tag: 'Attentive' },
  { patient: 'Priya Sharma',  initials: 'PS', bg: '#BBF7D0', rating: 5, comment: 'Great experience overall. Highly recommend to anyone needing ortho care.', date: '26 Feb 2026', tag: 'Highly Rated' },
  { patient: 'Amit Patel',    initials: 'AP', bg: '#FED7AA', rating: 4, comment: 'Very professional and knowledgeable. Explained everything clearly.',   date: '22 Feb 2026', tag: 'Professional' },
  { patient: 'Sneha Reddy',   initials: 'SR', bg: '#FBCFE8', rating: 4, comment: 'Kind and thorough in explanations. Made me feel comfortable.',         date: '18 Feb 2026', tag: 'Caring' },
  { patient: 'Vikram Singh',  initials: 'VS', bg: '#E9D5FF', rating: 5, comment: 'Best ortho consultation I have ever had. Will definitely return.',      date: '15 Feb 2026', tag: 'Top Review' },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const statusStyle = (s: string) => {
  if (s === 'Completed')   return { bg: '#DCFCE7', text: '#15803D' };
  if (s === 'In Progress') return { bg: '#DBEAFE', text: '#1D4ED8' };
  if (s === 'Active')      return { bg: '#DCFCE7', text: '#15803D' };
  if (s === 'Inactive')    return { bg: '#F3F4F6', text: '#6B7280' };
  return { bg: '#FEF3C7', text: '#92400E' };
};

const modeIcon = (m: string): React.ComponentProps<typeof Ionicons>['name'] => {
  if (m === 'Video')     return 'videocam-outline';
  if (m === 'Audio')     return 'headset-outline';
  return 'business-outline';
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────

type Tab = 'Client' | 'Appointment' | 'Finance' | 'Rating';

const TABS: { id: Tab; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { id: 'Client',      label: 'Clients',      icon: 'people-outline'    },
  { id: 'Appointment', label: 'Appointments', icon: 'calendar-outline'  },
  { id: 'Finance',     label: 'Finance',      icon: 'bar-chart-outline' },
  { id: 'Rating',      label: 'Ratings',      icon: 'star-outline'      },
];

const ClinicianReportsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('Client');

  const handleNavigate = (route: ClinicianRoute) => {
    setDrawerOpen(false);
    navigation.navigate(route as any);
  };

  // ── Tab renders ─────────────────────────────────────────────────────────────

  const renderClientTab = () => (
    <View style={styles.section}>
      {/* Summary chips */}
      <View style={styles.chipRow}>
        <View style={[styles.chip, { backgroundColor: '#F0FDF4' }]}>
          <Text style={[styles.chipVal, { color: '#15803D' }]}>{CLIENT_DATA.filter(c => c.status === 'Active').length}</Text>
          <Text style={styles.chipLbl}>Active</Text>
        </View>
        <View style={[styles.chip, { backgroundColor: '#F8FAFC' }]}>
          <Text style={[styles.chipVal, { color: '#6B7280' }]}>{CLIENT_DATA.filter(c => c.status === 'Inactive').length}</Text>
          <Text style={styles.chipLbl}>Inactive</Text>
        </View>
        <View style={[styles.chip, { backgroundColor: '#F5F3FF' }]}>
          <Text style={[styles.chipVal, { color: '#5B2C6F' }]}>{CLIENT_DATA.reduce((a, c) => a + c.visits, 0)}</Text>
          <Text style={styles.chipLbl}>Total Visits</Text>
        </View>
      </View>

      {/* Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.th, { flex: 2.5 }]}>Patient</Text>
        <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>Visits</Text>
        <Text style={[styles.th, { flex: 1.5, textAlign: 'right' }]}>Status</Text>
      </View>

      {CLIENT_DATA.map((c, i) => {
        const sc = statusStyle(c.status);
        return (
          <View key={i} style={[styles.row, i === CLIENT_DATA.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={styles.avatar(c.bg)}><Text style={styles.avText}>{c.initials}</Text></View>
            <View style={{ flex: 2.5, marginLeft: 10 }}>
              <Text style={styles.rowTitle}>{c.name}</Text>
              <Text style={styles.rowSub}>{c.condition} · {c.gender}, {c.age} yrs</Text>
              <Text style={styles.rowSub2}>{c.lastVisit}</Text>
            </View>
            <Text style={[styles.rowTitle, { flex: 1, textAlign: 'center', color: '#5B2C6F' }]}>{c.visits}</Text>
            <View style={[styles.badge, { flex: 1.2, backgroundColor: sc.bg, alignItems: 'flex-end' }]}>
              <Text style={[styles.badgeText, { color: sc.text }]}>{c.status}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderAppointmentTab = () => (
    <View style={styles.section}>
      {/* Summary chips */}
      <View style={styles.chipRow}>
        <View style={[styles.chip, { backgroundColor: '#DCFCE7' }]}>
          <Text style={[styles.chipVal, { color: '#15803D' }]}>{APPT_DATA.filter(a => a.status === 'Completed').length}</Text>
          <Text style={styles.chipLbl}>Done</Text>
        </View>
        <View style={[styles.chip, { backgroundColor: '#DBEAFE' }]}>
          <Text style={[styles.chipVal, { color: '#1D4ED8' }]}>{APPT_DATA.filter(a => a.status === 'In Progress').length}</Text>
          <Text style={styles.chipLbl}>Live</Text>
        </View>
        <View style={[styles.chip, { backgroundColor: '#FEF3C7' }]}>
          <Text style={[styles.chipVal, { color: '#92400E' }]}>{APPT_DATA.filter(a => a.status === 'Upcoming').length}</Text>
          <Text style={styles.chipLbl}>Upcoming</Text>
        </View>
      </View>

      {APPT_DATA.map((a, i) => {
        const sc = statusStyle(a.status);
        return (
          <View key={i} style={[styles.apptCard, i === APPT_DATA.length - 1 && { marginBottom: 0 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
              <View style={styles.avatar(a.bg)}><Text style={styles.avText}>{a.initials}</Text></View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.rowTitle}>{a.patient}</Text>
                  <View style={[{ backgroundColor: sc.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }]}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: sc.text }}>{a.status}</Text>
                  </View>
                </View>
                <Text style={styles.rowSub}>{a.type}</Text>
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 6, alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="time-outline" size={12} color="#6B7280" />
                    <Text style={styles.rowSub2}>{a.time} · {a.duration}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name={modeIcon(a.mode)} size={12} color="#6B7280" />
                    <Text style={styles.rowSub2}>{a.mode}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderFinanceTab = () => (
    <View style={styles.section}>
      {/* Period breakdown */}
      <Text style={styles.sectionLabel}>Period Breakdown</Text>
      {FINANCE_SUMMARY.map((f, i) => (
        <View key={i} style={[styles.row, i === FINANCE_SUMMARY.length - 1 && { borderBottomWidth: 0 }]}>
          <View style={{ flex: 1.5 }}>
            <Text style={styles.rowTitle}>{f.label}</Text>
            <Text style={styles.rowSub}>{f.appts} appointments</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.rowTitle, { color: '#74AF2E' }]}>{f.amount}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <Ionicons name={f.up ? 'trending-up' : 'trending-down'} size={12} color={f.up ? '#15803D' : '#DC2626'} />
              <Text style={{ fontSize: 11, color: f.up ? '#15803D' : '#DC2626', fontWeight: '600' }}>{f.growth}</Text>
            </View>
          </View>
        </View>
      ))}

      {/* Payment mode breakdown */}
      <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Revenue by Mode</Text>
      {PAYMENT_BREAKDOWN.map((p, i) => (
        <View key={i} style={{ marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: p.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={p.icon} size={14} color={p.color} />
              </View>
              <Text style={styles.rowTitle}>{p.mode}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.rowTitle}>{p.amount}</Text>
              <Text style={[styles.rowSub2, { color: p.color }]}>{p.pct}%</Text>
            </View>
          </View>
          {/* Bar */}
          <View style={{ height: 6, backgroundColor: '#F1F5F9', borderRadius: 4 }}>
            <View style={{ height: 6, width: `${p.pct}%`, backgroundColor: p.color, borderRadius: 4, opacity: 0.8 }} />
          </View>
        </View>
      ))}
    </View>
  );

  const renderRatingTab = () => {
    const avg = (RATING_DATA.reduce((a, r) => a + r.rating, 0) / RATING_DATA.length).toFixed(1);
    const dist = [5, 4, 3, 2, 1].map(s => ({ star: s, count: RATING_DATA.filter(r => r.rating === s).length }));

    return (
      <View style={styles.section}>
        {/* Summary */}
        <View style={styles.ratingSummary}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.bigRating}>{avg}</Text>
            <View style={{ flexDirection: 'row', gap: 2, marginVertical: 4 }}>
              {[1,2,3,4,5].map(s => <Text key={s} style={{ color: '#F59E0B', fontSize: 18 }}>★</Text>)}
            </View>
            <Text style={styles.rowSub}>{RATING_DATA.length} reviews</Text>
          </View>
          <View style={{ flex: 1, paddingLeft: 20 }}>
            {dist.map(d => (
              <View key={d.star} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                <Text style={{ fontSize: 11, color: '#6B7280', width: 12 }}>{d.star}</Text>
                <Text style={{ color: '#F59E0B', fontSize: 11 }}>★</Text>
                <View style={{ flex: 1, height: 6, backgroundColor: '#F1F5F9', borderRadius: 4 }}>
                  <View style={{ height: 6, width: `${(d.count / RATING_DATA.length) * 100}%`, backgroundColor: '#F59E0B', borderRadius: 4 }} />
                </View>
                <Text style={{ fontSize: 11, color: '#6B7280', width: 14 }}>{d.count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews */}
        {RATING_DATA.map((r, i) => (
          <View key={i} style={styles.reviewCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <View style={styles.avatar(r.bg)}><Text style={styles.avText}>{r.initials}</Text></View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.rowTitle}>{r.patient}</Text>
                  <View style={{ flexDirection: 'row', gap: 2 }}>
                    {[...Array(r.rating)].map((_, s) => <Text key={s} style={{ color: '#F59E0B', fontSize: 13 }}>★</Text>)}
                    {[...Array(5 - r.rating)].map((_, s) => <Text key={s} style={{ color: '#E5E7EB', fontSize: 13 }}>★</Text>)}
                  </View>
                </View>
                <Text style={styles.rowSub2}>{r.date}</Text>
              </View>
            </View>
            <Text style={styles.reviewText}>"{r.comment}"</Text>
            <View style={styles.reviewTag}>
              <Text style={styles.reviewTagText}>{r.tag}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Client':      return renderClientTab();
      case 'Appointment': return renderAppointmentTab();
      case 'Finance':     return renderFinanceTab();
      case 'Rating':      return renderRatingTab();
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* ── HEADER ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setDrawerOpen(true)}>
          <Ionicons name="menu" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Reports</Text>
        <View style={{ flex: 1 }} />
        <View style={styles.exportBtn}>
          <Ionicons name="download-outline" size={16} color="#5B2C6F" />
          <Text style={styles.exportText}>Export</Text>
        </View>
      </View>

      {/* ── TABS ── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar} contentContainerStyle={styles.tabBarContent}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.id}
            style={[styles.tab, activeTab === t.id && styles.tabActive]}
            onPress={() => setActiveTab(t.id)}
            activeOpacity={0.8}
          >
            <Ionicons name={t.icon} size={15} color={activeTab === t.id ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === t.id && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── BODY ── */}
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {renderContent()}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      <ClinicianSidebar
        visible={drawerOpen}
        activeRoute="ClinicianReports"
        onNavigate={handleNavigate}
        onClose={() => setDrawerOpen(false)}
      />
    </SafeAreaView>
  );
};

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },

  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  menuBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center', justifyContent: 'center',
  },
  topBarTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  exportBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 10, borderWidth: 1, borderColor: '#E9D5FF',
    backgroundColor: '#F5F3FF',
  },
  exportText: { fontSize: 13, fontWeight: '600', color: '#5B2C6F' },

  tabBar: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', maxHeight: 56 },
  tabBarContent: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  tab: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 22,
    backgroundColor: '#F1F5F9',
  },
  tabActive: { backgroundColor: '#5B2C6F' },
  tabText:   { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#FFFFFF' },

  body: { flex: 1, paddingHorizontal: 14, paddingTop: 14 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16,
    borderWidth: 1, borderColor: '#F1F5F9',
    padding: 16,
  },
  section: { gap: 0 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 },

  // Summary chips
  chipRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  chip: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12 },
  chipVal: { fontSize: 20, fontWeight: '800', color: '#111827' },
  chipLbl: { fontSize: 11, color: '#6B7280', marginTop: 2, fontWeight: '500' },

  // Table
  tableHeader: {
    flexDirection: 'row', paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 2,
  },
  th: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.6 },

  // Row
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F9FAFB',
  },
  rowTitle: { fontSize: 14, fontWeight: '600', color: '#111827' },
  rowSub:   { fontSize: 12, color: '#6B7280', marginTop: 2 },
  rowSub2:  { fontSize: 11, color: '#9CA3AF', marginTop: 1 },

  // Avatar
  avatar: (bg: string) => ({
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: bg, alignItems: 'center' as const, justifyContent: 'center' as const,
    flexShrink: 0,
  }),
  avText: { fontSize: 13, fontWeight: '700', color: '#374151' },

  // Badge
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'center' },
  badgeText: { fontSize: 10, fontWeight: '700' },

  // Appointment card
  apptCard: {
    backgroundColor: '#F9FAFB', borderRadius: 12,
    padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#F1F5F9',
  },

  // Rating
  ratingSummary: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFBEB', borderRadius: 14, padding: 16,
    marginBottom: 16,
  },
  bigRating: { fontSize: 44, fontWeight: '900', color: '#111827', lineHeight: 50 },
  reviewCard: {
    backgroundColor: '#F9FAFB', borderRadius: 12,
    padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  reviewText: { fontSize: 13, color: '#374151', lineHeight: 20, fontStyle: 'italic' },
  reviewTag: {
    alignSelf: 'flex-start', marginTop: 10,
    backgroundColor: '#F0FDF4', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  reviewTagText: { fontSize: 11, fontWeight: '700', color: '#15803D' },
});

export default ClinicianReportsScreen;
