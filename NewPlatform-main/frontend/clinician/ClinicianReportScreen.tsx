/**
 * Clinician Report Screen
 *
 * Pixel-close to ArthroSync reference:
 * - Sidebar (shared)
 * - Left: document thumbnail list
 * - Center: editable report with ARTHROSYNC letterhead (orange underline)
 * - Right: styled formatted preview panel
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ClinicianMainStackParamList } from '@/navigation/types';
import { ClinicianSidebar, ClinicianRoute } from '@/components/clinician/ClinicianSidebar';

const { width: W } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<ClinicianMainStackParamList, 'ClinicianReport'>;
  route: RouteProp<ClinicianMainStackParamList, 'ClinicianReport'>;
};

// Toolbar actions
const TOOLBAR = [
  'B', 'I', 'U', 'S',
  'align-left', 'align-center', 'align-right',
  'list', 'list-ol', 'link',
] as const;

const DOCS = [
  { id: 1, title: 'OPD Report',         date: 'Feb 2025', active: false },
  { id: 2, title: 'Arthroscopy Report', date: 'Feb 2025', active: true  },
  { id: 3, title: 'X-Ray Analysis',     date: 'Jan 2025', active: false },
  { id: 4, title: 'Lab Results',        date: 'Jan 2025', active: false },
];

const REPORT_FIELDS = [
  { label: 'Patient Name',   value: 'John Doe'              },
  { label: 'Date',           value: 'February 25, 2025'     },
  { label: 'Diagnosis',      value: 'Mild meniscal tear, right knee' },
  { label: 'Treatment Plan', value: 'Physiotherapy + NSAID' },
];

export const ClinicianReportScreen: React.FC<Props> = ({ navigation }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDoc,  setActiveDoc]  = useState(2);
  const [editorText, setEditorText] = useState(
    'Dr. Ananya Sharma\nMCI-2024-78456\n\nDear John,\n\nFollowing your consultation on February 25, 2025, I have reviewed your symptoms and imaging. Based on the arthroscopic findings, you have a Grade II meniscal tear in the medial compartment of your right knee.\n\nRecommendations:\n• Avoid high-impact activity for 6 weeks\n• Physiotherapy — 3 sessions/week\n• NSAID (Ibuprofen 400mg) twice daily with food\n• Follow-up in 4 weeks\n\nPlease contact the clinic if symptoms worsen.\n\nRegards,\nDr. Ananya Sharma'
  );
  const [activeTab, setActiveTab] = useState<'fields' | 'editor'>('editor');

  const handleNavigate = (route: ClinicianRoute) => {
    navigation.navigate(route as any);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>

      {/* ── TOP BAR ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setDrawerOpen(true)}>
          <Ionicons name="menu" size={22} color="#374151" />
        </TouchableOpacity>

        {/* Breadcrumb */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.breadcrumbLink}>Appointments</Text>
        </TouchableOpacity>
        <Ionicons name="chevron-forward" size={14} color="#9CA3AF" />
        <Text style={styles.breadcrumbCurrent}>Report Editor</Text>

        <View style={{ flex: 1 }} />

        <TouchableOpacity style={styles.printBtn} onPress={() => navigation.navigate('ClinicianReportPreview', {})}>
          <Ionicons name="print-outline" size={15} color="#FFFFFF" />
          <Text style={styles.printBtnText}>Print Preview</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn}>
          <Ionicons name="cloud-upload-outline" size={15} color="#FFFFFF" />
          <Text style={styles.saveBtnText}>Save Report</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>

        {/* ── LEFT: Document List ── */}
        <View style={styles.docList}>
          <Text style={styles.docListTitle}>Documents</Text>
          <TouchableOpacity style={styles.newDocBtn}>
            <Ionicons name="add" size={16} color="#5B2C6F" />
            <Text style={styles.newDocText}>New document</Text>
          </TouchableOpacity>
          {DOCS.map(doc => (
            <TouchableOpacity
              key={doc.id}
              style={[styles.docItem, doc.id === activeDoc && styles.docItemActive]}
              onPress={() => setActiveDoc(doc.id)}
            >
              <View style={styles.docThumb}>
                <Ionicons name="document-text" size={18} color={doc.id === activeDoc ? '#5B2C6F' : '#9CA3AF'} />
              </View>
              <View style={styles.docMeta}>
                <Text style={[styles.docTitle, doc.id === activeDoc && styles.docTitleActive]} numberOfLines={2}>
                  {doc.title}
                </Text>
                <Text style={styles.docDate}>{doc.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── CENTER: Editor ── */}
        <View style={styles.editorPanel}>
          {/* Tabs */}
          <View style={styles.tabRow}>
            {(['editor', 'fields'] as const).map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab === 'editor' ? 'Editor' : 'Form Fields'}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.tabIconBtn}>
              <Ionicons name="expand-outline" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Toolbar */}
          <View style={styles.toolbar}>
            {[
              { icon: 'text'            as const, label: 'B'  },
              { icon: 'text-outline'   as const, label: 'I'  },
              { icon: 'reorder-three'  as const, label: 'U'  },
              { icon: 'list'           as const, label: '≡'  },
              { icon: 'link'           as const, label: '🔗' },
            ].map((t, i) => (
              <TouchableOpacity key={i} style={styles.toolBtn}>
                <Ionicons name={t.icon} size={14} color="#374151" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Letterhead + Editor */}
          <ScrollView style={styles.editorScroll}>
            <View style={styles.letterPage}>
              {/* ARTHROSYNC letterhead */}
              <View style={styles.letterhead}>
                <View style={styles.lhLogoRow}>
                  <View style={styles.lhLogoIcon}>
                    <Ionicons name="medical" size={14} color="#FFFFFF" />
                  </View>
                  <Text style={styles.lhBrand}>ARTHR<Text style={styles.lhO}>O</Text>SYNC</Text>
                </View>
                <View style={styles.lhUnderline} />
              </View>

              {/* Editable text */}
              <TextInput
                style={styles.editorTextInput}
                multiline
                value={editorText}
                onChangeText={setEditorText}
                scrollEnabled={false}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
        </View>

        {/* ── RIGHT: Formatted Preview ── */}
        <View style={styles.previewPanel}>
          <Text style={styles.previewPanelTitle}>Preview</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Mini letterhead */}
            <View style={styles.previewLetterhead}>
              <Text style={styles.previewBrand}>ARTHR<Text style={{ color: '#F97316' }}>O</Text>SYNC</Text>
              <View style={styles.previewUL} />
            </View>

            {REPORT_FIELDS.map((f, i) => (
              <View key={i} style={styles.previewField}>
                <Text style={styles.previewLabel}>{f.label}</Text>
                <Text style={styles.previewValue}>{f.value}</Text>
              </View>
            ))}

            <View style={styles.previewDivider} />
            <Text style={styles.previewSectionHead}>Clinical Notes</Text>
            <Text style={styles.previewBody}>
              Grade II meniscal tear in the medial compartment of the right knee. Physiotherapy recommended alongside NSAID therapy.
            </Text>

            <TouchableOpacity
              style={styles.previewFullBtn}
              onPress={() => navigation.navigate('ClinicianReportPreview', {})}
            >
              <Ionicons name="expand" size={13} color="#5B2C6F" />
              <Text style={styles.previewFullText}>Full Preview</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  body: { flex: 1, flexDirection: 'row' },

  // top bar
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 6,
  },
  menuBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center',
  },
  breadcrumbLink: { fontSize: 13, color: '#5B2C6F', fontWeight: '500' },
  breadcrumbCurrent: { fontSize: 13, color: '#374151', fontWeight: '600' },
  printBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#374151', paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 8,
  },
  printBtnText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#5B2C6F', paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 8,
  },
  saveBtnText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },

  // doc list
  docList: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1, borderRightColor: '#F1F5F9',
    padding: 12,
  },
  docListTitle: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  newDocBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 7, paddingHorizontal: 8, borderRadius: 8,
    backgroundColor: '#F4ECF7', marginBottom: 10,
  },
  newDocText: { fontSize: 11, fontWeight: '700', color: '#5B2C6F' },
  docItem: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    padding: 8, borderRadius: 8, marginBottom: 4,
  },
  docItemActive: { backgroundColor: '#F4ECF7' },
  docThumb: {
    width: 30, height: 34, borderRadius: 4,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  docMeta: { flex: 1 },
  docTitle: { fontSize: 10, fontWeight: '600', color: '#374151' },
  docTitleActive: { color: '#5B2C6F' },
  docDate: { fontSize: 9, color: '#9CA3AF', marginTop: 2 },

  // editor
  editorPanel: { flex: 1, borderRightWidth: 1, borderRightColor: '#E5E7EB' },
  tabRow: {
    flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF', paddingHorizontal: 12,
  },
  tab: { paddingVertical: 12, paddingHorizontal: 10, marginRight: 4 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#5B2C6F' },
  tabText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  tabTextActive: { color: '#5B2C6F', fontWeight: '700' },
  tabIconBtn: { padding: 8 },
  toolbar: {
    flexDirection: 'row', gap: 2,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
    paddingHorizontal: 8, paddingVertical: 4,
  },
  toolBtn: { width: 30, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  editorScroll: { flex: 1, backgroundColor: '#F0F0F0' },
  letterPage: {
    margin: 12, backgroundColor: '#FFFFFF',
    borderRadius: 4, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
    minHeight: 600,
  },
  letterhead: { marginBottom: 18, paddingBottom: 14, borderBottomWidth: 2, borderBottomColor: '#F97316' },
  lhLogoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lhLogoIcon: {
    width: 28, height: 28, borderRadius: 7,
    backgroundColor: '#5B2C6F', alignItems: 'center', justifyContent: 'center',
  },
  lhBrand: { fontSize: 18, fontWeight: '900', color: '#1F2937', letterSpacing: 1.5 },
  lhO: { color: '#F97316' },
  lhUnderline: { height: 2, backgroundColor: '#F97316', marginTop: 10 },
  editorTextInput: {
    fontSize: 13, color: '#374151', lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },

  // right preview
  previewPanel: { width: 160, backgroundColor: '#FFFFFF', padding: 12 },
  previewPanelTitle: { fontSize: 11, fontWeight: '700', color: '#6B7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  previewLetterhead: { marginBottom: 12 },
  previewBrand: { fontSize: 13, fontWeight: '900', color: '#1F2937', letterSpacing: 1 },
  previewUL: { height: 1.5, backgroundColor: '#F97316', marginTop: 4 },
  previewField: { marginBottom: 8 },
  previewLabel: { fontSize: 9, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 1 },
  previewValue: { fontSize: 11, color: '#374151', fontWeight: '500' },
  previewDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 10 },
  previewSectionHead: { fontSize: 10, fontWeight: '700', color: '#374151', marginBottom: 6 },
  previewBody: { fontSize: 10, color: '#6B7280', lineHeight: 15 },
  previewFullBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginTop: 14, paddingVertical: 8, paddingHorizontal: 10,
    borderRadius: 8, backgroundColor: '#F4ECF7',
    justifyContent: 'center',
  },
  previewFullText: { fontSize: 11, fontWeight: '700', color: '#5B2C6F' },
});

export default ClinicianReportScreen;
