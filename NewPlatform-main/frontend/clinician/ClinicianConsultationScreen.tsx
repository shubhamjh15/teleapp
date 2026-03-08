/**
 * ClinicianConsultationScreen
 *
 * Mobile-only chat view:
 * - Header: back, patient info, Prescription button, End Call button
 * - Full-screen chat (patient left / doctor right)
 * - Bottom text input
 * - Prescription modal with patient details + Rx form
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ClinicianMainStackParamList } from '@/navigation/types';
import { ClinicianSidebar, ClinicianRoute } from '@/components/clinician/ClinicianSidebar';

const { width: W } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<ClinicianMainStackParamList, 'ClinicianConsultation'>;
  route: RouteProp<ClinicianMainStackParamList, 'ClinicianConsultation'>;
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const PATIENT_INFO = {
  name:      'Rajesh Kumar',
  age:       45,
  gender:    'Male',
  dob:       '12 Mar 1980',
  phone:     '+91 98765 43210',
  address:   '14B, Nehru Nagar, Bengaluru - 560001',
  bloodType: 'B+',
  allergies: 'Penicillin',
  weight:    '78 kg',
  height:    "5'9\"",
};

const INITIAL_MESSAGES = [
  { id: 1, from: 'patient', text: 'Hello doctor, I have been experiencing joint pain in my right knee for the past week.', time: '10:30 AM' },
  { id: 2, from: 'doctor',  text: 'I see. Can you describe the pain? Is it sharp, dull, or throbbing? Does it worsen with movement?', time: '10:32 AM' },
  { id: 3, from: 'patient', text: 'It is more of a dull ache, and yes, it gets worse when I climb stairs or squat.', time: '10:34 AM' },
  { id: 4, from: 'voice',   text: '', time: '10:36 AM', duration: '0:42' },
  { id: 5, from: 'doctor',  text: 'Based on what you described, I would like to run an arthroscopy. I will generate a report for you shortly.', time: '10:40 AM' },
];

// Prescription line item
type RxItem = { medicine: string; dose: string; duration: string; instructions: string };

const DEFAULT_RX: RxItem[] = [
  { medicine: 'Ibuprofen 400mg', dose: '1 tablet twice daily', duration: '5 days',  instructions: 'After food' },
  { medicine: 'Calcium D3',      dose: '1 tablet once daily',  duration: '30 days', instructions: 'Morning with milk' },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export const ClinicianConsultationScreen: React.FC<Props> = ({ navigation, route }) => {
  const patientName = route.params?.patientName || PATIENT_INFO.name;
  const nameInitials = patientName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  const [drawerOpen, setDrawerOpen]         = useState(false);
  const [chatText, setChatText]             = useState('');
  const [messages, setMessages]             = useState(INITIAL_MESSAGES);
  const [showRx, setShowRx]                 = useState(false);
  const [rxItems, setRxItems]               = useState<RxItem[]>(DEFAULT_RX);
  const [rxNotes, setRxNotes]               = useState('Rest the knee. Avoid stairs for 1 week. Physiotherapy recommended.');
  const [rxDiagnosis, setRxDiagnosis]       = useState('Knee Joint Osteoarthritis (Early Stage)');
  const [rxHistory, setRxHistory]           = useState('Brief summary of patient\'s medical history relevant to the knee condition.');
  const [rxSymptoms, setRxSymptoms]         = useState('Pain and stiffness in the joint. Difficulty in full extension.');
  const [rxExam, setRxExam]                 = useState('Manual examination shows tenderness and limited range of motion.');
  const [rxPrognosis, setRxPrognosis]       = useState('Good, with proper therapy and rest, symptoms should improve.');
  const [rxRecs, setRxRecs]                 = useState('Use knee support during walk. Cold compression twice daily.');
  const scrollRef = useRef<ScrollView>(null);
  const rxScale   = useRef(new Animated.Value(0.92)).current;
  const rxOpacity = useRef(new Animated.Value(0)).current;

  const openRx = () => {
    setShowRx(true);
    Animated.parallel([
      Animated.spring(rxScale,   { toValue: 1, useNativeDriver: true, damping: 15, stiffness: 200 }),
      Animated.timing(rxOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const closeRx = () => {
    Animated.parallel([
      Animated.timing(rxScale,   { toValue: 0.92, duration: 160, useNativeDriver: true }),
      Animated.timing(rxOpacity, { toValue: 0,    duration: 160, useNativeDriver: true }),
    ]).start(() => setShowRx(false));
  };

  const handleCreateRx = () => {
    const medSummary = rxItems.map(m => `• ${m.medicine} (${m.dose})`).join('\n');
    const fullSummary = `📋 *OFFICIAL PRESCRIPTION GENERATED*\n\n` +
      `**Medical History:** ${rxHistory}\n` +
      `**Symptoms:** ${rxSymptoms}\n` +
      `**Physical Exam:** ${rxExam}\n` +
      `**Diagnosis:** ${rxDiagnosis}\n\n` +
      `**Treatment Plan:**\n${medSummary}\n` +
      `*Advice:* ${rxNotes}\n\n` +
      `**Prognosis:** ${rxPrognosis}\n` +
      `**Recommendations:** ${rxRecs}`;

    setMessages(prev => [...prev, { 
      id: Date.now(), 
      from: 'doctor', 
      text: fullSummary, 
      time: 'Now' 
    }]);
    closeRx();
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
  };

  const handleSend = () => {
    if (!chatText.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), from: 'doctor', text: chatText.trim(), time: 'Now' }]);
    setChatText('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  };

  const handleNavigate = (r: ClinicianRoute) => {
    setDrawerOpen(false);
    navigation.navigate(r as any);
  };

  // ─── MAIN RENDER ──────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={s.root}>

      {/* ── HEADER ── */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>

        <View style={s.headerInfo}>
          <View style={s.headerAvatar}>
            <Text style={s.headerAvatarText}>{nameInitials}</Text>
          </View>
          <View>
            <Text style={s.headerName}>{patientName}</Text>
            <View style={s.onlineRow}>
              <View style={s.onlineDot} />
              <Text style={s.onlineText}>In consultation</Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <TouchableOpacity style={s.rxBtn} onPress={openRx}>
            <Ionicons name="medical-outline" size={15} color="#FFFFFF" />
            <Text style={s.rxBtnText}>Prescription</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── CHAT ── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          style={s.msgScroll}
          contentContainerStyle={s.msgContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map(msg => {
            if (msg.from === 'patient') {
              return (
                <View key={msg.id} style={s.rowLeft}>
                  <View style={s.avSmall}><Text style={s.avSmallText}>{nameInitials}</Text></View>
                  <View style={s.bubbleGray}>
                    <Text style={s.msgTxt}>{msg.text}</Text>
                    <Text style={s.msgTime}>{msg.time}</Text>
                  </View>
                </View>
              );
            }
            if (msg.from === 'voice') {
              return (
                <View key={msg.id} style={s.rowLeft}>
                  <View style={s.avSmall}><Text style={s.avSmallText}>{nameInitials}</Text></View>
                  <View style={s.voiceBubble}>
                    <TouchableOpacity style={s.playBtn}>
                      <Ionicons name="play" size={13} color="#5B2C6F" />
                    </TouchableOpacity>
                    <View style={s.waveRow}>
                      {[3,7,5,11,6,9,4,8,6,10,4,7,3].map((h, i) => (
                        <View key={i} style={[s.waveLine, { height: h * 2 }]} />
                      ))}
                    </View>
                    <Text style={s.voiceDur}>{msg.duration}</Text>
                  </View>
                </View>
              );
            }
            return (
              <View key={msg.id} style={s.rowRight}>
                <View style={s.bubblePurple}>
                  <Text style={[s.msgTxt, { color: '#FFFFFF' }]}>{msg.text}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <Text style={[s.msgTime, { color: 'rgba(255,255,255,0.65)' }]}>{msg.time}</Text>
                    <Ionicons name="checkmark-done" size={12} color="rgba(255,255,255,0.65)" />
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* ── INPUT BAR ── */}
        <View style={s.inputBar}>
          <TouchableOpacity style={s.inputIcon}>
            <Ionicons name="happy-outline" size={22} color="#9CA3AF" />
          </TouchableOpacity>
          <TextInput
            style={s.input}
            placeholder="Type a message…"
            placeholderTextColor="#9CA3AF"
            value={chatText}
            onChangeText={setChatText}
            onSubmitEditing={handleSend}
            multiline
          />
          <TouchableOpacity style={s.inputIcon}>
            <Ionicons name="attach" size={22} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.sendBtn, !!chatText.trim() && s.sendBtnActive]}
            onPress={handleSend}
            activeOpacity={0.8}
          >
            <Ionicons name="send" size={17} color={chatText.trim() ? '#FFFFFF' : '#9CA3AF'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* ── PRESCRIPTION MODAL (Inlined to prevent re-mounting issues) ── */}
      <Modal visible={showRx} transparent animationType="none" onRequestClose={closeRx}>
        <View style={s.overlay}>
          <Animated.View style={[s.rxSheet, { transform: [{ scale: rxScale }], opacity: rxOpacity }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>

              {/* ── Official Header ── */}
              <View style={s.rxHeader}>
                <View style={s.rxLogoContainer}>
                  <View style={s.rxLogoPurp}>
                    <Ionicons name="body-outline" size={24} color="#FFFFFF" />
                  </View>
                  <Text style={s.rxLogoText}>ARTHRO<Text style={{ color: '#5B2C6F' }}>SYNC</Text></Text>
                </View>
                <TouchableOpacity style={s.rxClose} onPress={closeRx}>
                  <Ionicons name="close" size={22} color="#374151" />
                </TouchableOpacity>
              </View>
              
              <View style={s.orangeBar} />

              {/* ── Patient Essentials ── */}
              <View style={s.rxEssentialSection}>
                <View style={s.rxEssentialRow}>
                  <Text style={s.rxLabel}>Patient Name: </Text>
                  <Text style={s.rxVal}>{patientName}</Text>
                </View>
                <View style={s.rxEssentialRow}>
                  <Text style={s.rxLabel}>Address: </Text>
                  <Text style={s.rxVal}>{PATIENT_INFO.address}</Text>
                </View>
                <View style={s.rxEssentialRow}>
                  <Text style={s.rxLabel}>DOB: </Text>
                  <Text style={s.rxVal}>{PATIENT_INFO.dob}</Text>
                </View>
                <View style={s.rxEssentialRow}>
                  <Text style={s.rxLabel}>NHS No.: </Text>
                  <Text style={s.rxVal}>123456</Text>
                </View>
                <View style={s.rxEssentialRow}>
                  <Text style={s.rxLabel}>Phone No.: </Text>
                  <Text style={s.rxVal}>{PATIENT_INFO.phone}</Text>
                </View>
                <View style={s.rxEssentialRow}>
                  <Text style={s.rxLabel}>Email: </Text>
                  <Text style={s.rxVal}>j.smith@gmail.com</Text>
                </View>
              </View>

              {/* ── Medical Sections ── */}
              <View style={s.rxDocSection}>
                <Text style={s.rxSectionHeading}>Medical History:</Text>
                <TextInput
                  style={s.rxDocInput}
                  value={rxHistory}
                  onChangeText={setRxHistory}
                  multiline
                  placeholder="Enter medical history..."
                />
              </View>

              <View style={s.rxDocSection}>
                <Text style={s.rxSectionHeading}>Presenting Symptoms:</Text>
                <TextInput
                  style={s.rxDocInput}
                  value={rxSymptoms}
                  onChangeText={setRxSymptoms}
                  multiline
                  placeholder="Enter symptoms..."
                />
              </View>

              <View style={s.rxDocSection}>
                <Text style={s.rxSectionHeading}>Physical Examination Findings:</Text>
                <TextInput
                  style={s.rxDocInput}
                  value={rxExam}
                  onChangeText={setRxExam}
                  multiline
                  placeholder="Enter findings..."
                />
              </View>

              <View style={s.rxDocSection}>
                <Text style={s.rxSectionHeading}>Diagnosis:</Text>
                <TextInput
                  style={s.rxDocInput}
                  value={rxDiagnosis}
                  onChangeText={setRxDiagnosis}
                  multiline
                  placeholder="Enter diagnosis..."
                />
              </View>

              <View style={s.rxDocSection}>
                <Text style={s.rxSectionHeading}>Treatment Plan:</Text>
                {/* Medicines sub-list */}
                {rxItems.map((item, idx) => (
                  <View key={idx} style={s.rxMedItemRow}>
                    <Text style={s.rxMedBullet}>•</Text>
                    <View style={{ flex: 1, flexDirection: 'row', gap: 8 }}>
                      <TextInput
                        style={[s.rxMedItemInput, { flex: 2 }]}
                        value={item.medicine}
                        placeholder="Medicine"
                        onChangeText={v => {
                           const updated = [...rxItems];
                           updated[idx] = { ...updated[idx], medicine: v };
                           setRxItems(updated);
                        }}
                      />
                      <TextInput
                        style={[s.rxMedItemInput, { flex: 1 }]}
                        value={item.dose}
                        placeholder="Dose"
                        onChangeText={v => {
                           const updated = [...rxItems];
                           updated[idx] = { ...updated[idx], dose: v };
                           setRxItems(updated);
                        }}
                      />
                    </View>
                    <TouchableOpacity onPress={() => setRxItems(prev => prev.filter((_, i) => i !== idx))}>
                      <Ionicons name="remove-circle-outline" size={16} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  style={s.rxAddSmall}
                  onPress={() => setRxItems(prev => [...prev, { medicine: 'New Med', dose: '10mg', duration: '5 days', instructions: '' }])}
                >
                  <Ionicons name="add" size={14} color="#5B2C6F" />
                  <Text style={s.rxAddSmallText}>Add Medicine</Text>
                </TouchableOpacity>
                
                <TextInput
                  style={[s.rxDocInput, { marginTop: 8 }]}
                  value={rxNotes}
                  onChangeText={setRxNotes}
                  multiline
                  placeholder="Additional treatment advice..."
                />
              </View>

              <View style={s.rxDocSection}>
                <Text style={s.rxSectionHeading}>Prognosis:</Text>
                <TextInput
                  style={s.rxDocInput}
                  value={rxPrognosis}
                  onChangeText={setRxPrognosis}
                  multiline
                  placeholder="Enter prognosis..."
                />
              </View>

              <View style={s.rxDocSection}>
                <Text style={s.rxSectionHeading}>Recommendations:</Text>
                <TextInput
                  style={s.rxDocInput}
                  value={rxRecs}
                  onChangeText={setRxRecs}
                  multiline
                  placeholder="Enter recommendations..."
                />
              </View>

              {/* ── Create button ── */}
              <TouchableOpacity style={s.rxShareBtn} onPress={handleCreateRx}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
                <Text style={s.rxShareText}>Create Prescription</Text>
              </TouchableOpacity>

            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

      {/* ── SIDEBAR ── */}
      <ClinicianSidebar
        visible={drawerOpen}
        activeRoute="ClinicianAppointments"
        onNavigate={handleNavigate}
        onClose={() => setDrawerOpen(false)}
      />
    </SafeAreaView>
  );
};

// ─── STYLES ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F0F4F8' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    gap: 10,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center',
  },
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#5B2C6F', alignItems: 'center', justifyContent: 'center',
  },
  headerAvatarText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  headerName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  onlineRow:  { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot:  { width: 7, height: 7, borderRadius: 4, backgroundColor: '#4ADE80' },
  onlineText: { fontSize: 11, color: '#22C55E', fontWeight: '600' },
  rxBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10,
    backgroundColor: 'rgb(116, 175, 46)',
  },
  rxBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  endBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10,
    backgroundColor: '#EF4444',
  },
  endBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  msgScroll: { flex: 1 },
  msgContent: { paddingHorizontal: 14, paddingVertical: 16, gap: 12 },
  rowLeft:  { flexDirection: 'row', alignItems: 'flex-end', gap: 8, maxWidth: '82%' },
  rowRight: { alignSelf: 'flex-end', maxWidth: '82%' },
  avSmall: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#E9D5FF', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  avSmallText: { fontSize: 9, fontWeight: '800', color: '#5B2C6F' },
  bubbleGray: {
    flex: 1,
    backgroundColor: '#FFFFFF', borderRadius: 18, borderBottomLeftRadius: 4,
    paddingHorizontal: 13, paddingVertical: 9,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  bubblePurple: {
    backgroundColor: '#5B2C6F', borderRadius: 18, borderBottomRightRadius: 4,
    paddingHorizontal: 13, paddingVertical: 9,
    shadowColor: '#5B2C6F', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 6, elevation: 3,
  },
  msgTxt:  { fontSize: 14, color: '#111827', lineHeight: 20 },
  msgTime: { fontSize: 10, color: '#9CA3AF', marginTop: 4, textAlign: 'right' },

  voiceBubble: {
    flex: 1,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 18, borderBottomLeftRadius: 4,
    paddingHorizontal: 12, paddingVertical: 10, gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  playBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F4ECF7', alignItems: 'center', justifyContent: 'center',
  },
  waveRow:  { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 2.5 },
  waveLine: { width: 2.5, backgroundColor: '#A78BFA', borderRadius: 2 },
  voiceDur: { fontSize: 11, color: '#374151', fontWeight: '600' },
  inputBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12, paddingVertical: 8,
    borderTopWidth: 1, borderTopColor: '#F1F5F9',
    gap: 6,
  },
  inputIcon: { padding: 4 },
  input: {
    flex: 1, fontSize: 14, color: '#111827',
    maxHeight: 90,
    backgroundColor: '#F8FAFC',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  sendBtn:       { width: 38, height: 38, borderRadius: 12, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  sendBtnActive: { backgroundColor: '#5B2C6F' },

  // Prescription modal
  rxSheet: {
    backgroundColor: '#FFFFFF',
    width: '94%',
    maxHeight: '88%',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2, shadowRadius: 20, elevation: 10,
  },
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  rxHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20,
  },
  rxLogoContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rxLogoPurp: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#5B2C6F', justifyContent: 'center', alignItems: 'center',
  },
  rxLogoText: { fontSize: 22, fontWeight: '900', color: '#374151', letterSpacing: 1 },
  orangeBar: { height: 6, backgroundColor: '#FB923C', width: '100%' },
  
  rxEssentialSection: { padding: 20, gap: 4 },
  rxEssentialRow: { flexDirection: 'row', marginBottom: 2 },
  rxLabel: { fontSize: 13, fontWeight: '700', color: '#374151', width: 100 },
  rxVal: { fontSize: 13, color: '#4B5563', flex: 1 },

  rxDocSection: { paddingHorizontal: 20, paddingVertical: 12 },
  rxSectionHeading: { fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 6 },
  rxDocInput: {
    fontSize: 13, color: '#4B5563', backgroundColor: '#F9FAFB',
    padding: 12, borderRadius: 8, lineHeight: 18,
  },

  rxMedItemRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  rxMedBullet: { fontSize: 18, color: '#4B5563' },
  rxMedItemInput: { flex: 1, fontSize: 13, color: '#4B5563', paddingVertical: 4 },
  
  rxAddSmall: { 
    flexDirection: 'row', alignItems: 'center', gap: 4, 
    marginTop: 4, paddingVertical: 4 
  },
  rxAddSmallText: { fontSize: 12, fontWeight: '600', color: '#5B2C6F' },

  rxShareBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgb(116, 175, 46)',
    padding: 16, borderRadius: 14, justifyContent: 'center',
    marginHorizontal: 20, marginTop: 20,
  },
  rxShareText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  rxClose: { padding: 8 },
});

export default ClinicianConsultationScreen;
