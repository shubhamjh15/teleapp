/**
 * Clinician Report Preview Screen
 *
 * Full-page print preview — ARTHROSYNC letterhead, clinician info,
 * patient sections. Matches reference image: white page on dark bg.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClinicianMainStackParamList } from '@/navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<ClinicianMainStackParamList, 'ClinicianReportPreview'>;
};

const SECTIONS = [
  {
    title: 'Patient Information',
    content: [
      'Name: John Doe',
      'DOB: 15 March 1985',
      'Contact: +91 98765 43210',
      'Address: 42, Marine Lines, Mumbai – 400001',
    ],
  },
  {
    title: 'Presenting Complaint',
    content: [
      'The patient presents with a 7-day history of right knee pain, aggravated by stair climbing and squatting. The pain is described as a dull ache, rated 6/10 on the VAS scale.',
    ],
  },
  {
    title: 'Practice Information',
    content: [
      'Clinic: ArthroSync Orthopedic Centre',
      'Address: Level 3, Fortis Hospital, Mulund West, Mumbai',
      'Phone: +91 22 4567 8901',
      'Email: dr.ananya@arthrosync.in',
    ],
  },
  {
    title: 'Procedures & Findings',
    content: [
      'Arthroscopic examination performed under regional anaesthesia.',
      'Findings: Grade II tear of the posterior horn of the medial meniscus.',
      'No evidence of cruciate ligament involvement.',
      'Mild synovial inflammation noted.',
    ],
  },
  {
    title: 'Treatment Plan',
    content: [
      '1. Physiotherapy — 3 sessions per week for 6 weeks',
      '2. NSAID: Ibuprofen 400mg twice daily with food',
      '3. Cold compress 15 min twice daily',
      '4. Activity restriction: avoid high-impact sport for 6 weeks',
      '5. Follow-up review in 4 weeks',
    ],
  },
  {
    title: 'Education',
    content: [
      'MBBS — Grant Medical College, Mumbai University (2008)',
      'MS (Orthopaedics) — King Edward Memorial Hospital (2013)',
      'Fellowship in Arthroscopy & Sports Medicine — AIIMS Delhi (2015)',
    ],
  },
];

export const ClinicianReportPreviewScreen: React.FC<Props> = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>

      {/* ── Controls Bar ── */}
      <View style={styles.controlBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          <Text style={styles.backText}>Editor</Text>
        </TouchableOpacity>

        <View style={styles.pageNav}>
          <TouchableOpacity
            onPress={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <Ionicons name="chevron-back-circle" size={28} color={currentPage === 1 ? '#555' : '#FFFFFF'} />
          </TouchableOpacity>
          <Text style={styles.pageText}>{currentPage} / {totalPages}</Text>
          <TouchableOpacity
            onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <Ionicons name="chevron-forward-circle" size={28} color={currentPage === totalPages ? '#555' : '#FFFFFF'} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.shareBtn}>
          <Ionicons name="share-social-outline" size={16} color="#FFFFFF" />
          <Text style={styles.shareBtnText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* ── Dark bg + White page ── */}
      <View style={styles.darkBg}>
        <ScrollView
          contentContainerStyle={styles.pageWrapper}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.whitePage}>

            {/* ── ARTHROSYNC Letterhead ── */}
            <View style={styles.letterhead}>
              <View style={styles.lhTop}>
                <View style={styles.lhLogoRow}>
                  <View style={styles.lhBadge}>
                    <Ionicons name="medical" size={16} color="#FFFFFF" />
                  </View>
                  <Text style={styles.lhBrand}>
                    ARTHR<Text style={styles.lhO}>O</Text>SYNC
                  </Text>
                </View>
                <View style={styles.lhContact}>
                  <Text style={styles.lhContactLine}>arthrosync.in</Text>
                  <Text style={styles.lhContactLine}>+91 22 4567 8901</Text>
                </View>
              </View>
              <View style={styles.lhOrangeLine} />
            </View>

            {/* ── Clinician Header ── */}
            <View style={styles.clinicianHeader}>
              <Text style={styles.clinicianName}>Dr. Ananya Sharma</Text>
              <Text style={styles.clinicianReg}>Registration: MCI-2024-78456</Text>
              <Text style={styles.clinicianSpec}>Interventional Cardiologist & Senior Orthopaedic Surgeon</Text>
            </View>

            {/* ── Report Title ── */}
            <View style={styles.reportTitleRow}>
              <View style={styles.reportTitleAccent} />
              <View>
                <Text style={styles.reportTitle}>Arthroscopy Report</Text>
                <Text style={styles.reportDate}>Date: February 25, 2025</Text>
              </View>
            </View>

            {/* ── Sections ── */}
            {SECTIONS.map((s, i) => (
              <View key={i} style={styles.section}>
                <Text style={styles.sectionTitle}>{s.title}</Text>
                {s.content.map((line, j) => (
                  <Text key={j} style={styles.sectionBody}>{line}</Text>
                ))}
              </View>
            ))}

            {/* ── Signature ── */}
            <View style={styles.sigSection}>
              <View style={styles.sigLine} />
              <Text style={styles.sigName}>Dr. Ananya Sharma</Text>
              <Text style={styles.sigReg}>MCI Reg. No. 78456</Text>
              <Text style={styles.sigDate}>25 February 2025</Text>
            </View>

            {/* ── Footer ── */}
            <View style={styles.footer}>
              <View style={styles.footerLine} />
              <View style={styles.footerContent}>
                <Text style={styles.footerBrand}>ARTHR<Text style={{ color: '#F97316' }}>O</Text>SYNC</Text>
                <Text style={styles.footerText}>Confidential Medical Report — Page {currentPage} of {totalPages}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1F2937' },

  // control bar
  controlBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: '#111827', gap: 12,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  pageNav:  { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14 },
  pageText: { fontSize: 14, fontWeight: '600', color: '#D1D5DB' },
  shareBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7,
    backgroundColor: '#5B2C6F', borderRadius: 8,
  },
  shareBtnText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },

  // page container
  darkBg:      { flex: 1, backgroundColor: '#374151' },
  pageWrapper: { paddingVertical: 24, paddingHorizontal: 20, alignItems: 'center' },
  whitePage: {
    width: '100%', maxWidth: 640,
    backgroundColor: '#FFFFFF', borderRadius: 4,
    padding: 36,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 18, elevation: 12,
  },

  // letterhead
  letterhead: { marginBottom: 20 },
  lhTop: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 10,
  },
  lhLogoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lhBadge: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: '#5B2C6F', alignItems: 'center', justifyContent: 'center',
  },
  lhBrand: { fontSize: 20, fontWeight: '900', color: '#1F2937', letterSpacing: 1.5 },
  lhO:     { color: '#F97316' },
  lhContact: { alignItems: 'flex-end' },
  lhContactLine: { fontSize: 10, color: '#6B7280' },
  lhOrangeLine: { height: 2.5, backgroundColor: '#F97316', borderRadius: 2 },

  // clinician
  clinicianHeader: { paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 16 },
  clinicianName:   { fontSize: 18, fontWeight: '800', color: '#111827' },
  clinicianReg:    { fontSize: 11, color: '#6B7280', marginTop: 2 },
  clinicianSpec:   { fontSize: 11, color: '#5B2C6F', fontWeight: '500', marginTop: 2 },

  // report title
  reportTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  reportTitleAccent: { width: 4, height: 36, backgroundColor: '#5B2C6F', borderRadius: 2 },
  reportTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  reportDate:  { fontSize: 11, color: '#6B7280', marginTop: 2 },

  // sections
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 12, fontWeight: '800', color: '#5B2C6F',
    textTransform: 'uppercase', letterSpacing: 0.8,
    borderBottomWidth: 1, borderBottomColor: '#F4ECF7',
    paddingBottom: 4, marginBottom: 8,
  },
  sectionBody: { fontSize: 12, color: '#374151', lineHeight: 20, marginBottom: 2 },

  // signature
  sigSection: { marginTop: 24, alignItems: 'flex-end' },
  sigLine: { width: 160, height: 1, backgroundColor: '#1F2937', marginBottom: 6 },
  sigName: { fontSize: 13, fontWeight: '700', color: '#111827' },
  sigReg:  { fontSize: 10, color: '#6B7280' },
  sigDate: { fontSize: 10, color: '#6B7280' },

  // footer
  footer: { marginTop: 28 },
  footerLine: { height: 1.5, backgroundColor: '#F97316', marginBottom: 8 },
  footerContent: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  footerBrand: { fontSize: 12, fontWeight: '900', color: '#1F2937', letterSpacing: 1 },
  footerText:  { fontSize: 9, color: '#9CA3AF' },
});

export default ClinicianReportPreviewScreen;
