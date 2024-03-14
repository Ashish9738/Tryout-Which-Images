import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface MenuProps {
  navigation: any;
}

const Menu: React.FC<MenuProps> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 40,
          fontFamily: 'Roboto',
          color: '#000000',
          textAlign: 'center',
          padding: 20,
          marginTop: 20,
          marginBottom: 50,
        }}>
        Which Images
      </Text>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 32,
          color: '#000000',
          textAlign: 'center',
          marginBottom: 50,
        }}>
        MENU
      </Text>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-around',
          padding: 50,
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('AddImage')}>
          <View style={styles.iconContainer}>
            <Icon name="plus-square" size={50} color="green" />
            <Text style={{color: 'green'}}>Add Image</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('RetrieveImageScreen')}>
          <View style={styles.iconContainer}>
            <Icon name="caret-square-o-up" size={50} color="blue" />
            <Text style={{color: 'blue'}}>Retrieve Image</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('StartTesting')}>
          <View style={styles.iconContainer}>
            <Icon name="pencil-square" size={50} color="orange" />
            <Text style={{color: 'orange'}}>Start Testing</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#586f7c',
  },
  iconContainer: {
    backgroundColor: '#000000',
    alignItems: 'center',
    borderColor: '#0d1b2a',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
});

export default Menu;
