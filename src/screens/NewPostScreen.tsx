import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { supabase } from '../../supabase';
import firestore from '@react-native-firebase/firestore';
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import FootNav from '../components/FootNav';
import TopNav from '../components/TopNav';
import auth from '@react-native-firebase/auth';
import PrimaryButton from '../components/PrimaryButton';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type ScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'NewPost'
>;

const NewPostScreen = () => {
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { appTheme } = useTheme();

  const navigation = useNavigation<ScreenNavigationProp>();

  /* ## Pick Image From Gallery ## */
  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  
  const handlePost = async () => {
    if (!imageUri && !text) {
      Alert.alert('Post cannot be empty');
      return;
    }
    setLoading(true);

    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'No user is logged in.');
      setLoading(false);
      return;
    }

    let imageUrl: string | null = null;
    try {
      /* ## Upload Image to Supabase Storage ## */
      if (imageUri) {
        const fileName = `posts/${Date.now()}.jpg`;
        const ext = imageUri.split('.').pop();
        const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

        const formData = new FormData();
        formData.append('file', {
          uri: imageUri,
          name: fileName,
          type: mimeType,
        } as any);

        const { error } = await supabase.storage
          .from('post-images')
          .upload(fileName, formData as any, {
            contentType: mimeType,
            upsert: false,
          });

        if (error) throw error;

        const { data } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      /* ## Upload Post and Save to Firebase Storage ## */
      const postRef = await firestore().collection('posts').add({
        text,
        imageUrl,
        createdAt: firestore.FieldValue.serverTimestamp(),
        shares: 0,
        likes: 0,
        comments: 0,
        userId: currentUser.uid,
      });

      /* ## Update User Document ## */
        await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .update({
            totalPosts: firestore.FieldValue.increment(1),
        });

      setText('');
      setImageUri(null);

      Alert.alert('Post uploaded successfully!');
      navigation.navigate('Home');
    } catch (error: any) {
      Alert.alert('Error posting', error?.message || JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={appTheme.colors.primaryDark} />
      </View>
    );
  }

  return (
    <>
      <TopNav />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="What is in your mind?"
          multiline
          value={text}
          onChangeText={setText}
        />
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        )}
        <View style={styles.actions}>
          <PrimaryButton
            onPress={pickImage}
            accessibilityLabel="Pick Image from Gallery"
            title="Pick Image"
            style={styles.actionBtn}
          />
          <PrimaryButton
            onPress={handlePost}
            title={loading ? 'Posting...' : 'Post'}
            accessibilityLabel="Posting a post"
            style={styles.actionBtn}
          />
        </View>
      </View>
      <FootNav />
    </>
  );
};

export default NewPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  imagePreview: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loaderContainer: {
    backgroundColor: '#eee',
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  actionBtn: {
    maxWidth: '50%',
  },
});
