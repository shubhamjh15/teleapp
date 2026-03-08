/**
 * Configurations Screen
 */

import React from 'react';
import PlaceholderScreen from '../client/PlaceholderScreen';

const ConfigurationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <PlaceholderScreen
      navigation={navigation}
      title="Configurations"
      icon="settings-outline"
      description="System configurations and preferences"
    />
  );
};

export default ConfigurationsScreen;
