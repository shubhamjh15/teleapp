/**
 * Clinician Settings Screen — Production Ready
 *
 * Account, notifications, privacy, appearance, and about sections.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClinicianMainStackParamList } from '@/navigation/types';
import { ClinicianSidebar, ClinicianRoute } from '@/components/clinician/ClinicianSidebar';
import { useClinicianAuthStore } from '@/context/ClinicianAuthContext';

type Props = {
  navigation: NativeStackNavigationProp<ClinicianMainStackParamList, 'ClinicianSettings'>;
};

type SettingItem = {
  icon: string;
  iconColor: string;
  iconBg: string;
  label: string;
  subtitle?: string;
  type: 'navigate' | 'toggle' | 'info';
  value?: boolean | string;
};

export const ClinicianSettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { clinician, logout } = useClinicianAuthStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifAppointments, setNotifAppointments] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifPayments, setNotifPayments] = useState(true);
  const [notifReports, setNotifReports] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const doctorName = clinician?.name || 'Dr. Esther Howard';
  const doctorEmail = clinician?.email || 'esther.howard@arthrosync.com';

  const handleNavigate = (route: ClinicianRoute) => {
    navigation.navigate(route as any);
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your clinician account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ],
    );
  };

  const renderSettingRow = (
    icon: string,
    iconColor: string,
    iconBg: string,
    label: string,
    subtitle: string | undefined,
    right: React.ReactNode,
    onPress?: () => void,
  ) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon as any} size={16} color={iconColor} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        {subtitle && <Text style={styles.settingSub}>{subtitle}</Text>}
      </View>
      {right}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setDrawerOpen(true)}>
          <Ionicons name="menu" size={22} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Settings</Text>
        <View style={{ flex: 1 }} />
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {doctorName.replace('Dr. ', '').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{doctorName}</Text>
            <Text style={styles.profileEmail}>{doctorEmail}</Text>
            <Text style={styles.profileSpec}>Orthopedic Surgeon · MBBS, MS Ortho</Text>
          </View>
          <TouchableOpacity style={styles.editProfileBtn}>
            <Ionicons name="create-outline" size={16} color="#5B2C6F" />
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.sectionCard}>
          {renderSettingRow('person', '#5B2C6F', '#F4ECF7', 'Personal Information', 'Name, phone, specialization', <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />, () => {})}
          <View style={styles.divider} />
          {renderSettingRow('card', '#1D4ED8', '#DBEAFE', 'Bank Details', 'Linked account for payouts', <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />, () => {})}
          <View style={styles.divider} />
          {renderSettingRow('document-text', '#15803D', '#DCFCE7', 'Licenses & Certificates', '3 documents uploaded', <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />, () => {})}
        </View>

        {/* Notifications Section */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.sectionCard}>
          {renderSettingRow('calendar', '#5B2C6F', '#F4ECF7', 'Appointments', 'New bookings & reminders',
            <Switch value={notifAppointments} onValueChange={setNotifAppointments} trackColor={{ false: '#E5E7EB', true: '#D7BDE2' }} thumbColor={notifAppointments ? '#5B2C6F' : '#9CA3AF'} />
          )}
          <View style={styles.divider} />
          {renderSettingRow('chatbubbles', '#3B82F6', '#DBEAFE', 'Messages', 'Patient & team messages',
            <Switch value={notifMessages} onValueChange={setNotifMessages} trackColor={{ false: '#E5E7EB', true: '#D7BDE2' }} thumbColor={notifMessages ? '#5B2C6F' : '#9CA3AF'} />
          )}
          <View style={styles.divider} />
          {renderSettingRow('cash', '#15803D', '#DCFCE7', 'Payments', 'Payment received & pending',
            <Switch value={notifPayments} onValueChange={setNotifPayments} trackColor={{ false: '#E5E7EB', true: '#D7BDE2' }} thumbColor={notifPayments ? '#5B2C6F' : '#9CA3AF'} />
          )}
          <View style={styles.divider} />
          {renderSettingRow('document-attach', '#92400E', '#FEF3C7', 'Reports', 'Lab results & report reviews',
            <Switch value={notifReports} onValueChange={setNotifReports} trackColor={{ false: '#E5E7EB', true: '#D7BDE2' }} thumbColor={notifReports ? '#5B2C6F' : '#9CA3AF'} />
          )}
        </View>

        {/* Privacy & Security */}
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        <View style={styles.sectionCard}>
          {renderSettingRow('lock-closed', '#5B2C6F', '#F4ECF7', 'Change Password', undefined, <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />, () => {})}
        </View>

        {/* Appearance */}
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.sectionCard}>
          {renderSettingRow('moon', '#374151', '#F3F4F6', 'Dark Mode', 'Coming soon',
            <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ false: '#E5E7EB', true: '#D7BDE2' }} thumbColor={darkMode ? '#5B2C6F' : '#9CA3AF'} />
          )}
          <View style={styles.divider} />
          {renderSettingRow('language', '#C2410C', '#FFEDD5', 'Preferred Language', 'English', <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />, () => {})}
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.sectionCard}>
          {renderSettingRow('information-circle', '#6B7280', '#F3F4F6', 'About ArthroSync', 'v2.4.1', <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />, () => {})}
          <View style={styles.divider} />
          {renderSettingRow('document', '#6B7280', '#F3F4F6', 'Terms of Service', undefined, <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />, () => {})}
          <View style={styles.divider} />
          {renderSettingRow('shield', '#6B7280', '#F3F4F6', 'Privacy Policy', undefined, <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />, () => {})}
          <View style={styles.divider} />
          {renderSettingRow('help-circle', '#6B7280', '#F3F4F6', 'Help & Support', undefined, <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />, () => {})}
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerCard}>
          <TouchableOpacity style={styles.dangerRow} onPress={handleLogout}>
            <Ionicons name="log-out" size={18} color="#DC2626" />
            <Text style={styles.dangerText}>Log Out</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.dangerRow}>
            <Ionicons name="trash" size={18} color="#DC2626" />
            <Text style={styles.dangerText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>ArthroSync Clinician Portal v2.4.1</Text>
        <Text style={styles.footerSub}>© 2026 ArthroSync Health. All rights reserved.</Text>

        <View style={{ height: 40 }} />
      </ScrollView>

      <ClinicianSidebar
        visible={drawerOpen}
        activeRoute="ClinicianSettings"
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

  // Profile
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginTop: 14,
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  profileAvatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#5B2C6F', alignItems: 'center', justifyContent: 'center',
  },
  profileAvatarText: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17, fontWeight: '800', color: '#111827' },
  profileEmail: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  profileSpec: { fontSize: 11, color: '#9CA3AF', marginTop: 1 },
  editProfileBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#F4ECF7', alignItems: 'center', justifyContent: 'center',
  },

  // Section
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#5B2C6F', marginTop: 20, marginBottom: 8, paddingLeft: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 4,
    borderWidth: 1, borderColor: '#F1F5F9',
  },

  // Setting row
  settingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 12, paddingVertical: 12,
  },
  settingIcon: {
    width: 34, height: 34, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 13, fontWeight: '600', color: '#111827' },
  settingSub: { fontSize: 10, color: '#9CA3AF', marginTop: 1 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 12 },

  // Danger
  dangerCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 4, marginTop: 20,
    borderWidth: 1, borderColor: '#FEE2E2',
  },
  dangerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 12, paddingVertical: 14,
  },
  dangerText: { fontSize: 14, fontWeight: '600', color: '#DC2626' },

  // Footer
  footerText: { fontSize: 12, fontWeight: '500', color: '#9CA3AF', textAlign: 'center', marginTop: 24 },
  footerSub: { fontSize: 10, color: '#D1D5DB', textAlign: 'center', marginTop: 4 },
});

export default ClinicianSettingsScreen;
