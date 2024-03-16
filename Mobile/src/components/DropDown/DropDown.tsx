import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import TestModelScreen from '../../screens/TestModelScreen';
import {fetchModels} from '../../utils/Api';

interface Props {
  onSelect: (model: any) => void;
}

const DropDown: React.FC<Props> = ({onSelect}) => {
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
      setInitialDataFetched(true);
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
    onSelect(model);
    togglePicker();
  };

  useEffect(() => {
    if (!initialDataFetched) {
      fetchInitialModelData();
    }
  }, [initialDataFetched]);

  return (
    <View>
      <TouchableOpacity style={styles.buttonContainer} onPress={togglePicker}>
        <Text style={styles.buttonText}>Select Model</Text>
      </TouchableOpacity>
      {pickerVisible && (
        <TestModelScreen onSelect={handleSelectModel} models={models} />
      )}

      {/* To display the Model which is been selected */}
      <Text style={styles.selectedModel}>
        Selected Model: {selectedModel ? selectedModel : 'None'}
      </Text>

      {/* Display error message if there's an error */}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  selectedModel: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
    color: 'black',
  },
  buttonContainer: {
    height: 50,
    width: 370,
    marginBottom: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 19,
    color: 'white',
    fontWeight: '400',
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default DropDown;
