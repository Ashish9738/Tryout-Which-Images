//AppNavigator.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Menu from '../../src/components/Menu/Menu';
import AddImage from '../../src/components/AddImage/AddImage';
import RetrieveImage from '../../src/components/RetrieveImage/RetrieveImage';
import StartTesting from '../../src/components/StartTesting/StartTesting';
import OpenImage from '../components/RetrieveImage/OpenImage';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
        <Stack.Group>
          <Stack.Screen name="Menu" component={Menu} />
          <Stack.Screen name="AddImage" component={AddImage} />
          <Stack.Screen name="RetrieveImageScreen" component={RetrieveImage} />
          <Stack.Screen name="StartTesting" component={StartTesting} />
          <Stack.Screen name="OpenImage" component={OpenImage} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
