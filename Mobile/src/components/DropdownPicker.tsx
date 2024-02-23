import React from 'react';
import { View} from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Props {
  onSelect: (model: any) => void;
  models: any[];
}

const DropdownPicker: React.FC<Props> = ({ onSelect, models }) => {
  return (
    <View>
      <Picker
        selectedValue={null}
        onValueChange={(itemValue) => onSelect(itemValue)}
      >
        {models.map((model) => (
          <Picker.Item key={model.id} label={model.name} value={model} />
        ))}
      </Picker>
    </View>
  );
};

export default DropdownPicker;
