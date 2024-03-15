import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  Alert,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import axios from 'axios';
import * as RNFS from 'react-native-fs';
import {api} from '../../utils/Api';

const AddImage: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<ImageOrVideo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [base64images, setBase64Images] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    requestPermissions();
    fetchCategories();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grantedCamera = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs camera permission to take pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (grantedCamera === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permissions granted');
        } else {
          console.log('Camera permissions denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${api}/select_option?query=category`);
      const responseData = await response.json();
      setOptions(responseData);
      console.log('Fetched categories:', responseData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const selectCategory = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    setShowDropdown(false);
  };

  const selectImages = async () => {
    try {
      const images = await ImagePicker.openPicker({
        multiple: true,
        cropping: true,
      });
      setSelectedImages(images);

      const base64ImagesArray = await Promise.all(
        images.map(async image => {
          const filePath =
            Platform.OS === 'android'
              ? image.path.replace('file://', '')
              : image.path;
          return await RNFS.readFile(filePath, 'base64');
        }),
      );
      setBase64Images(base64ImagesArray);
    } catch (error) {
      console.log('Image selection cancelled or failed.', error);
    }
  };

  const uploadImages = async () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category before uploading images.');
      return;
    }

    if (selectedImages.length === 0) {
      Alert.alert('Error', 'Please select at least one image to upload.');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('category', selectedCategory);

      base64images.forEach((base64Image, index) => {
        formData.append('image', base64Image);
      });

      const response = await axios.post(
        'https://which-api.cialabs.tech/uploadfiles/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('Images uploaded', response);
      Alert.alert('Success', 'Images uploaded successfully!');
    } catch (error) {
      console.error('Error uploading images:', error);
      Alert.alert('Error', 'Failed to upload images. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.heading}>Add Images</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowDropdown(!showDropdown)}>
          <Text style={styles.dropdownButtonText}>
            {selectedCategory ? selectedCategory : 'Select Category'}
          </Text>
        </TouchableOpacity>

        {showDropdown && (
          <View style={styles.dropdownContainer}>
            {options.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => selectCategory(category)}>
                <Text>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity onPress={selectImages}>
          <Text style={styles.loadingContainer}>Select Images</Text>
        </TouchableOpacity>

        <View style={styles.parent}>
          {selectedImages.map((image, index) => (
            <View key={index}>
              <Image
                style={[styles.child, {width: windowWidth / 3.2}]}
                source={{uri: image.path}}
                key={index.toString()}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={uploadImages}>
          <Text style={styles.uploadImage}>Upload Images</Text>
          {isLoading && (
            <View>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#586f7c',
    padding: 20,
  },
  loadingContainer: {
    backgroundColor: '#000000',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  parent: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'flex-start',
  },
  child: {
    aspectRatio: 1,
    margin: 2,
  },
  heading: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 50,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  dropdownButton: {
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'lightgray',
    padding: 15,
    marginTop: 10,
    borderRadius: 5,
  },
  dropdownButtonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'lightgray',
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
  },
  dropdownItem: {
    color: 'black',
    fontWeight: '900',
    backgroundColor: 'lightgray',
    padding: 10,
    marginTop: 3,
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadImage: {
    backgroundColor: '#000000',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
});

export default AddImage;
