/**
 * Reports Screen
 */

import React from 'react';
import PlaceholderScreen from '../client/PlaceholderScreen';

const ReportsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <PlaceholderScreen
      navigation={navigation}
      title="Reports"
      icon="bar-chart-outline"
      description="Analytics and business reports"
    />
  );
};

export default ReportsScreen;
