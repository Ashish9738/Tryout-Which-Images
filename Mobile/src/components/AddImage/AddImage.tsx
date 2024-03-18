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
import DropDown from '../DropDown/DropDown';

const AddImage: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<ImageOrVideo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [base64images, setBase64Images] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    requestPermissions();
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

  const selectImages = async () => {
    try {
      const images = await ImagePicker.openPicker({
        multiple: true,
        cropping: true,
      });

      setSelectedImages(prevImages => [...prevImages, ...images]);
    } catch (error) {
      console.log('Image selection cancelled or failed.', error);
    }
  };

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const uploadImages = async () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category before uploading images.');
      return;
    }

    if (selectedImages.length === 0) {
      Alert.alert('Error', 'Please select atleast one image to upload.');
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
        <DropDown onSelect={selectCategory} fetchType="category" />
        <TouchableOpacity onPress={selectImages}>
          <Text style={styles.selectImage}>Select Images</Text>
        </TouchableOpacity>
        <View style={styles.parent}>
          {selectedImages.map((image, index) => (
            <View key={index}>
              <Image
                style={[styles.child, {width: windowWidth / 3.7}]}
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
              <ActivityIndicator size="large" color="black" />
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
    backgroundColor: 'white',
    padding: 20,
  },
  selectImage: {
    backgroundColor: '#000000',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    padding: 10,
    borderRadius: 12,
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
  uploadImage: {
    backgroundColor: '#000000',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    padding: 10,
    borderRadius: 12,
  },
});

export default AddImage;
