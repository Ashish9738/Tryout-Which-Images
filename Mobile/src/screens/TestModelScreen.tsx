import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';

interface Props {
  onSelect: (model: any) => void;
  models: any[];
}

const TestModelScreen: React.FC<Props> = ({onSelect, models}) => {
  if (!models || models.length === 0) {
    return (
      <View>
        <Text>No models available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={null}
        onValueChange={(itemValue: any) => onSelect(itemValue)}
        style={styles.picker}>
        <Picker.Item label="Select the Model" value={null} />
        {models.map(model => (
          <Picker.Item key={model} label={model} value={model} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    paddingBottom: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'black',
    fontSize: 20,
    fontWeight: '900',
  },
});

export default TestModelScreen;
