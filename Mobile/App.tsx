// App.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import TestModelScreen from './src/screens/TestModelScreen';

const App = () => {
  return (
    <View style={styles.container}>
      <TestModelScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
