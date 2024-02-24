import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import DropdownPicker from '../components/DropdownPicker';
import { fetchModels } from '../utils/Api';

const TestModelScreen: React.FC = () => {
  const [pickerVisible, setPickerVisible] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [models, setModels] = useState<any[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    setupWebSocket();
    fetchInitialModelData();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const fetchInitialModelData = async () => {
    try {
      const data = await fetchModels();
      setModels(data);
    } catch (error) {
      console.error('Error fetching initial model data:', error);
    }
  };

  const setupWebSocket = () => {
    const newWs = new WebSocket('ws://192.168.43.47:8082');

    newWs.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    newWs.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setModels(newData);
    };

    newWs.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    newWs.onclose = () => {
      console.log('WebSocket connection closed');
      // Attempt to reconnect after a delay
      setTimeout(setupWebSocket, 3000);
    };

    setWs(newWs);
  };

  const togglePicker = () => {
    setPickerVisible(!pickerVisible);
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
    color: 'black',
  },
});

export default TestModelScreen;
