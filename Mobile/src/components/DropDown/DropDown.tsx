import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {fetchCategory, fetchModels} from '../../utils/Api';

interface Props {
  onSelect: (model: any) => void;
  fetchType: 'category' | 'model'; 
}

const DropDown: React.FC<Props> = ({onSelect, fetchType}) => {
  const [options, setOptions] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fetchType === 'category') {
      fetchCategories();
    } else if (fetchType === 'model') {
      fetchModelsData();
    }
  }, [fetchType]);

  const fetchCategories = async () => {
    try {
      const data = await fetchCategory();
      setOptions(data);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchModelsData = async () => {
    try {
      const data = await fetchModels();
      setOptions(data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: any) => {
    if (error instanceof Error) {
      setError(`Error fetching data: ${error.message}`);
    } else {
      setError('Unknown error fetching data. Please try again.');
    }
  };

  return (
    <View>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <View style={styles.container}>
          <Picker
            selectedValue={selectedOption}
            onValueChange={(itemValue: any) => {
              setSelectedOption(itemValue);
              onSelect(itemValue);
            }}
            style={styles.picker}>
            <Picker.Item label={`Select ${fetchType}`} value={null} />
            {options.map((option, index) => (
              <Picker.Item
                key={index}
                label={option}
                value={option}
                style={styles.pickerItem}
              />
            ))}
          </Picker>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    color: 'black',
    fontWeight: 'bold',
  },
  pickerItem: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default DropDown;
