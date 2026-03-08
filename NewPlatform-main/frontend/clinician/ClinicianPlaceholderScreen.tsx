/**
 * Clinician Placeholder Screen
 * Used for: Schedule, Appointments, Patients, Payments, Messages, Products, Settings
 * (easily convertible to full screens)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClinicianMainStackParamList } from '@/navigation/types';
import { ClinicianSidebar, ClinicianRoute } from '@/components/clinician/ClinicianSidebar';

type PlaceholderConfig = {
  title: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  description: string;
  activeRoute: ClinicianRoute;
};

const CONFIGS: Record<string, PlaceholderConfig> = {
  ClinicianSchedule: {
    title: 'Schedule Timings',
    icon: 'time',
    description: 'Manage your availability and appointment slots.',
    activeRoute: 'ClinicianSchedule',
  },
  ClinicianAppointments: {
    title: 'Appointments',
    icon: 'clipboard',
    description: 'View and manage all your booked consultations.',
    activeRoute: 'ClinicianAppointments',
  },
  ClinicianPatients: {
    title: 'My Patients',
    icon: 'people',
    description: 'Browse and manage your registered patients.',
    activeRoute: 'ClinicianPatients',
  },
  ClinicianPayments: {
    title: 'Payments',
    icon: 'card',
    description: 'View your earnings, invoices, and payment history.',
    activeRoute: 'ClinicianPayments',
  },
  ClinicianMessages: {
    title: 'Messages',
    icon: 'chatbubbles',
    description: 'Your patient and team messages.',
    activeRoute: 'ClinicianMessages',
  },
  ClinicianProducts: {
    title: 'ArthroSync Products',
    icon: 'cube',
    description: 'Explore and manage clinical products and devices.',
    activeRoute: 'ClinicianProducts',
  },
  ClinicianSettings: {
    title: 'Settings',
    icon: 'settings',
    description: 'Account, notifications, and app preferences.',
    activeRoute: 'ClinicianSettings',
  },
};

interface Props {
  navigation: NativeStackNavigationProp<ClinicianMainStackParamList>;
  route: { name: string };
}

export const ClinicianPlaceholderScreen: React.FC<Props> = ({ navigation, route }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const config = CONFIGS[route.name] || {
    title: route.name,
    icon: 'grid' as const,
    description: 'Coming soon.',
    activeRoute: 'ClinicianDashboard' as ClinicianRoute,
  };

  const handleNavigate = (r: ClinicianRoute) => {
    navigation.navigate(r as any);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setDrawerOpen(true)}>
          <Ionicons name="menu" size={22} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>{config.title}</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => navigation.navigate('ClinicianDashboard')}>
          <Text style={styles.dashLink}>← Dashboard</Text>
        </TouchableOpacity>
      </View>

      {/* Centered content */}
      <View style={styles.center}>
        <View style={styles.iconCircle}>
          <Ionicons name={config.icon} size={42} color="#5B2C6F" />
        </View>
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.description}>{config.description}</Text>
        <View style={styles.pillBadge}>
          <Text style={styles.pillText}>Coming Soon</Text>
        </View>
      </View>

      {/* Sidebar */}
      <ClinicianSidebar
        visible={drawerOpen}
        activeRoute={config.activeRoute}
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
  topBarTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  dashLink: { fontSize: 13, color: '#5B2C6F', fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 16 },
  iconCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: '#F4ECF7',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', textAlign: 'center' },
  description: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22 },
  pillBadge: {
    marginTop: 4, paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: '#5B2C6F', borderRadius: 20,
  },
  pillText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
});

export default ClinicianPlaceholderScreen;
