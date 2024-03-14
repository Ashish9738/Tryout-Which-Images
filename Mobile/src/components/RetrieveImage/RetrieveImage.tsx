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

interface ImageData {
  name: string;
  data: string;
}

const RetrieveImage: React.FC = () => {
  const [category, setSelectedCategory] = useState<string | null>(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const navigation = useNavigation();
  const categories: {key: string; label: string}[] = [
    {key: 'cat1', label: 'Category1'},
    {key: 'cat2', label: 'Category2'},
    {key: 'cat3', label: 'Category3'},
  ];

  const selectCategory = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
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
        setIsLoading(false); // Stop loading indicator
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
              {categories.map(item => (
                <TouchableOpacity
                  key={item.key}
                  style={styles.dropdownItem}
                  onPress={() => selectCategory(item.label)}>
                  <Text>{item.label}</Text>
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
