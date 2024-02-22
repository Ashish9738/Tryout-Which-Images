// TestModelScreen.js
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import DropdownPicker from '../components/DropdownPicker';

const TestModelScreen = () => {
  const [selectedModel, setSelectedModel] = useState(null);

  const handleSelectModel = (model) => {
    setSelectedModel(model);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Selected Model: {selectedModel ? selectedModel.name : 'None'}</Text>
      <DropdownPicker onSelect={handleSelectModel} />
    </View>
  );
};

export default TestModelScreen;
