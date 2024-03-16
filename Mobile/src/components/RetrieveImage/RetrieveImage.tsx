import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import DropDown from '../DropDown/DropDown'; // Import DropDown component

interface ImageData {
  name: string;
  data: string;
}

const RetrieveImage: React.FC = () => {
  const [category, setSelectedCategory] = useState<string | null>(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const navigation = useNavigation();

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const openTab = (photo: string) => {
    try {
      navigation.navigate('OpenImage', {
        photoUri: `data:image/jpeg;base64,${photo}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchImages = async () => {
    if (!category) {
      Alert.alert('Error', 'Please select a category first.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://which-api.cialabs.tech/get_images/${category}`,
      );

      if (!Array.isArray(response.data)) {
        Alert.alert('Error', 'Invalid image data received from the server.');
        setIsLoading(false);
        return;
      }

      const base64Images: string[] = response.data;

      const imageDataList: ImageData[] = base64Images.map(
        (imageString: string, index: number) => ({
          name: `Image ${index + 1}`,
          data: imageString,
        }),
      );

      setImages(imageDataList);
    } catch (error) {
      console.error('Error retrieving images:', error);
      Alert.alert('Error', 'Failed to retrieve images. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{width: windowWidth, height: windowHeight}}>
        <Text style={styles.heading}>Retrieve Images</Text>
        <DropDown onSelect={selectCategory} fetchType="category" />
        <TouchableOpacity onPress={fetchImages}>
          <Text style={styles.retrieveBtn}>Retrieve Image</Text>
          {isLoading && (
            <View>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.parent}>
          {images.map((itemm, index) => (
            <View key={index}>
              <TouchableOpacity
                onPress={() => {
                  openTab(itemm.data);
                }}>
                <Image
                  style={[styles.child, {width: windowWidth / 3.2}]}
                  source={{uri: `data:image/jpeg;base64,${itemm.data}`}}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  retrieveBtn: {
    backgroundColor: 'black',
    color: 'white',
    width: 372,
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
  },

  parent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: -5,
    marginTop: 10,
  },
  child: {
    aspectRatio: 1,
    margin: 5,
  },
  heading: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 50,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    marginRight: 30,
  },
});

export default RetrieveImage;
