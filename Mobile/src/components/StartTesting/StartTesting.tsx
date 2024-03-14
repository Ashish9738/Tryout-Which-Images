import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  Image,
  Platform,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  ActivityIndicator, // Import ActivityIndicator for loading indicator
} from 'react-native';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import axios from 'axios';
import {RadioButton} from 'react-native-paper';
import * as RNFS from 'react-native-fs';
import {TouchableOpacity} from 'react-native-gesture-handler';
import DropDown from '../DropDown/DropDown';
import {api} from '../../utils/Api';
import Feedback from '../Feedback/Feedback';

const StartTesting: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('Choose Model');
  const [apiResults, setApiResults] = useState<any>({});
  const [feedback, setFeedback] = useState<boolean[]>([false, false]);
  const [selectedImages, setSelectedImages] = useState<ImageOrVideo[]>([]);
  const [base64images, setBase64Images] = useState<string[]>([]);
  const [metadataResults, setMetadataResults] = useState(null);
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] =
    useState<boolean>(false);
  const [question1Answer, setQuestion1Answer] = useState<string>('');
  const [question2Answer, setQuestion2Answer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading indicator
  const [apiResultsLoaded, setApiResultsLoaded] = useState<boolean>(false); // State to track if API results are loaded

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

  const submitFeedback = async () => {
    try {
      await axios.post(`${api}/feedback`, {
        modelName: 'Elephant Model',
        imageKey: `${apiResults.metadata_id}`,
        qa: [
          {
            questionID: '1',
            answer: `${question1Answer}`,
          },
          {
            questionID: '2',
            answer: `${question2Answer}`,
          },
        ],
      });
      setIsFeedbackSubmitted(true);
      console.log('feedback added succesfully');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
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

      setIsLoading(true); // Show loading indicator

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

      setApiResults(fileResponse.data);
      setIsLoading(false);
      setApiResultsLoaded(true);
    } catch (error) {
      console.error('Error submitting test:', error);
      Alert.alert('Error', 'Failed to submit test. Please try again.');
      setIsLoading(false);
    }
  };

  const renderResultsComponent = () => {
    if (apiResults instanceof Promise) {
      return <ActivityIndicator size="large" color="black" />;
    }

    if (apiResults && apiResults.error) {
      return (
        <View style={styles.container}>
          <Text style={styles.error}>Error: {apiResults.error}</Text>
        </View>
      );
    }

    if (
      Object.keys(apiResults).length === 0 &&
      apiResults.constructor === Object
    ) {
      return null;
    }

    return (
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
    );
  };

  return (
    <ScrollView contentContainerStyle={{padding: 20}}>
      <DropDown onSelect={model => setSelectedModel(model)} />
      <Button title="Choose Image" onPress={selectImages} />
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

      <TouchableOpacity onPress={handleSubmit}>
        <Text
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 5,
            height: 35,
            backgroundColor: 'black',
            color: 'white',
            textAlign: 'center',
            fontSize: 17,
          }}>
          SUBMIT TEST
        </Text>
      </TouchableOpacity>

      {isLoading ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        renderResultsComponent()
      )}

      {apiResultsLoaded && <Feedback />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  photo: {
    flex: 1,
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
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
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
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default StartTesting;
