/**
 * Clinic Dashboard — Main clinic management screen for Clinician Admin
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../common/components/Header';
import { getClinics, Clinic } from '../common/services/clinicService';

const { width } = Dimensions.get('window');

interface ClinicOption {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
  screen: string;
}

const clinicOptions: ClinicOption[] = [
  {
    id: 'onboard-clinic',
    title: 'Onboard Clinic',
    description: 'Register a new clinic in the system',
    icon: 'business-outline',
    color: '#6D2ACE',
    bgColor: '#EDE5FF',
    screen: 'AddClinic',
  },
];

const ClinicDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClinics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getClinics();
      setClinics(data);
    } catch (err) {
      console.error('Failed to load clinics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload every time the screen comes into focus (e.g. after adding a clinic)
  useFocusEffect(useCallback(() => { loadClinics(); }, [loadClinics]));

  const totalClinics = clinics.length;
  const pendingClinics = clinics.filter((c) => c.status === 'pending').length;
  const recentClinics = [...clinics].reverse().slice(0, 5);

  const handleOptionPress = (screen: string) => {
    navigation.navigate(screen);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#22C55E';
      case 'pending':  return '#FF9500';
      case 'rejected': return '#EF4444';
      default:         return '#999';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'approved': return '#DCFCE7';
      case 'pending':  return '#FFF4E6';
      case 'rejected': return '#FEE2E2';
      default:         return '#F3F4F6';
    }
  };

  return (
    <View style={styles.container}>
      <Header
        navigation={navigation}
        userName="Super Admin"
        onNotificationPress={() => console.log('Notifications pressed')}
        onAvatarPress={() => console.log('Avatar pressed')}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.pageTitle}>Clinic Management</Text>
              <Text style={styles.pageSubtitle}>
                Manage clinics, assign admins, and approve registrations
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={[styles.statBox, { backgroundColor: '#EDE5FF' }]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('AllClinics')}
          >
            <Ionicons name="business" size={24} color="#6D2ACE" />
            {loading ? (
              <ActivityIndicator size="small" color="#6D2ACE" style={{ marginTop: 8 }} />
            ) : (
              <Text style={styles.statNumber}>{totalClinics}</Text>
            )}
            <Text style={styles.statLabel}>Total Clinics</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.statBox, { backgroundColor: '#FFF4E6' }]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ApproveClinic')}
          >
            <Ionicons name="time" size={24} color="#FF9500" />
            {loading ? (
              <ActivityIndicator size="small" color="#FF9500" style={{ marginTop: 8 }} />
            ) : (
              <Text style={styles.statNumber}>{pendingClinics}</Text>
            )}
            <Text style={styles.statLabel}>Pending</Text>
          </TouchableOpacity>
        </View>

        {/* Management Options */}
        <View style={styles.optionsContainer}>
          {clinicOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              activeOpacity={0.7}
              onPress={() => handleOptionPress(option.screen)}
            >
              <View style={[styles.iconWrapper, { backgroundColor: option.bgColor }]}>
                <Ionicons name={option.icon} size={32} color={option.color} />
              </View>

              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>

              <View style={styles.arrowContainer}>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </View>

              <View style={[styles.cardAccent, { backgroundColor: option.color }]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Clinics */}
        {!loading && recentClinics.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Recent Clinics</Text>
              <TouchableOpacity onPress={() => navigation.navigate('AllClinics')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {recentClinics.map((clinic) => (
              <View key={clinic.id} style={styles.clinicCard}>
                <View style={[styles.clinicAccent, { backgroundColor: '#6D2ACE' }]} />
                <View style={[styles.clinicIconBox, { backgroundColor: '#EDE5FF' }]}>
                  <Ionicons name="business-outline" size={22} color="#6D2ACE" />
                </View>
                <View style={styles.clinicInfo}>
                  <Text style={styles.clinicName} numberOfLines={1}>{clinic.name}</Text>
                  <Text style={styles.clinicMeta} numberOfLines={1}>
                    {clinic.clinic_type} · {clinic.city || clinic.state || clinic.country}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusBg(clinic.status) }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(clinic.status) }]}>
                    {clinic.status.charAt(0).toUpperCase() + clinic.status.slice(1)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 32,
  },
  headerSection: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  recentSection: {
    marginTop: 28,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6D2ACE',
  },
  clinicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  clinicAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  clinicIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 12,
  },
  clinicInfo: {
    flex: 1,
    marginRight: 8,
  },
  clinicName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  clinicMeta: {
    fontSize: 12,
    color: '#888',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

export default ClinicDashboardScreen;
