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
import Icon from 'react-native-vector-icons/FontAwesome';

const AddImage: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<
    (ImageOrVideo | {name: string; data: string})[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [base64Images, setBase64Images] = useState<
    {name: string; data: string}[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs camera permission to take pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const selectImages = async () => {
    try {
      const images = await ImagePicker.openPicker({
        multiple: true,
        cropping: true,
      });

      const ExistingImages = [...selectedImages, ...images];
      setSelectedImages(ExistingImages);

      const base64ImagesArray = await Promise.all(
        ExistingImages.map(async image => {
          let filePath = '';
          if ('path' in image) {
            filePath =
              Platform.OS === 'android'
                ? image.path.replace('file://', '')
                : image.path;
          }
          const base64String = await RNFS.readFile(filePath, 'base64');
          const imageName = 'name' in image ? image.name : '';
          return {name: imageName, data: base64String};
        }),
      );
      setBase64Images(base64ImagesArray);
    } catch (error) {
      console.log('Image selection cancelled or failed.', error);
    }
  };

  const captureImage = async () => {
    try {
      const image = await ImagePicker.openCamera({
        cropping: true,
      });

      const filePath =
        Platform.OS === 'android'
          ? image.path.replace('file://', '')
          : image.path;
      const base64String = await RNFS.readFile(filePath, 'base64');

      const newImage = {name: image.filename, data: base64String};

      setSelectedImages(prevSelectedImages => [
        ...prevSelectedImages,
        newImage,
      ]);
      setBase64Images(prevBase64Images => [...prevBase64Images, newImage]);
    } catch (error) {
      console.log('Camera capture failed.', error);
    }
  };

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const uploadImages = async () => {
    await setIsLoading(true);

    if (!base64Images.length || !selectedCategory) {
      Alert.alert('Error', 'Please select at least one image and a category.');
      return;
    }

    try {
      await Promise.all(
        base64Images.map(async image => {
          const formData = new FormData();
          formData.append('category', selectedCategory);
          formData.append('image', image.data);

          const response = await axios.post(
            'https://which-api.cialabs.tech/uploadfiles/',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          );
          console.log('Image uploaded:', image.name, response);
        }),
      );
      Alert.alert('Success', 'Images uploaded successfully!');
    } catch (error) {
      console.error('Error uploading images:', error);
      Alert.alert('Error', 'Failed to upload images. Please try again.');
    }

    setIsLoading(false);
  };

  const getImageSource = (
    image: ImageOrVideo | {name: string; data: string},
  ): string => {
    if ('path' in image) {
      return image.path || '';
    } else {
      return 'data:image/jpeg;base64,' + image.data;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.heading}>Add Images</Text>
        <DropDown onSelect={selectCategory} fetchType="category" />
        <View style={styles.parent}>
          {selectedImages.map((image, index) => (
            <View key={index}>
              <Image
                style={[styles.child, {width: windowWidth / 3.7}]}
                source={{uri: getImageSource(image)}}
                key={index.toString()}
              />
            </View>
          ))}
        </View>
        <View style={styles.imageSelectionContainer}>
          <TouchableOpacity onPress={captureImage} style={styles.captureImage}>
            <Text>
              <Icon name="camera" size={40} color="white" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={selectImages} style={styles.selectImage}>
            <Text>
              <Icon name="plus" size={40} color="white" />
            </Text>
          </TouchableOpacity>
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
  imageSelectionContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  selectImage: {
    flex: 1,
    backgroundColor: '#000000',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center',
    margin: 10,
    padding: 10,
    borderRadius: 12,
  },
  captureImage: {
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
    marginBottom: 10,
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
    padding: 15,
    borderRadius: 12,
  },
});

export default AddImage;
