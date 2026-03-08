/**
 * Business Assistant Screen
 */

import React from 'react';
import PlaceholderScreen from '../client/PlaceholderScreen';

const BusinessAssistantScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <PlaceholderScreen
      navigation={navigation}
      title="Business Assistant"
      icon="briefcase-outline"
      description="AI-powered business insights and recommendations"
    />
  );
};

export default BusinessAssistantScreen;
