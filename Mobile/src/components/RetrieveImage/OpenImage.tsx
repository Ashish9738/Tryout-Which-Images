import {StyleSheet, View, Image} from 'react-native';
import React from 'react';

const OpenImage = ({route}: any) => {
  const {photoUri} = route.params;
  // console.log(String(photoUri));

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Image
        source={{uri: String(photoUri)}}
        style={{width: '100%', height: '100%'}}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default OpenImage;
