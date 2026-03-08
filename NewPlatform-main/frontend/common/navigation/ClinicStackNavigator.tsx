/**
 * Clinic Stack Navigator — Navigation structure for clinic management screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import ClinicDashboardScreen from '../../clinicianadmin/ClinicDashboardScreen';
import AddClinicScreen from '../../clinicianadmin/AddClinicScreen';
import AssignClinicianAdminScreen from '../../superadmin/AssignClinicianAdminScreen';
import ReviewClinicDetailsScreen from '../../clinicianadmin/ReviewClinicDetailsScreen';
import ApproveClinicScreen from '../../superadmin/ApproveClinicScreen';
import AllClinicsScreen from '../../superadmin/AllClinicsScreen';

const Stack = createNativeStackNavigator();

const ClinicStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName="ClinicDashboard"
    >
      <Stack.Screen
        name="ClinicDashboard"
        component={ClinicDashboardScreen}
        options={{
          title: 'Clinic Management',
        }}
      />
      <Stack.Screen
        name="AddClinic"
        component={AddClinicScreen}
        options={{
          title: 'Onboard Clinic',
        }}
      />
      <Stack.Screen
        name="AssignClinicianAdmin"
        component={AssignClinicianAdminScreen}
        options={{
          title: 'Assign Admin',
        }}
      />
      <Stack.Screen
        name="ReviewClinicDetails"
        component={ReviewClinicDetailsScreen}
        options={{
          title: 'Clinic Details',
        }}
      />
      <Stack.Screen
        name="ApproveClinic"
        component={ApproveClinicScreen}
        options={{
          title: 'Approve Clinic',
        }}
      />
      <Stack.Screen
        name="AllClinics"
        component={AllClinicsScreen}
        options={{
          title: 'All Clinics',
        }}
      />
    </Stack.Navigator>
  );
};

export default ClinicStackNavigator;
