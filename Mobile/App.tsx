import React from 'react';
import { View, StyleSheet } from 'react-native';
import TestModelScreen from './src/components/DropDown/screens/TestModelScreen';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <TestModelScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  }
});

export default App;
