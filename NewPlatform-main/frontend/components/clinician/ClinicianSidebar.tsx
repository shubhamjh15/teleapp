/**
 * Clinician Sidebar — Slide-in drawer navigation for the Clinician Portal.
 *
 * Props:
 *   visible     — whether the sidebar is open
 *   activeRoute — currently active route name (highlights the nav item)
 *   onNavigate  — called with the selected ClinicianRoute
 *   onClose     — called when the user taps outside or the close button
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLogout } from '../../context/LogoutContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 320);

// ─── Types ───────────────────────────────────────────────────────────────────

export type ClinicianRoute =
  | 'ClinicianDashboard'
  | 'ClinicianSchedule'
  | 'ClinicianAppointments'
  | 'ClinicianPatients'
  | 'ClinicianPayments'
  | 'ClinicianMessages'
  | 'ClinicianProducts'
  | 'ClinicianSettings'
  | 'ClinicianReports'
  | 'ClinicianSessions'
  | 'ClinicianConsultation';

export interface ClinicianSidebarProps {
  visible: boolean;
  activeRoute: ClinicianRoute;
  onNavigate: (route: ClinicianRoute) => void;
  onClose: () => void;
  onLogout?: () => void;
}

// ─── Nav Items ───────────────────────────────────────────────────────────────

type NavItem = {
  label: string;
  route: ClinicianRoute;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconActive: React.ComponentProps<typeof Ionicons>['name'];
  badge?: number;
};

const NAV_SECTIONS: { title?: string; items: NavItem[] }[] = [
  {
    items: [
      { label: 'Dashboard',           route: 'ClinicianDashboard',    icon: 'home-outline',         iconActive: 'home' },
      { label: 'Schedule Timings',    route: 'ClinicianSchedule',     icon: 'time-outline',         iconActive: 'time' },
      { label: 'Appointments',        route: 'ClinicianAppointments', icon: 'clipboard-outline',    iconActive: 'clipboard',    badge: 3 },
      { label: 'My Patients',         route: 'ClinicianPatients',     icon: 'people-outline',       iconActive: 'people' },
      { label: 'Payments',            route: 'ClinicianPayments',     icon: 'card-outline',         iconActive: 'card' },
      { label: 'Reports',             route: 'ClinicianReports',      icon: 'bar-chart-outline',    iconActive: 'bar-chart' },
      { label: 'Messages',            route: 'ClinicianMessages',     icon: 'chatbubbles-outline',  iconActive: 'chatbubbles',  badge: 5 },
      { label: 'ArthroSync Products', route: 'ClinicianProducts',     icon: 'cube-outline',         iconActive: 'cube' },
      { label: 'Settings',            route: 'ClinicianSettings',     icon: 'settings-outline',     iconActive: 'settings' },
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export const ClinicianSidebar: React.FC<ClinicianSidebarProps> = ({
  visible,
  activeRoute,
  onNavigate,
  onClose,
  onLogout,
}) => {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const { logout: contextLogout } = useLogout();

  const handleLogout = () => {
    onClose();
    setTimeout(() => {
      if (onLogout) {
        onLogout();
      } else {
        contextLogout();
      }
    }, 200);
  };

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 70,
          friction: 12,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, overlayAnim]);

  const handleNavigate = (route: ClinicianRoute) => {
    onClose();
    // small delay so close animation plays first
    setTimeout(() => onNavigate(route), 200);
  };

  if (!visible && (slideAnim as any)._value <= -DRAWER_WIDTH) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visible ? 'auto' : 'none'}>
      {/* Overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.overlay,
            { opacity: overlayAnim },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Drawer */}
      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
      >
        <SafeAreaView style={styles.drawerInner} edges={['top', 'bottom']}>
          {/* ── Header ─────────────────────────────────────── */}
          <View style={styles.drawerHeader}>
            <View style={styles.logoRow}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>A</Text>
              </View>
              <View>
                <Text style={styles.appName}>ArthroSync</Text>
                <Text style={styles.portalLabel}>Clinician Portal</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#5B2C6F" />
            </TouchableOpacity>
          </View>


          {/* ── Nav Sections ───────────────────────────────── */}
          <ScrollView
            style={styles.navScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.navScrollContent}
          >
            {NAV_SECTIONS.map((section, si) => (
              <View key={si} style={styles.section}>
                {section.title ? (
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                ) : null}
                {section.items.map((item) => {
                  const isActive = item.route === activeRoute;
                  return (
                    <TouchableOpacity
                      key={item.route}
                      style={[styles.navItem, isActive && styles.navItemActive]}
                      onPress={() => handleNavigate(item.route)}
                      activeOpacity={0.75}
                    >
                      <View
                        style={[
                          styles.navIconWrap,
                          isActive && styles.navIconWrapActive,
                        ]}
                      >
                        <Ionicons
                          name={isActive ? item.iconActive : item.icon}
                          size={18}
                          color={isActive ? '#5B2C6F' : '#6B7280'}
                        />
                      </View>
                      <Text
                        style={[styles.navLabel, isActive && styles.navLabelActive]}
                      >
                        {item.label}
                      </Text>
                      {item.badge ? (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{item.badge}</Text>
                        </View>
                      ) : null}
                      {isActive && <View style={styles.activeBar} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>

          {/* ── Logout Button ─────────────────────────────── */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.75}>
            <View style={styles.logoutIconWrap}>
              <Ionicons name="log-out-outline" size={18} color="#DC2626" />
            </View>
            <Text style={styles.logoutLabel}>Logout</Text>
          </TouchableOpacity>

          {/* ── Footer ─────────────────────────────────────── */}
          <View style={styles.drawerFooter}>
            <Text style={styles.versionText}>ArthroSync v2.4.1</Text>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 20,
  },
  drawerInner: { flex: 1 },

  // ── Header ────────────────────────────────────────────────────────────────
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoCircle: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: '#5B2C6F', alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  appName: { fontSize: 16, fontWeight: '800', color: '#111827' },
  portalLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: '500', marginTop: 1 },
  closeBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: '#F4ECF7', alignItems: 'center', justifyContent: 'center',
  },


  // ── Nav ───────────────────────────────────────────────────────────────────
  navScroll: { flex: 1 },
  navScrollContent: { paddingHorizontal: 10, paddingTop: 10, paddingBottom: 10 },

  section: { marginBottom: 6 },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 4,
  },

  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  navItemActive: {
    backgroundColor: '#F4ECF7',
  },
  navIconWrap: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: '#F9FAFB',
    alignItems: 'center', justifyContent: 'center',
  },
  navIconWrapActive: {
    backgroundColor: '#EDDCF5',
  },
  navLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  navLabelActive: {
    fontWeight: '700',
    color: '#5B2C6F',
  },
  activeBar: {
    position: 'absolute',
    right: 0, top: 8, bottom: 8,
    width: 3.5,
    borderRadius: 4,
    backgroundColor: '#5B2C6F',
  },

  // ── Badge ─────────────────────────────────────────────────────────────────
  badge: {
    minWidth: 20, height: 20, borderRadius: 10,
    backgroundColor: '#5B2C6F',
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },

  // ── Footer ────────────────────────────────────────────────────────────────
  drawerFooter: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    alignItems: 'center',
  },
  versionText: { fontSize: 11, color: '#D1D5DB', fontWeight: '500' },

  // ── Logout ────────────────────────────────────────────────────────────────
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  logoutIconWrap: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: '#FEE2E2',
    alignItems: 'center', justifyContent: 'center',
  },
  logoutLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
});

export default ClinicianSidebar;
