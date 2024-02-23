import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native'; // Import StyleSheet for styling
import DropdownPicker from '../components/DropdownPicker';
import { fetchModels } from '../utils/Api';

const TestModelScreen: React.FC = () => {
  const [pickerVisible, setPickerVisible] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [models, setModels] = useState<any[]>([]);

  useEffect(() => {
    fetchInitialModelData();
  }, []);

  const fetchInitialModelData = async () => {
    try {
      const data = await fetchModels();
      setModels(data);
    } catch (error) {
      console.error('Error fetching initial model data:', error);
    }
  };

  const togglePicker = async () => {
    setPickerVisible(!pickerVisible);
    if (!pickerVisible) {
      try {
        // Fetches the Updated data 
        const newData = await fetchModels();
        setModels(newData);
      } catch (error) {
        console.error('Error fetching updated model data:', error);
      }
    }
  };

  const handleSelectModel = (model: any) => {
    setSelectedModel(model);
    togglePicker();
  };

  return (
    <View>
      <Button title="Select Model" onPress={togglePicker} />
      {pickerVisible && (
        <DropdownPicker
          onSelect={handleSelectModel}
          models={models}
        />
      )}
      
      {/* To display the name of selected Model */}
      <Text style={styles.selectedModel}>
        Selected Model: {selectedModel ? selectedModel.name : 'None'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  selectedModel: {
    fontSize: 18, 
    textAlign: 'center', 
    marginTop: 10,
    color: 'black' 
  },
});

export default TestModelScreen;
