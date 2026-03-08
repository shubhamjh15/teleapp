/**
 * Clinician Main Navigator
 *
 * Stack navigator for clinician post-authentication screens.
 * Includes all portal screens: Dashboard, Consultation, Report, etc.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ClinicianMainStackParamList } from './types';

import { ClinicianDashboardScreen }     from '../clinician/ClinicianDashboardScreen';
import { ClinicianSessionsScreen }      from '../clinician/ClinicianSessionsScreen';
import { ClinicianConsultationScreen }  from '../clinician/ClinicianConsultationScreen';
import { ClinicianReportScreen }        from '../clinician/ClinicianReportScreen';
import { ClinicianReportPreviewScreen } from '../clinician/ClinicianReportPreviewScreen';
import { ClinicianScheduleScreen }      from '../clinician/ClinicianScheduleScreen';
import { ClinicianAppointmentsScreen }  from '../clinician/ClinicianAppointmentsScreen';
import { ClinicianPatientsScreen }      from '../clinician/ClinicianPatientsScreen';
import { ClinicianPaymentsScreen }      from '../clinician/ClinicianPaymentsScreen';
import { ClinicianMessagesScreen }      from '../clinician/ClinicianMessagesScreen';
import { ClinicianProductsScreen }      from '../clinician/ClinicianProductsScreen';
import { ClinicianSettingsScreen }      from '../clinician/ClinicianSettingsScreen';
import ClinicianReportsScreen from '../clinician/ClinicianReportsScreen';

const Stack = createNativeStackNavigator<ClinicianMainStackParamList>();

export const ClinicianMainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F8FAFC' },
        animation: 'slide_from_right',
      }}
    >
      {/* ── Core ── */}
      <Stack.Screen name="ClinicianDashboard"    component={ClinicianDashboardScreen}    />

      {/* ── Clinical ── */}
      <Stack.Screen name="ClinicianReport"       component={ClinicianReportScreen}       />
      <Stack.Screen name="ClinicianReportPreview" component={ClinicianReportPreviewScreen} options={{ animation: 'fade' }} />

      {/* ── Sidebar destinations ── */}
      <Stack.Screen name="ClinicianSchedule"     component={ClinicianScheduleScreen}     />
      <Stack.Screen name="ClinicianAppointments" component={ClinicianAppointmentsScreen} />
      <Stack.Screen name="ClinicianPatients"     component={ClinicianPatientsScreen}     />
      <Stack.Screen name="ClinicianPayments"     component={ClinicianPaymentsScreen}     />
      <Stack.Screen name="ClinicianMessages"     component={ClinicianMessagesScreen}     />
      <Stack.Screen name="ClinicianProducts"     component={ClinicianProductsScreen}     />
      <Stack.Screen name="ClinicianSettings" component={ClinicianSettingsScreen} />
      <Stack.Screen name="ClinicianSessions" component={ClinicianSessionsScreen} />
      <Stack.Screen name="ClinicianConsultation" component={ClinicianConsultationScreen} />
      <Stack.Screen name="ClinicianReports" component={ClinicianReportsScreen} />
    </Stack.Navigator>
  );
};

export default ClinicianMainNavigator;
