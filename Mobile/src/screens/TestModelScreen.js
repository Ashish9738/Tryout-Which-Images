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
    <View>
      <DropdownPicker onSelect={handleSelectModel} />
      
      {/* To display the name of selected Model */}
      {/* <Text>Selected Model: {selectedModel ? selectedModel.name : 'None'}</Text> */}
    </View>
  );
};

export default TestModelScreen;
