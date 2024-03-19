import React, {useState, useEffect, useRef} from 'react';
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
import DropDown from '../DropDown/DropDown';
import {api} from '../../utils/Api';
import Feedback from '../Feedback/Feedback';
import Icon from 'react-native-vector-icons/FontAwesome';

const StartTesting: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('Choose Model');
  const [apiResults, setApiResults] = useState<any>({});
  const [selectedImages, setSelectedImages] = useState<ImageOrVideo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiResultsLoaded, setApiResultsLoaded] = useState<boolean>(false);
  const [fetchMetadata, setFetchMetadata] = useState<any>({});
  const [questions, setQuestions] = useState<string[]>([]);
  const [questionsLoaded, setQuestionsLoaded] = useState<boolean>(false);
  const dropDownRef = useRef<any>(null);

  useEffect(() => {
    requestPermissions();
    fetchQuestions();
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

      if (images.length > 1) {
        Alert.alert('Error', 'Please select a single image for testing.');
        return;
      }

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

      const {apiResult, imageKey, error} = fileResponse.data;

      if (!error) {
        setApiResults(apiResult);
        setFetchMetadata(imageKey);
        setApiResultsLoaded(true);
        Alert.alert('Success', 'Test submitted successfully!');
      } else {
        Alert.alert(
          'Error',
          error || 'Failed to submit test. Please try again.',
        );
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error submitting test:', error);
      Alert.alert('Error', 'Failed to submit test. Please try again.');
      setIsLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${api}/metadata?query=question`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setQuestions(data);
        setQuestionsLoaded(true);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleFeedbackSubmit = () => {
    setSelectedImages([]);
    setApiResults({});
    setApiResultsLoaded(false);
    setFetchMetadata({});
    setSelectedModel('Choose Model');

    if (dropDownRef.current) {
      dropDownRef.current.forceUpdate();
    }
  };

  const apiResultsString = JSON.stringify(apiResults);
  const formattedApiResults = apiResultsString.replace(/"/g, '');

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <Text style={styles.heading}>Test the Model</Text>
      <DropDown
        key={selectedModel}
        onSelect={setSelectedModel}
        fetchType="model"
      />
      <TouchableOpacity onPress={selectImages} style={styles.customButton}>
        <Text style={styles.customButtonText}>
          <Icon name="plus" size={40} color="white" />
        </Text>
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
        <Text style={styles.submitButtonText}>Submit Test</Text>
      </TouchableOpacity>

      {apiResultsLoaded && questionsLoaded && (
        <>
          <View style={styles.container}>
            <Text style={styles.header}>API Results</Text>
            <View style={styles.table}>
              <View style={styles.row}>
                <Text style={[styles.cell, styles.headerCell]}>Parameter</Text>
                <Text style={[styles.cell, styles.headerCell]}>Value</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.cell}>isElephant</Text>
                <Text style={styles.cell}>{formattedApiResults}</Text>
              </View>
            </View>
          </View>

          <Feedback
            model={selectedModel}
            imageKey={
              Object.keys(fetchMetadata).length > 0 ? fetchMetadata : undefined
            }
            apiResponse={
              Object.keys(apiResults).length > 0 ? apiResults : undefined
            }
            onFeedbackSubmit={handleFeedbackSubmit}
          />
        </>
      )}

      {isLoading && <ActivityIndicator size="large" color="black" />}
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
  heading: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 46,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    marginRight: 8,
    marginLeft: 5,
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
    color: 'black',
    fontWeight: '500',
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
    padding: 2,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  customButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
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
    padding: 15,
    borderRadius: 5,
  },
});

export default StartTesting;
