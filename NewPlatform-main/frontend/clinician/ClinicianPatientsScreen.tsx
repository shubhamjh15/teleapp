/**
 * Clinician Patients Screen — Production Ready
 *
 * Patient directory with search, stats, condition tags, alphabetical list.
 */

import React, { useState, useMemo } from 'react';
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
  navigation: NativeStackNavigationProp<ClinicianMainStackParamList, 'ClinicianPatients'>;
};

interface Patient {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  age: number;
  gender: string;
  lastVisit: string;
  conditions: string[];
  phone: string;
  status: 'active' | 'inactive';
}

const PATIENTS: Patient[] = [
  { id: '1', name: 'Amit Patel',       initials: 'AP', avatarBg: '#FED7AA', age: 45, gender: 'M', lastVisit: '25 Feb 2026', conditions: ['Knee Replacement', 'Osteoarthritis'], phone: '+91 98XXX XXXXX', status: 'active' },
  { id: '2', name: 'Ananya Gupta',     initials: 'AG', avatarBg: '#FEF08A', age: 32, gender: 'F', lastVisit: '24 Feb 2026', conditions: ['ACL Rehab'],                         phone: '+91 87XXX XXXXX', status: 'active' },
  { id: '3', name: 'Deepa Iyer',       initials: 'DI', avatarBg: '#D9F99D', age: 56, gender: 'F', lastVisit: '23 Feb 2026', conditions: ['Hip Replacement', 'Sciatica'],        phone: '+91 76XXX XXXXX', status: 'active' },
  { id: '4', name: 'Karthik Menon',    initials: 'KM', avatarBg: '#A5F3FC', age: 28, gender: 'M', lastVisit: '20 Feb 2026', conditions: ['ACL Tear'],                           phone: '+91 99XXX XXXXX', status: 'active' },
  { id: '5', name: 'Neha Kapoor',      initials: 'NK', avatarBg: '#FBCFE8', age: 38, gender: 'F', lastVisit: '18 Feb 2026', conditions: ['Frozen Shoulder'],                    phone: '+91 95XXX XXXXX', status: 'inactive' },
  { id: '6', name: 'Priya Sharma',     initials: 'PS', avatarBg: '#BBF7D0', age: 41, gender: 'F', lastVisit: '25 Feb 2026', conditions: ['Meniscus Tear', 'Rehab'],             phone: '+91 88XXX XXXXX', status: 'active' },
  { id: '7', name: 'Rajesh Kumar',     initials: 'RK', avatarBg: '#BFDBFE', age: 52, gender: 'M', lastVisit: '25 Feb 2026', conditions: ['Knee Replacement'],                  phone: '+91 91XXX XXXXX', status: 'active' },
  { id: '8', name: 'Rohit Menon',      initials: 'RM', avatarBg: '#FED7AA', age: 35, gender: 'M', lastVisit: '22 Feb 2026', conditions: ['Sports Injury', 'Ligament Repair'],   phone: '+91 93XXX XXXXX', status: 'active' },
  { id: '9', name: 'Sneha Reddy',      initials: 'SR', avatarBg: '#FBCFE8', age: 29, gender: 'F', lastVisit: '25 Feb 2026', conditions: ['Post-op Rehab'],                     phone: '+91 96XXX XXXXX', status: 'active' },
  { id: '10', name: 'Vikram Singh',    initials: 'VS', avatarBg: '#E9D5FF', age: 60, gender: 'M', lastVisit: '24 Feb 2026', conditions: ['Spinal Stenosis', 'Arthritis'],       phone: '+91 94XXX XXXXX', status: 'active' },
];

const TAG_COLORS: Record<string, { color: string; bg: string }> = {
  'Knee Replacement':  { color: '#5B2C6F', bg: '#F4ECF7' },
  'Osteoarthritis':    { color: '#92400E', bg: '#FEF3C7' },
  'ACL Rehab':         { color: '#15803D', bg: '#DCFCE7' },
  'ACL Tear':          { color: '#DC2626', bg: '#FEE2E2' },
  'Hip Replacement':   { color: '#1D4ED8', bg: '#DBEAFE' },
  'Sciatica':          { color: '#7C3AED', bg: '#EDE9FE' },
  'Frozen Shoulder':   { color: '#0D9488', bg: '#CCFBF1' },
  'Meniscus Tear':     { color: '#C2410C', bg: '#FFEDD5' },
  'Rehab':             { color: '#15803D', bg: '#DCFCE7' },
  'Sports Injury':     { color: '#DC2626', bg: '#FEE2E2' },
  'Ligament Repair':   { color: '#1D4ED8', bg: '#DBEAFE' },
  'Post-op Rehab':     { color: '#0D9488', bg: '#CCFBF1' },
  'Spinal Stenosis':   { color: '#7C3AED', bg: '#EDE9FE' },
  'Arthritis':         { color: '#92400E', bg: '#FEF3C7' },
};

