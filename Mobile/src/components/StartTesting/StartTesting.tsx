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
} from 'react-native';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import axios from 'axios';
import {RadioButton} from 'react-native-paper';
import * as RNFS from 'react-native-fs';
import {TouchableOpacity} from 'react-native-gesture-handler';
import DropDown from '../DropDown/DropDown';
import {api} from '../../utils/Api';

const StartTesting: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('Choose Model');
  const [apiResults, setApiResults] = useState<any>({});
  const [feedback, setFeedback] = useState<boolean[]>([false, false]);
  const [selectedImages, setSelectedImages] = useState<ImageOrVideo[]>([]);
  const [base64images, setBase64Images] = useState<string[]>([]);
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] =
    useState<boolean>(false);
  const [question1Answer, setQuestion1Answer] = useState<string>('');
  const [question2Answer, setQuestion2Answer] = useState<string>('');

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

  const handleSubmit = async () => {
    try {
      if (!selectedImages) {
        Alert.alert('Error', 'Please select an image before submitting.');
        return;
      }

      const response = await axios.post(`${api}/metaFeedback`, {
        type: 'type',
        value: 'value',
      });

      setApiResults(response.data);
    } catch (error) {
      console.error('Error submitting test:', error);
      Alert.alert('Error', 'Failed to submit test. Please try again.');
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

  return (
    <ScrollView contentContainerStyle={{padding: 20}}>
      <DropDown />
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

      <View style={{marginTop: 20}}>
        <Text style={{fontWeight: 'bold', marginBottom: 10}}>API Results:</Text>
        <ScrollView horizontal>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 10,
              display: 'flex',
            }}>
            <View style={{flex: 1, marginRight: 5}}>
              <Text style={{fontWeight: 'bold', marginBottom: 5}}>
                Parameter
              </Text>
              {Object.entries(apiResults).map(([key, value], index) => (
                <Text key={index} style={{marginBottom: 5}}>
                  {key}
                </Text>
              ))}
            </View>
            <View style={{flex: 1, marginLeft: 5}}>
              <Text style={{fontWeight: 'bold', marginBottom: 5}}>Value</Text>
              {Object.entries(apiResults).map(([key, value], index) => (
                <Text key={index} style={{marginBottom: 5}}>
                  {typeof value === 'object'
                    ? JSON.stringify(value)
                    : String(value)}
                </Text>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      <ScrollView style={{marginTop: 20}}>
        <Text style={{fontWeight: 'bold'}}>Feedback:</Text>
        <View>
          <Text>Question 1: Did the test result meet your expectations?</Text>
          <RadioButton.Group
            onValueChange={newValue => setQuestion1Answer(newValue)}
            value={question1Answer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RadioButton.Android value="Yes" />
              <Text>Yes</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RadioButton.Android value="No" />
              <Text>No</Text>
            </View>
          </RadioButton.Group>
        </View>
        <View style={{marginTop: 10}}>
          <Text>
            Question 2: Would you recommend this model for further testing?
          </Text>
          <RadioButton.Group
            onValueChange={newValue => setQuestion2Answer(newValue)}
            value={question2Answer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RadioButton.Android value="Yes" />
              <Text>Yes</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RadioButton.Android value="No" />
              <Text>No</Text>
            </View>
          </RadioButton.Group>
        </View>
        <Button
          title="Submit Feedback"
          onPress={submitFeedback}
          disabled={!question1Answer || !question2Answer}
          color="black"
        />
        {isFeedbackSubmitted && (
          <Text style={{color: 'green', marginTop: 10}}>
            Feedback submitted successfully!
          </Text>
        )}
      </ScrollView>
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
});
export default StartTesting;
