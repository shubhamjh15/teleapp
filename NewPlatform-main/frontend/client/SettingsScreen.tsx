/**
 * Settings Screen
 */

import React from 'react';
import PlaceholderScreen from './PlaceholderScreen';

const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <PlaceholderScreen
      navigation={navigation}
      title="Settings"
      icon="cog-outline"
      description="App settings and user preferences"
    />
  );
};

export default SettingsScreen;
