import React, {useState, useEffect} from 'react';
import {
  Button,
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
import ModalSelector from 'react-native-modal-selector';
import * as RNFS from 'react-native-fs';

const AddImage: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<ImageOrVideo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [base64images, setBase64Images] = useState<string[]>([]);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const category: {key: string; label: string}[] = [
    {key: 'cat1', label: 'cat1'},
    {key: 'cat2', label: 'cat2'},
    {key: 'cat3', label: 'cat3'},
  ];

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

  const selectCategory = (option: {key: string; label: string}) => {
    setSelectedCategory(option.key);
    if (selectedImages.length > 0) {
      uploadImages();
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const uploadImages = async () => {
    if (!selectedCategory || selectedImages.length === 0) {
      Alert.alert('Error', 'Please select at least one image and a category.');
      return;
    }

    await setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('category', selectedCategory);

      // Append each base64 image to FormData
      base64images.forEach((base64Image, index) => {
        formData.append('image', base64Image);
      });

      // Send POST request with FormData
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

    await setIsLoading(false);
  };

  return (
    <ScrollView>
      <View style={[{width: windowWidth}]}>
        <Text style={styles.heading}>Add Images</Text>
        <Button onPress={selectImages} title="Select Images" color="black" />

        <View style={styles.parent}>
          {selectedImages.map((image, index) => (
            <View key={index}>
              <Image
                style={[styles.child, {width: windowWidth / 3.2}]}
                source={{uri: image.path}}
              />
            </View>
          ))}
        </View>

        <ModalSelector
          data={category}
          initValueTextStyle={{fontWeight: 'bold', color: 'black'}}
          initValue="Select Category"
          accessible={true}
          onChange={selectCategory}
          selectStyle={{borderWidth: 10}}
          cancelStyle={{borderWidth: 10}}
        />

        <TouchableOpacity onPress={uploadImages}>
          <Text style={styles.loadingContainer}>Upload Images</Text>
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
  loadingContainer: {
    backgroundColor: 'blue',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    padding: 10,
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
    width: '100%',
    margin: 10,
    marginLeft: 70,
    fontSize: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddImage;
