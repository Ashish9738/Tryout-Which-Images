import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {api} from '../../utils/Api';

interface FeedbackProps {
  model: string;
  imageKey: string;
  apiResponse: string;
  onFeedbackSubmit: () => void; // Define type for callback function
}

const Feedback: React.FC<FeedbackProps> = ({
  model,
  imageKey,
  apiResponse,
  onFeedbackSubmit,
}) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});
  const [loading, setLoading] = useState<boolean>(false); // State for loading animation

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

      setLoading(true);

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
      Alert.alert('Success', 'Feedback submitted successfully', [
        {
          text: 'OK',
          onPress: onFeedbackSubmit, 
        },
      ]);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
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
      <TouchableOpacity
        onPress={submitFeedback}
        style={[styles.submitButton, loading && styles.disabledButton]}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        )}
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
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Feedback;
