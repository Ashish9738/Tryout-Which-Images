import React from 'react';
import { View, Image, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 

interface MenuProps {
  navigation: any;
}

const Menu: React.FC<MenuProps> = ({ navigation }) => {
  return (
    <View>
      <Text style={{ fontWeight: 'bold', fontSize: 48, color: 'black', textAlign: 'center', padding:20, marginTop:20, marginBottom: 50 }}>WhichImages</Text>
      <Text style={{ fontWeight: 'bold', fontSize: 32, color: 'black', textAlign: 'center', marginBottom: 50 }}>MENU</Text>
      <View style={{ flexDirection: 'column', justifyContent: 'space-around', padding: 50 }}>
        <TouchableOpacity onPress={() => navigation.navigate('AddImage')}>
          <View style={styles.iconContainer}>
            <Icon name="id-badge" size={50} color="green" />
            <Text style={{ color: 'green' }}>Add Image</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('RetrieveImageScreen')}>
          <View style={styles.iconContainer}>
            <Icon name="suitcase" size={50} color="blue" />
            <Text style={{ color: 'blue' }}>Retrieve Image</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('StartTesting')}>
          <View style={styles.iconContainer}>
            <Icon name="search" size={50} color="orange" />
            <Text style={{ color: 'orange' }}>Start Testing</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});

export default Menu;