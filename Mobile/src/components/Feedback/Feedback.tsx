import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {api} from '../../utils/Api';
import {white} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

interface FeedbackProps {
  model: string;
  imageKey: string;
  apiResponse: string;
}

const Feedback: React.FC<FeedbackProps> = ({model, imageKey, apiResponse}) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${api}/metadata?query=question`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setQuestions(data);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleOptionChange = (questionIndex: number, option: string) => {
    setSelectedOptions(prevState => ({
      ...prevState,
      [questionIndex]: option,
    }));
  };

  const submitFeedback = async () => {
    try {
      if (Object.keys(selectedOptions).length !== 2) {
        Alert.alert('Error', 'Please answer both questions before submitting.');
        return;
      }

      const response = await fetch(`${api}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelName: model,
          imageKey: imageKey,
          apiResponse: apiResponse,
          qa: [
            {
              questionID: questions[0],
              answer: selectedOptions[0],
            },
            {
              questionID: questions[1],
              answer: selectedOptions[1],
            },
          ],
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      console.log('Feedback sent to server:', selectedOptions);
      setSelectedOptions({});
      Alert.alert('Success', 'Feedback submitted successfully');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <View style={{marginTop: 15}}>
      <Text style={styles.header}>Feedback</Text>
      {questions.length > 0 ? (
        questions.map((question, index) => (
          <View key={index} style={{marginBottom: 10}}>
            <Text
              style={{
                marginBottom: 5,
                fontWeight: '500',
                color: 'black',
                fontSize: 16,
                marginLeft: 8,
              }}>
              {question}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
              }}>
              <RadioButton.Group
                value={selectedOptions[index]}
                onValueChange={option => handleOptionChange(index, option)}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 20,
                    marginLeft: 8,
                  }}>
                  <RadioButton value={'Yes'} color="black" />
                  <Text
                    style={{
                      fontWeight: '500',
                      color: 'black',
                      fontSize: 16,
                      marginLeft: 4,
                    }}>
                    Yes
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 20,
                    marginLeft: 8,
                  }}>
                  <RadioButton value={'No'} color="black" />
                  <Text
                    style={{
                      fontWeight: '500',
                      color: 'black',
                      fontSize: 16,
                      marginLeft: 4,
                    }}>
                    No
                  </Text>
                </View>
              </RadioButton.Group>
            </View>
          </View>
        ))
      ) : (
        <Text>No questions available</Text>
      )}
      <TouchableOpacity onPress={submitFeedback} style={[styles.submitButton]}>
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Submit Feedback
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontWeight: 'bold',
    marginBottom: 14,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 12,
  },
  submitButton: {
    backgroundColor: 'black',
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 6,
    marginBottom: 20,
    marginTop: 15,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

export default Feedback;
