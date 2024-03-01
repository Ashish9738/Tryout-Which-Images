import React, { useState, useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import { RadioButton } from 'react-native-paper';

interface FeedbackProps {}

const Feedback: React.FC<FeedbackProps> = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://192.168.43.47:8082');

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
      setWs(socket);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data && Array.isArray(data.questions)) {
        setQuestions(data.questions);
      }
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const handleOptionChange = (questionIndex: number, option: string) => {
    setSelectedOptions(prevState => ({
      ...prevState,
      [questionIndex]: option
    }));
  };

  const submitFeedback = () => {
    if (ws) {
      ws.send(JSON.stringify(selectedOptions));
      console.log('Feedback sent to server:', selectedOptions);
      setSelectedOptions({});
    }
  };

  return (
    <View style={{marginLeft: 10, marginTop: 15, marginRight: 10}}>
      {questions.length > 0 ? (
        questions.map((question, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            <Text style={{ marginBottom: 5 }}>{question}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
              <RadioButton.Group
                value={selectedOptions[index]}
                onValueChange={option => handleOptionChange(index, option)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                  <RadioButton value={'Yes'} />
                  <Text>Yes</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
      <Button title="Submit Feedback" onPress={submitFeedback}  />
    </View>
  );
};

export default Feedback;
