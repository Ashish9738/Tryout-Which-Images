import React, {useState, useEffect} from 'react';
import {Text, View, Button, Alert, StyleSheet} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {api} from '../../utils/Api';

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
    <View style={{marginLeft: 10, marginTop: 15, marginRight: 10}}>
      {questions.length > 0 ? (
        questions.map((question, index) => (
          <View key={index} style={{marginBottom: 10}}>
            <Text style={styles.header}>Feedback</Text>
            <Text style={{marginBottom: 5}}>{question}</Text>
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
                  }}>
                  <RadioButton value={'Yes'} />
                  <Text>Yes</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RadioButton value={'No'} />
                  <Text>No</Text>
                </View>
              </RadioButton.Group>
            </View>
          </View>
        ))
      ) : (
        <Text>No questions available</Text>
      )}
      <Button
        title="Submit Feedback"
        onPress={submitFeedback}
        color="#000000"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 18,
  },
});

export default Feedback;
