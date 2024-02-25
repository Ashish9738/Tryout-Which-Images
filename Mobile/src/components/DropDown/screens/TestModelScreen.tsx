import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Props {
  onSelect: (model: any) => void;
  models: any[];
}

const TestModelScreen: React.FC<Props> = ({ onSelect, models }) => {
  return (
    <View>
      <Picker
        selectedValue={null}
        onValueChange={(itemValue: any) => onSelect(itemValue)}
      >
        <Picker.Item label="Select the Model" value={null} />
        {models.map((model, index) => (
          <Picker.Item key={index} label={model.names[index.toString()]} value={model} />
        ))}
      </Picker>
    </View>
  );
};

export default TestModelScreen;
