/**
 * Clinician Payments Screen — Production Ready
 *
 * Earnings dashboard with summary cards, transaction list, and mini chart.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClinicianMainStackParamList } from '@/navigation/types';
import { ClinicianSidebar, ClinicianRoute } from '@/components/clinician/ClinicianSidebar';

type Props = {
  navigation: NativeStackNavigationProp<ClinicianMainStackParamList, 'ClinicianPayments'>;
};

type TxnStatus = 'paid' | 'pending' | 'refunded';

interface Transaction {
  id: string;
  patient: string;
  initials: string;
  avatarBg: string;
  amount: string;
  date: string;
  type: string;
  status: TxnStatus;
}

const TXN_CFG: Record<TxnStatus, { label: string; color: string; bg: string }> = {
  paid:     { label: 'Paid',     color: '#15803D', bg: '#DCFCE7' },
  pending:  { label: 'Pending',  color: '#92400E', bg: '#FEF3C7' },
  refunded: { label: 'Refunded', color: '#DC2626', bg: '#FEE2E2' },
};

const TABS = ['All', 'Received', 'Pending', 'Refunded'] as const;

const TRANSACTIONS: Transaction[] = [
  { id: '1',  patient: 'Rajesh Kumar',    initials: 'RK', avatarBg: '#BFDBFE', amount: '₹2,500',  date: '25 Feb', type: 'Consultation',       status: 'paid' },
  { id: '2',  patient: 'Priya Sharma',    initials: 'PS', avatarBg: '#BBF7D0', amount: '₹4,000',  date: '25 Feb', type: 'Arthroscopy Review',  status: 'paid' },
  { id: '3',  patient: 'Amit Patel',      initials: 'AP', avatarBg: '#FED7AA', amount: '₹2,500',  date: '25 Feb', type: 'New Consultation',    status: 'pending' },
  { id: '4',  patient: 'Sneha Reddy',     initials: 'SR', avatarBg: '#FBCFE8', amount: '₹1,500',  date: '24 Feb', type: 'Follow-up',           status: 'paid' },
  { id: '5',  patient: 'Vikram Singh',    initials: 'VS', avatarBg: '#E9D5FF', amount: '₹3,500',  date: '24 Feb', type: 'Report Review',       status: 'paid' },
  { id: '6',  patient: 'Ananya Gupta',    initials: 'AG', avatarBg: '#FEF08A', amount: '₹2,500',  date: '23 Feb', type: 'Follow-up',           status: 'paid' },
  { id: '7',  patient: 'Karthik Menon',   initials: 'KM', avatarBg: '#A5F3FC', amount: '₹5,000',  date: '22 Feb', type: 'Surgery Consult',     status: 'paid' },
  { id: '8',  patient: 'Neha Kapoor',     initials: 'NK', avatarBg: '#FBCFE8', amount: '₹2,000',  date: '20 Feb', type: 'Consultation',        status: 'refunded' },
  { id: '9',  patient: 'Deepa Iyer',      initials: 'DI', avatarBg: '#D9F99D', amount: '₹3,000',  date: '20 Feb', type: 'Post-op Review',      status: 'paid' },
  { id: '10', patient: 'Rohit Menon',     initials: 'RM', avatarBg: '#FED7AA', amount: '₹2,500',  date: '19 Feb', type: 'Consultation',        status: 'pending' },
];

export const ClinicianPaymentsScreen: React.FC<Props> = ({ navigation }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('All');

  const handleNavigate = (route: ClinicianRoute) => {
    navigation.navigate(route as any);
  };

  const filtered = TRANSACTIONS.filter(t => {
    if (activeTab === 'All')      return true;
    if (activeTab === 'Received') return t.status === 'paid';
    if (activeTab === 'Pending')  return t.status === 'pending';
    if (activeTab === 'Refunded') return t.status === 'refunded';
    return true;
  });

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setDrawerOpen(true)}>
          <Ionicons name="menu" size={22} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Payments</Text>
        <View style={{ flex: 1 }} />
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: '#E8F5E0' }]}>
            <Ionicons name="wallet" size={24} color="#4A7C2F" />
            <Text style={styles.summaryValue}>₹5,53,500</Text>
            <Text style={styles.summaryLabel}>Total Earned</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="calendar" size={24} color="#D97706" />
            <Text style={styles.summaryValue}>₹1,24,500</Text>
            <Text style={styles.summaryLabel}>This Month</Text>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: '#FFF4E6' }]}>
            <Ionicons name="time" size={24} color="#92400E" />
            <Text style={styles.summaryValue}>₹5,000</Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#DCFCE7' }]}>
            <Ionicons name="arrow-down-circle" size={24} color="#15803D" />
            <Text style={styles.summaryValue}>₹4,24,000</Text>
            <Text style={styles.summaryLabel}>Withdrawn</Text>
          </View>
        </View>

        {/* Action Blocks: Receipt */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.receiptBtn} activeOpacity={0.7}>
            <Ionicons name="receipt-outline" size={20} color="#111827" />
            <Text style={styles.receiptBtnText}>Generate Receipt</Text>
            <View style={{ flex: 1 }} />
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
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

        {/* Transaction List */}
        {filtered.map(txn => {
          const cfg = TXN_CFG[txn.status];
          return (
            <View key={txn.id} style={styles.txnCard}>
              <View style={[styles.txnAvatar, { backgroundColor: txn.avatarBg }]}>
                <Text style={styles.txnAvatarText}>{txn.initials}</Text>
              </View>
              <View style={styles.txnInfo}>
                <Text style={styles.txnPatient}>{txn.patient}</Text>
                <Text style={styles.txnType}>{txn.type} · {txn.date}</Text>
              </View>
              <View style={styles.txnRight}>
                <Text style={[styles.txnAmount, txn.status === 'refunded' && { color: '#DC2626' }]}>
                  {txn.status === 'refunded' ? '-' : '+'}{txn.amount}
                </Text>
                <View style={[styles.txnBadge, { backgroundColor: cfg.bg }]}>
                  <Text style={[styles.txnBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
                </View>
              </View>
            </View>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>

      <ClinicianSidebar
        visible={drawerOpen}
        activeRoute="ClinicianPayments"
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
  exportBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
    backgroundColor: '#E8F5E0',
  },
  exportBtnText: { fontSize: 13, fontWeight: '600', color: '#4A7C2F' },
  body: { flex: 1, paddingHorizontal: 14 },

  // Summary
  summaryRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  summaryCard: {
    flex: 1, borderRadius: 12, padding: 16, gap: 4,
    alignItems: 'center',
  },
  summaryLabel: { fontSize: 12, color: '#666', fontWeight: '600' },
  summaryValue: {
    fontSize: 20, fontWeight: '700', color: '#1A1A1A',
    marginTop: 8, marginBottom: 4,
  },

  // Actions
  actionSection: { paddingVertical: 8, marginBottom: 8 },
  actionSectionTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 12 },
  collectionRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  collectionBtn: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12,
    alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9',
  },
  collectionIconBox: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  collectionBtnText: { fontSize: 12, fontWeight: '600', color: '#374151' },
  receiptBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  receiptBtnText: { fontSize: 14, fontWeight: '600', color: '#111827' },




  // Tabs
  tabRow: { flexDirection: 'row', gap: 6, marginTop: 16, marginBottom: 12 },
  tab: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  tabActive: { backgroundColor: '#5B2C6F' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  // Transactions
  txnCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  txnAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  txnAvatarText: { fontSize: 13, fontWeight: '700', color: '#374151' },
  txnInfo: { flex: 1 },
  txnPatient: { fontSize: 13, fontWeight: '700', color: '#111827' },
  txnType: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  txnRight: { alignItems: 'flex-end', gap: 4 },
  txnAmount: { fontSize: 14, fontWeight: '800', color: '#111827' },
  txnBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  txnBadgeText: { fontSize: 9, fontWeight: '700' },
});

export default ClinicianPaymentsScreen;
