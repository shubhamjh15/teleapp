/**
 * Placeholder Screen Component — Reusable for all menu items
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../common/components/Header';

const { width } = Dimensions.get('window');

interface PlaceholderScreenProps {
  navigation: any;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({
  navigation,
  title,
  icon,
  description,
}) => {
  return (
    <View style={styles.container}>
      <Header
        navigation={navigation}
        userName="Super Admin"
        onNotificationPress={() => console.log('Notifications pressed')}
        onAvatarPress={() => console.log('Avatar pressed')}
      />

      <View style={styles.content}>
        {/* Background Decorative Circles */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        
        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Icon Container with Gradient */}
          <View style={styles.iconWrapper}>
            <LinearGradient
              colors={['#6D2ACE', '#3E82D7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconContainer}
            >
              <Ionicons name={icon} size={72} color="#FFFFFF" />
            </LinearGradient>
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>
          
          {/* Description */}
          <Text style={styles.description}>{description}</Text>

          {/* Coming Soon Badge */}
          <View style={styles.badgeContainer}>
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.badge}
            >
              <Ionicons name="time-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.badgeText}>Coming Soon</Text>
            </LinearGradient>
          </View>

          {/* Feature Preview Cards */}
          <View style={styles.featureCards}>
            <View style={styles.featureCard}>
              <Ionicons name="rocket-outline" size={24} color="#6D2ACE" />
              <Text style={styles.featureText}>Powerful Features</Text>
            </View>
            <View style={styles.featureCard}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#6D2ACE" />
              <Text style={styles.featureText}>Secure & Reliable</Text>
            </View>
            <View style={styles.featureCard}>
              <Ionicons name="speedometer-outline" size={24} color="#6D2ACE" />
              <Text style={styles.featureText}>Fast Performance</Text>
            </View>
          </View>

          {/* Status Message */}
          <View style={styles.statusCard}>
            <Ionicons name="information-circle" size={20} color="#3E82D7" />
            <Text style={styles.statusText}>
              We're working hard to bring you this feature. Stay tuned for updates!
            </Text>
          </View>
        </View>
      </View>
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
    position: 'relative',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(106, 17, 203, 0.05)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -120,
    left: -120,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(37, 117, 252, 0.05)',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 1,
  },
  iconWrapper: {
    marginBottom: 28,
    shadowColor: '#6D2ACE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width * 0.8,
    marginBottom: 24,
  },
  badgeContainer: {
    marginBottom: 32,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  featureCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    minWidth: (width - 72) / 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 8,
    textAlign: 'center',
  },
  statusCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    maxWidth: width * 0.85,
    borderLeftWidth: 4,
    borderLeftColor: '#3E82D7',
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    color: '#1976D2',
    marginLeft: 12,
    lineHeight: 20,
  },
});

export default PlaceholderScreen;
