import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface MenuProps {
  navigation: any;
}

const Menu: React.FC<MenuProps> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-around',
          padding: 50,
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('AddImage')}>
          <View style={styles.iconContainer}>
            <Icon style={styles.icon} name="camera" size={50} color="white" />
            <Text style={styles.iconTitle}>Add Images</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('RetrieveImageScreen')}>
          <View style={styles.iconContainer}>
            <Icon
              style={styles.icon}
              name="caret-square-o-up"
              size={50}
              color="white"
            />
            <Text style={styles.iconTitle}>Retrieve Images</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('StartTesting')}>
          <View style={styles.iconContainer}>
            <Icon style={styles.icon} name="search" size={50} color="white" />
            <Text style={styles.iconTitleStartTesting}>Start Testing</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white',
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
    margin: 0,
    backgroundColor: 'rgba(0,0,0,1)',
    alignItems: 'center',
    width: 372,
    textAlign: 'center',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 15,
    marginLeft: 20,
    marginBottom: 20,
    marginRight: 18,
  },
  icon: {
    marginLeft: 30,
  },
  iconTitle: {
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    marginLeft: 50,
    marginBottom: 10,
    fontSize: 20,
  },
  iconTitleStartTesting: {
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    marginLeft: 58,
    marginBottom: 10,
    fontSize: 20,
  },
});

export default Menu;
