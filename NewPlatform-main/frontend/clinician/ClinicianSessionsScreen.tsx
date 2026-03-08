/**
 * Clinician Active Sessions Screen
 *
 * View active sessions, session timeout warning, and logout from devices.
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Animated,
  AppState,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useClinicianAuthStore, ActiveSession } from '@/context/ClinicianAuthContext';
import { ClinicianMainStackParamList } from '@/navigation/types';
import { colors, textStyles, spacing, borderRadius, semanticSpacing } from '@/theme';

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const WARNING_BEFORE_TIMEOUT = 2 * 60 * 1000; // 2 minutes

type Props = {
  navigation: NativeStackNavigationProp<ClinicianMainStackParamList, 'ClinicianSessions'>;
};

export const ClinicianSessionsScreen: React.FC<Props> = ({ navigation }) => {
  const {
    sessions,
    loadSessions,
    terminateSession,
    logoutAll,
    logout,
    sessionWarningVisible,
    showSessionWarning,
    hideSessionWarning,
    lastActivity,
    recordActivity,
  } = useClinicianAuthStore();

  const [timeUntilExpiry, setTimeUntilExpiry] = useState('');
  const warningShownRef = useRef(false);

  useEffect(() => {
    loadSessions();
    recordActivity();
  }, []);

  // Inactivity timer
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivity;
      const remaining = INACTIVITY_TIMEOUT - elapsed;

      if (remaining <= 0) {
        logout();
        return;
      }

      if (remaining <= WARNING_BEFORE_TIMEOUT && !warningShownRef.current) {
        warningShownRef.current = true;
        showSessionWarning();
      }

      if (remaining > WARNING_BEFORE_TIMEOUT) {
        warningShownRef.current = false;
      }

      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      setTimeUntilExpiry(`${mins}:${secs.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastActivity]);

  const handleTerminateSession = (session: ActiveSession) => {
    if (session.is_current) {
      Alert.alert(
        'Logout',
        'This will log you out of the current session.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', style: 'destructive', onPress: logout },
        ]
      );
      return;
    }

    Alert.alert(
      'Terminate Session',
      `End session on ${session.device_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Terminate',
          style: 'destructive',
          onPress: () => terminateSession(session.id),
        },
      ]
    );
  };

  const handleLogoutAll = () => {
    Alert.alert(
      'Logout from All Devices',
      'This will terminate all active sessions including this one. You will need to login again.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout All', style: 'destructive', onPress: logoutAll },
      ]
    );
  };

  const handleExtendSession = () => {
    hideSessionWarning();
    warningShownRef.current = false;
  };

  const getDeviceIcon = (type: string): React.ComponentProps<typeof Ionicons>['name'] => {
    switch (type) {
      case 'mobile': return 'phone-portrait-outline';
      case 'tablet': return 'tablet-portrait-outline';
      case 'desktop': return 'desktop-outline';
      default: return 'hardware-chip-outline';
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Sessions</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Session Timer Card */}
        <View style={styles.timerCard}>
          <View style={styles.timerIconBg}>
            <Ionicons name="timer-outline" size={24} color={colors.primary[500]} />
          </View>
          <View style={styles.timerInfo}>
            <Text style={styles.timerLabel}>Session Expires In</Text>
            <Text style={styles.timerValue}>{timeUntilExpiry}</Text>
          </View>
          <TouchableOpacity
            style={styles.extendBtn}
            onPress={() => { recordActivity(); warningShownRef.current = false; }}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={16} color="#FFFFFF" />
            <Text style={styles.extendBtnText}>Extend</Text>
          </TouchableOpacity>
        </View>

        {/* Security Info */}
        <View style={styles.securityInfo}>
          <Ionicons name="shield-checkmark" size={18} color={colors.primary[500]} />
          <Text style={styles.securityText}>
            Auto-logout after 15 minutes of inactivity. Secure token-based authentication enabled.
          </Text>
        </View>

        {/* Sessions List */}
        <Text style={styles.sectionTitle}>
          Devices ({sessions.length})
        </Text>

        {sessions.map((session) => (
          <View
            key={session.id}
            style={[styles.sessionCard, session.is_current && styles.sessionCardCurrent]}
          >
            <View style={[styles.sessionIcon, session.is_current && styles.sessionIconCurrent]}>
              <Ionicons
                name={getDeviceIcon(session.device_type)}
                size={22}
                color={session.is_current ? '#FFFFFF' : colors.text.secondary}
              />
            </View>
            <View style={styles.sessionInfo}>
              <View style={styles.sessionNameRow}>
                <Text style={styles.sessionName}>{session.device_name}</Text>
                {session.is_current && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>This Device</Text>
                  </View>
                )}
              </View>
              <View style={styles.sessionMeta}>
                <Ionicons name="location-outline" size={12} color={colors.text.tertiary} />
                <Text style={styles.sessionMetaText}>{session.location}</Text>
                <Text style={styles.sessionDot}>•</Text>
                <Text style={styles.sessionMetaText}>
                  {session.is_current ? 'Active now' : formatTimeAgo(session.last_active)}
                </Text>
              </View>
              <Text style={styles.sessionIp}>IP: {session.ip_address}</Text>
            </View>
            <TouchableOpacity
              style={styles.terminateBtn}
              onPress={() => handleTerminateSession(session)}
            >
              <Ionicons
                name={session.is_current ? 'log-out-outline' : 'close-circle-outline'}
                size={22}
                color={colors.safety.danger}
              />
            </TouchableOpacity>
          </View>
        ))}

        {/* Logout All */}
        <TouchableOpacity
          style={styles.logoutAllBtn}
          onPress={handleLogoutAll}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out" size={20} color="#FFFFFF" />
          <Text style={styles.logoutAllText}>Logout from All Devices</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Session Timeout Warning Modal */}
      <Modal
        visible={sessionWarningVisible}
        transparent
        animationType="fade"
        onRequestClose={handleExtendSession}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconBg}>
              <Ionicons name="warning" size={32} color={colors.warning[500]} />
            </View>
            <Text style={styles.modalTitle}>Session Expiring Soon</Text>
            <Text style={styles.modalDescription}>
              Your session will expire in about 2 minutes due to inactivity.
              Would you like to extend your session?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalLogoutBtn} onPress={logout}>
                <Text style={styles.modalLogoutText}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalExtendBtn} onPress={handleExtendSession}>
                <Ionicons name="refresh" size={18} color="#FFFFFF" />
                <Text style={styles.modalExtendText}>Extend Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: semanticSpacing.screenHorizontal,
    paddingVertical: spacing['3'],
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text.primary },
  scrollContent: {
    paddingHorizontal: semanticSpacing.screenHorizontal,
    paddingBottom: spacing['8'],
  },
  timerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing['4'],
    marginBottom: spacing['4'],
    gap: spacing['3'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  timerIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerInfo: { flex: 1 },
  timerLabel: { ...textStyles.caption, color: colors.text.tertiary },
  timerValue: { fontSize: 22, fontWeight: '800', color: colors.text.primary },
  extendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary[500],
    paddingVertical: spacing['2'],
    paddingHorizontal: spacing['3'],
    borderRadius: 10,
  },
  extendBtnText: { ...textStyles.caption, fontWeight: '600', color: '#FFFFFF' },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing['2'],
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    padding: spacing['3'],
    marginBottom: spacing['5'],
  },
  securityText: { ...textStyles.caption, color: colors.primary[700], flex: 1, lineHeight: 18 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing['3'],
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: spacing['4'],
    marginBottom: spacing['3'],
    gap: spacing['3'],
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  sessionCardCurrent: {
    borderColor: colors.primary[300],
    backgroundColor: colors.primary[50],
  },
  sessionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionIconCurrent: {
    backgroundColor: colors.primary[500],
  },
  sessionInfo: { flex: 1 },
  sessionNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing['2'] },
  sessionName: { ...textStyles.bodyMedium, color: colors.text.primary },
  currentBadge: {
    backgroundColor: colors.primary[500],
    paddingVertical: 1,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  currentBadgeText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
  sessionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  sessionMetaText: { ...textStyles.caption, color: colors.text.tertiary },
  sessionDot: { color: colors.text.tertiary, fontSize: 8 },
  sessionIp: { ...textStyles.caption, color: colors.neutral[400], marginTop: 2, fontSize: 11 },
  terminateBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
    backgroundColor: colors.safety.danger,
    borderRadius: 14,
    paddingVertical: spacing['4'],
    marginTop: spacing['4'],
    shadowColor: colors.safety.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutAllText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['6'],
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing['6'],
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  modalIconBg: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.warning[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['4'],
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing['2'],
  },
  modalDescription: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing['6'],
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing['3'],
    width: '100%',
  },
  modalLogoutBtn: {
    flex: 1,
    paddingVertical: spacing['3'],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: 'center',
  },
  modalLogoutText: { ...textStyles.bodyMedium, color: colors.text.secondary },
  modalExtendBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
    paddingVertical: spacing['3'],
    borderRadius: 12,
    backgroundColor: colors.primary[500],
  },
  modalExtendText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});

export default ClinicianSessionsScreen;
