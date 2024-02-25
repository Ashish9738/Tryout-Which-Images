import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Props {
  onSelect: (model: any) => void;
  models: any[];
}

const TestModelScreen: React.FC<Props> = ({ onSelect, models }) => {
  if (!models || !Array.isArray(models)) {
    return <View>No models available</View>;
  }

  return (
    <View>
      <Picker
        selectedValue={null}
        onValueChange={(itemValue: any) => onSelect(itemValue)}
      >
        <Picker.Item label="Select the Model" value={null} />
        {models.map((model) => (
          <Picker.Item key={model.id} label={model.name} value={model} />
        ))}
      </Picker>
    </View>
  );
};

export default TestModelScreen;
