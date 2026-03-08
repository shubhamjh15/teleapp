/**
 * Custom Drawer Content — Side menu with navigation items
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

interface MenuItem {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const menuItems: MenuItem[] = [
  { name: 'Home', label: 'Home', icon: 'home-outline' },
  { name: 'Onboard', label: 'Onboard', icon: 'person-add-outline' },
  { name: 'Configurations', label: 'Configurations', icon: 'settings-outline' },
  { name: 'Reports', label: 'Reports', icon: 'bar-chart-outline' },
  { name: 'BusinessAssistant', label: 'Business Assistant', icon: 'briefcase-outline' },
  { name: 'Settings', label: 'Settings', icon: 'cog-outline' },
];

interface CustomDrawerProps extends DrawerContentComponentProps {
  onLogout?: () => void;
}

const CustomDrawerContent: React.FC<CustomDrawerProps> = (props) => {
  const { state, navigation, onLogout } = props;
  const activeRoute = state.routeNames[state.index];

  return (
    <View style={styles.container}>
      {/* Drawer Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="medical-outline" size={40} color="#FFFFFF" />
        </View>
        <Text style={styles.headerTitle}>HealthScan360</Text>
        <Text style={styles.headerSubtitle}>Healthcare Management</Text>
      </View>

      {/* Menu Items */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {menuItems.map((item) => {
          const isActive = activeRoute === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => navigation.navigate(item.name)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={isActive ? '#6D2ACE' : '#666'}
                />
              </View>
              <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                {item.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </DrawerContentScrollView>

      {/* Drawer Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.logoutButton} 
          activeOpacity={0.7}
          onPress={onLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: '#6D2ACE',
    alignItems: 'center',
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 12,
    marginBottom: 6,
    borderRadius: 12,
    position: 'relative',
  },
  menuItemActive: {
    backgroundColor: '#EDE5FF',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconContainerActive: {
    backgroundColor: '#FFFFFF',
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  menuLabelActive: {
    color: '#6D2ACE',
    fontWeight: '700',
  },
  activeIndicator: {
    width: 4,
    height: 24,
    backgroundColor: '#6D2ACE',
    borderRadius: 2,
    position: 'absolute',
    right: 0,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF5F5',
    borderRadius: 10,
    marginBottom: 12,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 10,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default CustomDrawerContent;
