// TestModelScreen.js
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import DropdownPicker from '../components/DropdownPicker';

const TestModelScreen = () => {
  const handleSelectModel = (model) => {
    setSelectedModel(model);
  };

  return (
    <View>
      <DropdownPicker onSelect={handleSelectModel} />
    </View>
  );
};

export default TestModelScreen;
