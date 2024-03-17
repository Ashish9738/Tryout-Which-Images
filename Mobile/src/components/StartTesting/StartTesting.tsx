import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Alert,
  Image,
  Platform,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import axios from 'axios';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';
import DropDown from '../DropDown/DropDown';
import {api} from '../../utils/Api';
import Feedback from '../Feedback/Feedback';

const StartTesting: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('Choose Model');
  const [apiResults, setApiResults] = useState<any>({});
  const [selectedImages, setSelectedImages] = useState<ImageOrVideo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiResultsLoaded, setApiResultsLoaded] = useState<boolean>(false);
  const [fetchMetadata, setFetchMetadata] = useState<any>({});

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
    } catch (error) {
      console.log('Image selection cancelled or failed.', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedModel === 'Choose Model') {
        Alert.alert('Error', 'Please select a model before submitting.');
        return;
      }

      if (!selectedImages || selectedImages.length === 0) {
        Alert.alert('Error', 'Please select an image before submitting.');
        return;
      }

      setIsLoading(true);

      const formData = new FormData();
      const image = selectedImages[0];

      formData.append('file', {
        uri: image.path,
        type: image.mime,
        name: image.filename || 'image.jpg',
      });

      const fileResponse = await axios.post(`${api}/test_model_v2`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const {data} = fileResponse;
      console.log(data);

      if (data && !data.error) {
        setApiResults(data);

        const formDataKey = new FormData();
        const image = selectedImages[0];

        formDataKey.append('image', {
          uri: image.path,
          type: image.mime,
          name: image.filename || 'image.jpg',
        });

        const response = await axios.post(`${api}/key`, formDataKey, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const metadata = response.data;
        setFetchMetadata(metadata);
        setApiResultsLoaded(true);
      } else {
        Alert.alert(
          'Error',
          data.error || 'Failed to submit test. Please try again.',
        );
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error submitting test:', error);
      Alert.alert('Error', 'Failed to submit test. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <DropDown onSelect={setSelectedModel} fetchType="model" />
      <TouchableOpacity onPress={selectImages} style={styles.customButton}>
        <Text style={styles.customButtonText}>Choose Image</Text>
      </TouchableOpacity>
      <View style={styles.photo}>
        {selectedImages.map((image, index) => (
          <View key={index}>
            <Image
              source={{uri: image.path}}
              style={{width: 110, height: 110, margin: 5}}
            />
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>SUBMIT TEST</Text>
      </TouchableOpacity>

      {apiResultsLoaded && (
        <View style={styles.container}>
          <Text style={styles.header}>Image Metadata</Text>
          <Text style={styles.imageMetadata}>Image key : {fetchMetadata}</Text>
        </View>
      )}

      {apiResultsLoaded && (
        <View style={styles.container}>
          <Text style={styles.header}>API Results</Text>
          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={[styles.cell, styles.headerCell]}>Parameter</Text>
              <Text style={[styles.cell, styles.headerCell]}>Value</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.cell}>isElephant</Text>
              <Text style={styles.cell}>{apiResults}</Text>
            </View>
          </View>
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator size="large" color="black" />
      ) : apiResultsLoaded ? (
        <Feedback
          model={selectedModel}
          imageKey={fetchMetadata}
          apiResponse={apiResults}
        />
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  photo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
    margin: 0,
  },
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  header: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 18,
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: 'black',
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginBottom: 20,
    marginTop: 15,
  },
  table: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    overflow: 'hidden',
    minWidth: '100%',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  headerCell: {
    backgroundColor: 'black',
    color: 'white',
    fontWeight: 'bold',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  customButton: {
    backgroundColor: 'black',
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginBottom: 15,
  },
  customButtonText: {
    color: 'white',
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageMetadata: {
    color: 'black',
    backgroundColor: 'lightgray',
    padding: 10,
  },
});

export default StartTesting;
