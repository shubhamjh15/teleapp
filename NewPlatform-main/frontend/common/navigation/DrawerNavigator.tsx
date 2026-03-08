/**
 * Drawer Navigator — Main navigation structure with side drawer menu
 */

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../components/CustomDrawerContent';

// Screens
import HomeScreen from '../../client/HomeScreen';
import OnboardScreen from '../../client/OnboardScreen';
import ConfigurationsScreen from '../../superadmin/ConfigurationsScreen';
import ReportsScreen from '../../clinician/ReportsScreen';
import BusinessAssistantScreen from '../../clinician/BusinessAssistantScreen';
import SettingsScreen from '../../client/SettingsScreen';
import ClinicianAdminManagementScreen from '../../superadmin/ClinicianAdminManagementScreen';
import ClinicianManagementScreen from '../../superadmin/ClinicianManagementScreen';

// Stack Navigators
import ClinicStackNavigator from './ClinicStackNavigator';

const Drawer = createDrawerNavigator();

interface DrawerNavigatorProps {
  onLogout: () => void;
}

const DrawerNavigator: React.FC<DrawerNavigatorProps> = ({ onLogout }) => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} onLogout={onLogout} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        drawerStyle: {
          width: 280,
        },
        swipeEnabled: true,
        swipeEdgeWidth: 50,
      }}
      initialRouteName="Home"
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
        }}
      />
      <Drawer.Screen
        name="Onboard"
        component={OnboardScreen}
        options={{
          title: 'Onboard',
        }}
      />
      <Drawer.Screen
        name="ClinicManagement"
        component={ClinicStackNavigator}
        options={{
          title: 'Clinic Management',
        }}
      />
      <Drawer.Screen
        name="Configurations"
        component={ConfigurationsScreen}
        options={{
          title: 'Configurations',
        }}
      />
      <Drawer.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          title: 'Reports',
        }}
      />
      <Drawer.Screen
        name="BusinessAssistant"
        component={BusinessAssistantScreen}
        options={{
          title: 'Business Assistant',
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
      <Drawer.Screen
        name="ClinicianAdminManagement"
        component={ClinicianAdminManagementScreen}
        options={{
          title: 'Clinician Admins',
        }}
      />
      <Drawer.Screen
        name="ClinicianManagement"
        component={ClinicianManagementScreen}
        options={{
          title: 'Clinicians',
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
