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
  ScrollView,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import DropDown from '../DropDown/DropDown';

interface ImageData {
  name: string;
  data: string;
}

const RetrieveImage: React.FC = () => {
  const [category, setSelectedCategory] = useState<string | null>(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const windowWidth = Dimensions.get('window').width;
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
    console.log(category);

    try {
      const response = await axios.get(
        `https://which-api.cialabs.org/get_images/${category}`,
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
      <View style={{flex: 1}}>
        <Text style={styles.heading}>Retrieve Images</Text>
        <DropDown
          onSelect={selectCategory}
          fetchType="category"
          selectedModel={''}
        />
        <TouchableOpacity onPress={fetchImages}>
          <Text style={styles.retrieveBtn}>Retrieve Image</Text>
          {isLoading && <ActivityIndicator size="large" color="black" />}
        </TouchableOpacity>
        <View style={styles.parent}>
          {images.map((itemm, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                openTab(itemm.data);
              }}
              style={styles.childContainer}>
              <Image
                style={styles.child}
                source={{uri: `data:image/jpeg;base64,${itemm.data}`}}
              />
            </TouchableOpacity>
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
    flex: 1,
    backgroundColor: 'black',
    color: 'white',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 15,
  },
  parent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
    paddingBottom: 50,
  },
  childContainer: {
    width: '30%',
    aspectRatio: 1,
    margin: 5,
  },
  child: {
    flex: 1,
    borderRadius: 10,
  },
  heading: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 42,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    marginRight: 8,
    marginLeft: 5,
  },
});

export default RetrieveImage;
