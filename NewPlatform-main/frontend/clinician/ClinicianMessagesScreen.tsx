/**
 * Clinician Messages Screen — Production Ready
 *
 * Chat inbox with conversation list, tabs, and unread indicators.
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
  navigation: NativeStackNavigationProp<ClinicianMainStackParamList, 'ClinicianMessages'>;
};

interface Conversation {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  type: 'patient' | 'team';
}

const TABS = ['All', 'Unread', 'Patients', 'Team'] as const;

const CONVERSATIONS: Conversation[] = [
  { id: '1', name: 'Rajesh Kumar',       initials: 'RK', avatarBg: '#BFDBFE', lastMessage: 'Doctor, I\'m feeling much better after the physiotherapy sessions. Thank you!',      time: '10 min',  unread: 2,  online: true,  type: 'patient' },
  { id: '2', name: 'Priya Sharma',       initials: 'PS', avatarBg: '#BBF7D0', lastMessage: 'Can I reschedule my appointment to next week?',                                       time: '25 min',  unread: 1,  online: true,  type: 'patient' },
  { id: '3', name: 'Dr. Arjun Mehta',    initials: 'AM', avatarBg: '#FED7AA', lastMessage: 'The patient\'s MRI reports are ready for review.',                                     time: '1h',      unread: 1,  online: false, type: 'team' },
  { id: '4', name: 'Amit Patel',         initials: 'AP', avatarBg: '#FED7AA', lastMessage: 'I\'ve been experiencing some swelling after the exercise. Is this normal?',             time: '2h',      unread: 0,  online: false, type: 'patient' },
  { id: '5', name: 'Nurse Kavitha',      initials: 'NK', avatarBg: '#A5F3FC', lastMessage: 'Room 3 is prepped for the 2:30 PM patient.',                                            time: '2h',      unread: 1,  online: true,  type: 'team' },
  { id: '6', name: 'Sneha Reddy',        initials: 'SR', avatarBg: '#FBCFE8', lastMessage: 'Thank you for the prescription, Doctor.',                                               time: '3h',      unread: 0,  online: false, type: 'patient' },
  { id: '7', name: 'Vikram Singh',       initials: 'VS', avatarBg: '#E9D5FF', lastMessage: 'When should I start the physiotherapy exercises?',                                      time: '5h',      unread: 0,  online: false, type: 'patient' },
  { id: '8', name: 'Lab Coordinator',    initials: 'LC', avatarBg: '#D9F99D', lastMessage: 'Blood test results for patient #4349 have been uploaded.',                               time: '6h',      unread: 0,  online: true,  type: 'team' },
  { id: '9', name: 'Ananya Gupta',       initials: 'AG', avatarBg: '#FEF08A', lastMessage: 'My knee brace arrived. Should I wear it during sleep too?',                              time: '1d',      unread: 0,  online: false, type: 'patient' },
  { id: '10', name: 'Deepa Iyer',        initials: 'DI', avatarBg: '#D9F99D', lastMessage: 'The post-op X-rays look good. Scheduled follow-up for March.',                          time: '2d',      unread: 0,  online: false, type: 'patient' },
];

export const ClinicianMessagesScreen: React.FC<Props> = ({ navigation }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('All');
  const [searchText, setSearchText] = useState('');

  const handleNavigate = (route: ClinicianRoute) => {
    navigation.navigate(route as any);
  };

  const totalUnread = CONVERSATIONS.reduce((acc, c) => acc + c.unread, 0);

  const filtered = CONVERSATIONS.filter(c => {
    if (activeTab === 'Unread')   return c.unread > 0;
    if (activeTab === 'Patients') return c.type === 'patient';
    if (activeTab === 'Team')     return c.type === 'team';
    return true;
  }).filter(c => !searchText || c.name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setDrawerOpen(true)}>
          <Ionicons name="menu" size={22} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Messages</Text>
        {totalUnread > 0 && (
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{totalUnread}</Text>
          </View>
        )}
        <View style={{ flex: 1 }} />
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={16} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map(tab => {
          const count = tab === 'Unread' ? totalUnread : undefined;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              {count !== undefined && count > 0 && (
                <View style={[styles.tabBadge, activeTab === tab && styles.tabBadgeActive]}>
                  <Text style={[styles.tabBadgeText, activeTab === tab && { color: '#5B2C6F' }]}>{count}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Conversation List */}
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-ellipses-outline" size={40} color="#D1D5DB" />
            <Text style={styles.emptyText}>No messages found</Text>
          </View>
        )}

        {filtered.map((c, i) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.convRow, c.unread > 0 && styles.convRowUnread]}
            onPress={() => navigation.navigate('ClinicianConsultation', { patientId: c.id, patientName: c.name })}
            activeOpacity={0.7}
          >
            <View style={styles.avatarWrap}>
              <View style={[styles.avatar, { backgroundColor: c.avatarBg }]}>
                <Text style={styles.avatarText}>{c.initials}</Text>
              </View>
              {c.online && <View style={styles.onlineDot} />}
            </View>
            <View style={styles.convInfo}>
              <View style={styles.convNameRow}>
                <Text style={[styles.convName, c.unread > 0 && styles.convNameBold]}>{c.name}</Text>
                <Text style={styles.convTime}>{c.time}</Text>
              </View>
              <View style={styles.convMsgRow}>
                <Text style={[styles.convMsg, c.unread > 0 && styles.convMsgBold]} numberOfLines={1}>
                  {c.lastMessage}
                </Text>
                {c.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{c.unread}</Text>
                  </View>
                )}
              </View>
              {c.type === 'team' && (
                <View style={styles.teamTag}>
                  <Text style={styles.teamTagText}>Team</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

      <ClinicianSidebar
        visible={drawerOpen}
        activeRoute="ClinicianMessages"
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
    borderBottomWidth: 0, gap: 8,
  },
  menuBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center',
  },
  topBarTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
  headerBadge: {
    backgroundColor: '#EF4444', borderRadius: 10,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  headerBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },


  // Search
  searchBar: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#FFFFFF' },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFC', borderRadius: 12,
    paddingHorizontal: 12, height: 38, gap: 8,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  searchInput: { flex: 1, fontSize: 13, color: '#111827' },

  // Tabs
  tabBar: {
    flexDirection: 'row', gap: 6, paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  tab: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 18,
    backgroundColor: '#F1F5F9',
  },
  tabActive: { backgroundColor: '#5B2C6F' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  tabBadge: { backgroundColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 5, paddingVertical: 1 },
  tabBadgeActive: { backgroundColor: '#FFFFFF' },
  tabBadgeText: { fontSize: 9, fontWeight: '700', color: '#6B7280' },

  body: { flex: 1 },

  // Empty
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },

  // Conversation row
  convRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 14, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  convRowUnread: { backgroundColor: '#FEFBF4' },
  avatarWrap: { position: 'relative' },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '700', color: '#374151' },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#22C55E', borderWidth: 2, borderColor: '#FFFFFF',
  },
  convInfo: { flex: 1 },
  convNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  convName: { fontSize: 14, fontWeight: '500', color: '#374151' },
  convNameBold: { fontWeight: '700', color: '#111827' },
  convTime: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  convMsgRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 3 },
  convMsg: { flex: 1, fontSize: 12, color: '#6B7280', lineHeight: 18 },
  convMsgBold: { color: '#374151', fontWeight: '600' },
  unreadBadge: {
    backgroundColor: '#5B2C6F', borderRadius: 10,
    minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadText: { fontSize: 10, fontWeight: '800', color: '#FFFFFF' },
  teamTag: {
    backgroundColor: '#DBEAFE', paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 4, alignSelf: 'flex-start', marginTop: 4,
  },
  teamTagText: { fontSize: 9, fontWeight: '700', color: '#1D4ED8' },
});

export default ClinicianMessagesScreen;