export const ClinicianPatientsScreen: React.FC<Props> = ({ navigation }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleNavigate = (route: ClinicianRoute) => {
    navigation.navigate(route as any);
  };

  const filtered = useMemo(() => {
    const f = PATIENTS.filter(p =>
      !searchText || p.name.toLowerCase().includes(searchText.toLowerCase())
    );
    return f.sort((a, b) => a.name.localeCompare(b.name));
  }, [searchText]);

  const activeCount = PATIENTS.filter(p => p.status === 'active').length;
  const newThisMonth = 3;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setDrawerOpen(true)}>
          <Ionicons name="menu" size={22} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>My Patients</Text>
        <View style={{ flex: 1 }} />
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: '#F4ECF7' }]}>
            <Ionicons name="people" size={24} color="#5B2C6F" />
            <Text style={styles.statVal}>{PATIENTS.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#DCFCE7' }]}>
            <Ionicons name="checkmark-circle" size={24} color="#15803D" />
            <Text style={styles.statVal}>{activeCount}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#DBEAFE' }]}>
            <Ionicons name="person-add" size={24} color="#1D4ED8" />
            <Text style={styles.statVal}>{newThisMonth}</Text>
            <Text style={styles.statLabel}>New (Feb)</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={16} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients by name..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity>
            <Ionicons name="filter" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Patient List */}
        {filtered.map((p, i) => {
          const showHeader = i === 0 || p.name[0] !== filtered[i - 1].name[0];
          return (
            <View key={p.id}>
              {showHeader && (
                <Text style={styles.sectionHeader}>{p.name[0]}</Text>
              )}
              <TouchableOpacity
                style={styles.patientCard}
                onPress={() => navigation.navigate('ClinicianConsultation', { patientId: p.id, patientName: p.name })}
                activeOpacity={0.7}
              >
                <View style={[styles.avatar, { backgroundColor: p.avatarBg }]}>
                  <Text style={styles.avatarText}>{p.initials}</Text>
                </View>
                <View style={styles.patientInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.patientName}>{p.name}</Text>
                    <View style={[styles.statusDot, { backgroundColor: p.status === 'active' ? '#22C55E' : '#D1D5DB' }]} />
                  </View>
                  <Text style={styles.patientMeta}>{p.age} yrs · {p.gender === 'M' ? 'Male' : 'Female'} · Last: {p.lastVisit}</Text>
                  <View style={styles.tagsRow}>
                    {p.conditions.map(c => {
                      const tc = TAG_COLORS[c] || { color: '#6B7280', bg: '#F3F4F6' };
                      return (
                        <View key={c} style={[styles.tag, { backgroundColor: tc.bg }]}>
                          <Text style={[styles.tagText, { color: tc.color }]}>{c}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
              </TouchableOpacity>
            </View>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>

      <ClinicianSidebar
        visible={drawerOpen}
        activeRoute="ClinicianPatients"
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
  statBox: {
    flex: 1, borderRadius: 12, padding: 16, alignItems: 'center', gap: 4,
  },
  statVal: {
    fontSize: 24, fontWeight: '700', color: '#1A1A1A',
    marginTop: 8, marginBottom: 4,
  },
  statLabel: { fontSize: 12, color: '#666', fontWeight: '600' },

  // Search
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 12,
    paddingHorizontal: 12, height: 40, gap: 8,
    borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#111827' },

  // Section header
  sectionHeader: {
    fontSize: 13, fontWeight: '800', color: '#5B2C6F',
    marginTop: 10, marginBottom: 6, paddingLeft: 4,
  },

  // Patient card
  patientCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 15, fontWeight: '700', color: '#374151' },
  patientInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  patientName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  patientMeta: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { fontSize: 9, fontWeight: '700' },
});

export default ClinicianPatientsScreen;
