import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fetchModels } from '../utils/Api';
import { Picker } from '@react-native-picker/picker';

const DropdownPicker = ({ onSelect }) => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    fetchModelData();
  }, []);

  const fetchModelData = async () => {
    try {
      const data = await fetchModels();
      setModels(data);
      if (data.length > 0) {
        setSelectedModel(data[0]); // Set default selected model
        onSelect(data[0]); // Call onSelect with the default selected model
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const handleModelChange = (itemValue) => {
    const selected = models.find(model => model.name === itemValue);
    setSelectedModel(selected);
    onSelect(selected); // Call onSelect with the selected model
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Model:</Text>
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={selectedModel ? selectedModel.name : ''}
          onValueChange={handleModelChange}
          style={styles.dropdown}
        >
          {models.map((model) => (
            <Picker.Item key={model.id} label={model.name} value={model.name} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    overflow: 'hidden', // Hide overflow for rounded corners
  },
  dropdown: {
    height: 40,
    width: '100%',
  },
});

export default DropdownPicker;