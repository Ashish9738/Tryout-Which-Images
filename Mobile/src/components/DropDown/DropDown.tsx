import React, {useState, useEffect} from 'react';
import {View, Button, Text, StyleSheet} from 'react-native';
import TestModelScreen from '../../screens/TestModelScreen';
import {fetchModels} from '../../utils/Api';

const DropDown: React.FC = () => {
  const [pickerVisible, setPickerVisible] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [models, setModels] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [initialDataFetched, setInitialDataFetched] = useState<boolean>(false);

  const fetchInitialModelData = async () => {
    try {
      const data = await fetchModels();
      console.log(data);
      setModels(data);
      setInitialDataFetched(true); // Update the state indicating initial data fetched
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching initial model data:', error);
        setError(`Error fetching models: ${error.message}`);
      } else {
        console.error('Unknown error fetching initial model data:', error);
        setError('Unknown error fetching models. Please try again.');
      }
    }
  };

  const togglePicker = () => {
    setPickerVisible(!pickerVisible);
  };

  const handleSelectModel = (model: any) => {
    setSelectedModel(model);
    togglePicker();
  };

  useEffect(() => {
    if (!initialDataFetched) {
      fetchInitialModelData();
    }
  }, [initialDataFetched]);

  return (
    <View>
      <View style={styles.buttonContainer}>
        <Button title="Select Model" onPress={togglePicker} />
      </View>
      {pickerVisible && (
        <TestModelScreen onSelect={handleSelectModel} models={models} />
      )}

      {/* To display the Model which is been selected */}
      <Text style={styles.selectedModel}>
        Selected Model: {selectedModel ? selectedModel.name : 'None'}
      </Text>

      {/* Display error message if there's an error */}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  selectedModel: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
    color: 'black',
  },
  buttonContainer: {
    height: 40,
    width: 370,
    marginRight: 10,
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default DropDown;
