import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ml from '@react-native-firebase/ml';

export default function App() {
  const [image, setImage] = useState();
  const [landmarks, setLandmarks] = useState([]);
  const onTakePhoto = () => launchCamera({ mediaType: 'image' }, onMediaSelect);

  const onSelectImagePress = () =>
    launchImageLibrary({ mediaType: 'image' }, onMediaSelect);

  const onMediaSelect = async (media) => {
    if (!media.didCancel) {
      setImage(media.uri);
      const landmarks = await ml().cloudLandmarkRecognizerProcessImage(
        media.uri,
      );
      setLandmarks(landmarks);
      console.log(landmarks);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Landmark Recognition</Text>
      <View>
        <TouchableOpacity style={styles.button} onPress={onTakePhoto}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onSelectImagePress}>
          <Text style={styles.buttonText}>Pick a Photo</Text>
        </TouchableOpacity>
        <Image source={{ uri: image }} style={styles.image} />
      </View>
      {landmarks.map((item, i) => (
        <View style={{ marginTop: 20, width: 300 }} key={i}>
          <Text>Landmark: {item.landmark}</Text>
          <Text>Bounding Box: {JSON.stringify(item.boundingBox)}</Text>
          <Text>Coordinates: {JSON.stringify(item.locations)}</Text>
          <Text>Confidence: {item.confidence}</Text>
          <Text>Entity Id: {item.entityId}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
  },
  title: {
    fontSize: 35,
    marginVertical: 40,
  },
  image: {
    height: 300,
    width: 300,
    marginTop: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#47477b',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
  },
});
