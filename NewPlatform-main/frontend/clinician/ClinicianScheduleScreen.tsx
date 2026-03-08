/**
 * Clinician Schedule Screen — Production Ready
 *
 * Weekly availability management with time slots, toggles, and break config.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClinicianMainStackParamList } from '@/navigation/types';
import { ClinicianSidebar, ClinicianRoute } from '@/components/clinician/ClinicianSidebar';

type Props = {
  navigation: NativeStackNavigationProp<ClinicianMainStackParamList, 'ClinicianSchedule'>;
};

type TimeSlot = { start: string; end: string };

type DaySchedule = {
  day: string;
  short: string;
  enabled: boolean;
  slots: TimeSlot[];
};

const INITIAL_SCHEDULE: DaySchedule[] = [
  { day: 'Monday',    short: 'Mon', enabled: true,  slots: [{ start: '09:00 AM', end: '12:00 PM' }, { start: '02:00 PM', end: '05:00 PM' }] },
  { day: 'Tuesday',   short: 'Tue', enabled: true,  slots: [{ start: '09:00 AM', end: '12:00 PM' }, { start: '02:00 PM', end: '06:00 PM' }] },
  { day: 'Wednesday', short: 'Wed', enabled: true,  slots: [{ start: '10:00 AM', end: '01:00 PM' }, { start: '03:00 PM', end: '05:00 PM' }] },
  { day: 'Thursday',  short: 'Thu', enabled: true,  slots: [{ start: '09:00 AM', end: '12:00 PM' }, { start: '02:00 PM', end: '05:00 PM' }] },
  { day: 'Friday',    short: 'Fri', enabled: true,  slots: [{ start: '09:00 AM', end: '01:00 PM' }] },
  { day: 'Saturday',  short: 'Sat', enabled: true,  slots: [{ start: '10:00 AM', end: '01:00 PM' }] },
  { day: 'Sunday',    short: 'Sun', enabled: false, slots: [] },
];

const BREAK_CONFIG = { start: '01:00 PM', end: '02:00 PM', label: 'Lunch Break' };

export const ClinicianScheduleScreen: React.FC<Props> = ({ navigation }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [addModal, setAddModal] = useState({
    visible: false,
    dayIndex: -1,
    start: '09:00 AM',
    end: '05:00 PM'
  });

  const handleNavigate = (route: ClinicianRoute) => {
    navigation.navigate(route as any);
  };

  const toggleDay = (index: number) => {
    setSchedule(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], enabled: !updated[index].enabled };
      return updated;
    });
  };

  const addSlot = (dayIndex: number) => {
    setSchedule(prev => {
      const updated = [...prev];
      updated[dayIndex].slots.push({ start: '09:00 AM', end: '05:00 PM' });
      return updated;
    });
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    setSchedule(prev => {
      const updated = [...prev];
      updated[dayIndex].slots = updated[dayIndex].slots.filter((_, i) => i !== slotIndex);
      return updated;
    });
  };

  const openAddModal = (dayIndex: number) => {
    setAddModal({ visible: true, dayIndex, start: '09:00 AM', end: '05:00 PM' });
  };

  const closeAddModal = () => {
    setAddModal(prev => ({ ...prev, visible: false }));
  };

  const confirmAddSlot = () => {
    if (addModal.dayIndex !== -1) {
      setSchedule(prev => {
        const updated = [...prev];
        updated[addModal.dayIndex].slots.push({ start: addModal.start, end: addModal.end });
        return updated;
      });
    }
    closeAddModal();
  };

  const totalHours = schedule
    .filter(d => d.enabled)
    .reduce((acc, d) => acc + d.slots.length * 3, 0);

  const activeDays = schedule.filter(d => d.enabled).length;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setDrawerOpen(true)}>
          <Ionicons name="menu" size={22} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Schedule Timings</Text>
        <View style={{ flex: 1 }} />
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Summary Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: '#F4ECF7' }]}>
            <Ionicons name="time" size={24} color="#5B2C6F" />
            <Text style={styles.statValue}>{totalHours}h</Text>
            <Text style={styles.statLabel}>Weekly hours</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#DCFCE7' }]}>
            <Ionicons name="calendar" size={24} color="#15803D" />
            <Text style={styles.statValue}>{activeDays}</Text>
            <Text style={styles.statLabel}>Active days</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#DBEAFE' }]}>
            <Ionicons name="hourglass" size={24} color="#1D4ED8" />
            <Text style={styles.statValue}>30m</Text>
            <Text style={styles.statLabel}>Per slot</Text>
          </View>
        </View>

        {/* Break Configuration */}
        <View style={styles.breakCard}>
          <View style={styles.breakRow}>
            <View style={styles.breakIcon}>
              <Ionicons name="cafe" size={16} color="#F97316" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.breakTitle}>{BREAK_CONFIG.label}</Text>
              <Text style={styles.breakTime}>{BREAK_CONFIG.start} — {BREAK_CONFIG.end}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="create-outline" size={14} color="#5B2C6F" />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weekly Schedule */}
        <Text style={styles.sectionTitle}>Weekly Availability</Text>

        {schedule.map((day, index) => (
          <View key={day.day} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <View style={styles.dayLeftRow}>
                <View style={[styles.dayDot, { backgroundColor: day.enabled ? '#22C55E' : '#D1D5DB' }]} />
                <Text style={[styles.dayName, !day.enabled && styles.dayNameDisabled]}>{day.day}</Text>
              </View>
              <Switch
                value={day.enabled}
                onValueChange={() => toggleDay(index)}
                trackColor={{ false: '#E5E7EB', true: '#D7BDE2' }}
                thumbColor={day.enabled ? '#5B2C6F' : '#9CA3AF'}
              />
            </View>

            {day.enabled && day.slots.length > 0 && (
              <View style={styles.slotsContainer}>
                {day.slots.map((slot, si) => (
                  <View key={si} style={styles.slotRow}>
                    <View style={styles.slotTimeBadge}>
                      <Ionicons name="time-outline" size={12} color="#5B2C6F" />
                      <Text style={styles.slotTimeText}>{slot.start}</Text>
                    </View>
                    <View style={styles.slotDash}>
                      <View style={styles.slotDashLine} />
                    </View>
                    <View style={styles.slotTimeBadge}>
                      <Ionicons name="time-outline" size={12} color="#5B2C6F" />
                      <Text style={styles.slotTimeText}>{slot.end}</Text>
                    </View>
                    <TouchableOpacity style={styles.slotDeleteBtn} onPress={() => removeSlot(index, si)}>
                      <Ionicons name="close-circle" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity style={styles.addSlotBtn} onPress={() => openAddModal(index)}>
                  <Ionicons name="add-circle" size={16} color="#5B2C6F" />
                  <Text style={styles.addSlotText}>Add time slot</Text>
                </TouchableOpacity>
              </View>
            )}

            {day.enabled && day.slots.length === 0 && (
              <TouchableOpacity style={styles.addSlotBtn} onPress={() => openAddModal(index)}>
                <Ionicons name="add-circle" size={16} color="#5B2C6F" />
                <Text style={styles.addSlotText}>Add time slot</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Time Picker Modal */}
      <Modal visible={addModal.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Time Slot</Text>
            
            <Text style={styles.modalLabel}>Start Time</Text>
            <View style={styles.timeGrid}>
              {['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(time => (
                <TouchableOpacity 
                  key={time} 
                  style={[styles.timeChip, addModal.start === time && styles.timeChipActive]}
                  onPress={() => setAddModal(prev => ({ ...prev, start: time }))}
                >
                  <Text style={[styles.timeChipText, addModal.start === time && styles.timeChipTextActive]}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>End Time</Text>
            <View style={styles.timeGrid}>
              {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'].map(time => (
                <TouchableOpacity 
                  key={time} 
                  style={[styles.timeChip, addModal.end === time && styles.timeChipActive]}
                  onPress={() => setAddModal(prev => ({ ...prev, end: time }))}
                >
                  <Text style={[styles.timeChipText, addModal.end === time && styles.timeChipTextActive]}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={closeAddModal}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={confirmAddSlot}>
                <Text style={styles.modalSaveText}>Add Slot</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ClinicianSidebar
        visible={drawerOpen}
        activeRoute="ClinicianSchedule"
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
  saveBtnContainer: {
    paddingHorizontal: 14, paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: '#F1F5F9',
  },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#74AF2E', paddingVertical: 14, borderRadius: 12,
  },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  body: { flex: 1, paddingHorizontal: 14 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 12, paddingVertical: 14 },
  statBox: {
    flex: 1, borderRadius: 12, padding: 16, alignItems: 'center',
  },
  statValue: {
    fontSize: 24, fontWeight: '700', color: '#1A1A1A',
    marginTop: 8, marginBottom: 4,
  },
  statLabel: { fontSize: 12, color: '#666', fontWeight: '600' },

  // Break
  breakCard: {
    backgroundColor: '#FFF7ED', borderRadius: 12, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#FFEDD5',
  },
  breakRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  breakIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#FFEDD5', alignItems: 'center', justifyContent: 'center' },
  breakTitle: { fontSize: 13, fontWeight: '700', color: '#92400E' },
  breakTime: { fontSize: 11, color: '#B45309', marginTop: 2 },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
    backgroundColor: '#F4ECF7',
  },
  editBtnText: { fontSize: 11, fontWeight: '600', color: '#5B2C6F' },

  // Section title
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 10, marginTop: 4 },

  // Day Card
  dayCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  dayHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dayLeftRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dayDot: { width: 8, height: 8, borderRadius: 4 },
  dayName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  dayNameDisabled: { color: '#9CA3AF' },

  // Slots
  slotsContainer: { marginTop: 12 },
  slotRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 6 },
  slotTimeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#F4ECF7', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
  },
  slotTimeText: { fontSize: 12, fontWeight: '600', color: '#5B2C6F' },
  slotDash: { width: 20, alignItems: 'center' },
  slotDashLine: { width: 14, height: 2, backgroundColor: '#D7BDE2', borderRadius: 1 },
  slotDeleteBtn: { marginLeft: 'auto' },
  addSlotBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4,
    paddingVertical: 8,
  },
  addSlotText: { fontSize: 13, fontWeight: '600', color: '#5B2C6F' },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF', width: '100%', borderRadius: 16, padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 20, textAlign: 'center' },
  modalLabel: { fontSize: 13, fontWeight: '700', color: '#4B5563', marginBottom: 8, marginTop: 4 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 16 },
  timeChip: {
    width: '31%', paddingVertical: 10, borderRadius: 8,
    backgroundColor: '#F3F4F6', alignItems: 'center',
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  timeChipActive: { backgroundColor: '#5B2C6F', borderColor: '#5B2C6F' },
  timeChipText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  timeChipTextActive: { color: '#FFFFFF' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  modalCancelBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, backgroundColor: '#F1F5F9', borderRadius: 8 },
  modalCancelText: { fontSize: 15, fontWeight: '600', color: '#4B5563' },
  modalSaveBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, backgroundColor: '#5B2C6F', borderRadius: 8 },
  modalSaveText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },

  // Settings
  settingsCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  settingLabel: { fontSize: 13, fontWeight: '600', color: '#111827' },
  settingSub: { fontSize: 10, color: '#9CA3AF', marginTop: 1 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 4 },
});

export default ClinicianScheduleScreen;
