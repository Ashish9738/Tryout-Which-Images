import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {api} from '../../utils/Api'; 

interface ImageData {
  name: string;
  data: string;
}

const RetrieveImage: React.FC = () => {
  const [category, setSelectedCategory] = useState<string | null>(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const navigation = useNavigation();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${api}/select_option?query=category`);
      setOptions(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setShowDropdown(false);
  };

  const openTab = (photo: string) => {
    try {
      navigation.navigate('OpenImage', {
        photoUri: `data:image/jpeg;base64,${photo}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchImages = async () => {
    if (!category) {
      Alert.alert('Error', 'Please select a category first.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://which-api.cialabs.tech/get_images/${category}`,
      );

      if (!Array.isArray(response.data)) {
        Alert.alert('Error', 'Invalid image data received from the server.');
        setIsLoading(false);
        return;
      }

      const base64Images: string[] = response.data;

      const imageDataList: ImageData[] = base64Images.map(
        (imageString: string, index: number) => ({
          name: `Image ${index + 1}`,
          data: imageString,
        }),
      );

      setImages(imageDataList);
    } catch (error) {
      console.error('Error retrieving images:', error);
      Alert.alert('Error', 'Failed to retrieve images. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{width: windowWidth, height: windowHeight}}>
        <Text style={styles.heading}>Retrieve Image</Text>

        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowDropdown(!showDropdown)}>
            <Text style={styles.dropdownButtonText}>
              {category ? category : 'Select Category'}
            </Text>
          </TouchableOpacity>
          {showDropdown && (
            <View style={styles.dropdown}>
              {options.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => selectCategory(item)}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity onPress={fetchImages}>
          <Text style={styles.loadingContainer}>Retrieve Image</Text>
          {isLoading && (
            <View>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.parent}>
          {images.map((itemm, index) => (
            <View key={index}>
              <TouchableOpacity
                onPress={() => {
                  openTab(itemm.data);
                }}>
                <Image
                  style={[styles.child, {width: windowWidth / 3.2}]}
                  source={{uri: `data:image/jpeg;base64,${itemm.data}`}}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#586f7c',
    padding: 20,
  },
  loadingContainer: {
    backgroundColor: 'black',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    borderRadius: 5,
    paddingRight: 40,
  },
  parent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: -5,
    marginTop: 10,
  },
  child: {
    aspectRatio: 1,
    margin: 5,
  },
  dropdownContainer: {
    backgroundColor: 'lightgray',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  dropdownButton: {
    backgroundColor: 'lightgray',
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
    paddingRight: 45,
  },
  dropdownButtonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: 'lightgray',
    marginTop: 5,
    borderRadius: 5,
  },
  dropdownItem: {
    backgroundColor: 'lightgray',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 3,
    alignItems: 'center',
    paddingRight: 48,
  },
  heading: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 50,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    marginRight: 30,
  },
});

export default RetrieveImage;
