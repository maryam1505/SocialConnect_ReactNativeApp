import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import React, { useEffect, useState } from 'react';
import TopNav from '../components/TopNav';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { useTheme } from '../context/ThemeContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { collection, doc, getFirestore, onSnapshot, setDoc } from '@react-native-firebase/firestore';
import GradientInput from '../components/GradientInput';
import PrimaryButton from '../components/PrimaryButton';
import { launchImageLibrary } from 'react-native-image-picker';
import CameraIcon from '../../assets/icons/camera.svg';
import { supabase } from '../../supabase';

type UserProfile = {
  name?: string;
  username?: string;
  bio?: string;
  avatar?: string;
};

const UpdateProfileScreen = () => {
  const { appTheme } = useTheme();
  const [initialValues, setInitialValues] = useState<UserProfile | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const app = getApp();
  const db = getFirestore(app);
  
  const currentUser = getAuth(app).currentUser;
  /* ## Pick Image From Gallery ## */
  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  /* ## Upload Image to Supabase ## */
  const UploadImage = async () => {
    if (imageUri) {
      try {
        const fileName = `avatars/${currentUser?.uid}_${Date.now()}.jpg`;
        const ext = imageUri.split('.').pop();
        const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

        const formData = new FormData();
                formData.append('file', {
                  uri: imageUri,
                  name: fileName,
                  type: mimeType,
                } as any);
        
                const { error } = await supabase.storage
                  .from('avatar-images')
                  .upload(fileName, formData as any, {
                    contentType: mimeType,
                    upsert: false,
                  });

        if (error) throw error;

        const { data } = supabase.storage
          .from('avatar-images')
          .getPublicUrl(fileName);

        return data.publicUrl;

      } catch (error: any) {
        console.error('Upload failed:', error);
        Alert.alert('Error', 'Image upload failed');
        return null;
      }
    }

  };

  /* ## Getting Initial Values if Stored in Firebase ## */
  useEffect(() => {
    if (!currentUser) {
      Alert.alert('Error', 'No user is logged in.');
      setLoading(false);
      return;
    }
    const userRef = doc(db, 'users', currentUser.uid);

    const unsubscribe = onSnapshot(userRef, snap => {
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      setInitialValues({
        name: data.name || '',
        username: data.username || '',
        avatar: data.avatar || '',
        bio: data.bio || '',
      });
    } else {
      setInitialValues({ name: '', username: '', avatar: '', bio: '' });
    }
    setLoading(false);
  });
    return () => unsubscribe();
  }, [currentUser]);

  /* ## Creating a Validation Schema ## */
  const validationSchema = Yup.object().shape({
    name: Yup.string(),
    bio: Yup.string().max(150, 'Bio should not exceed 150 characters'),
    avatar: Yup.string().url('Enter a valid image URL'),
    username: Yup.string().matches(
      /^@[A-Za-z0-9_]+$/,
      'Username must start with @ and contain only letters, numbers, or underscores',
    ),
  });

  /* ## Updating Values in Firebase ## */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues || {
      name: '',
      username: '',
      bio: '',
      avatar: '',
    },
    validationSchema,
    onSubmit: async values => {
      if (!currentUser) {
        Alert.alert('Error', 'No user is logged in.');
        return;
      }

      try {
        let avatarUrl = values.avatar;
        
        if (imageUri) {
          const uploadedUrl = await UploadImage();
          if (uploadedUrl) {
            avatarUrl = uploadedUrl;
          }
        }

        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc( userRef,
          {
            name: values.name,
            username: values.username,
            bio: values.bio,
            avatar: avatarUrl,
            email: currentUser.email,
          },
          { merge: true },
        );

        Alert.alert('Success', 'Profile updated successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to update profile.');
      }
    },
  });

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <>
      <TopNav />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatarContainer}>
          <View>
            {/* Avatar Preview */}
            {imageUri || formik.values.avatar ? (
              <Image source={{ uri: imageUri || formik.values.avatar }} style={styles.avatarPreview} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: '#ccc' }]} />
            )}

            {/* Pick Image Button */}
            <TouchableOpacity style={styles.uploadIcon} onPress={pickImage}>
              <CameraIcon width={22} height={22} />
            </TouchableOpacity>
          </View>

          {formik.touched.avatar && formik.errors.avatar && (
            <Text style={styles.error}>{formik.errors.avatar}</Text>
          )}
        </View>

        {/* ## Name Field ## */}
        <GradientInput
          placeholder="Enter your name"
          value={formik.values.name}
          onChangeText={formik.handleChange('name')}
          onBlur={formik.handleBlur('name')}
          error={formik.touched.name ? formik.errors.name : ''}
        />

        {/* ## Username Field ## */}
        <GradientInput
          placeholder="Enter your username"
          value={formik.values.username}
          onChangeText={formik.handleChange('username')}
          onBlur={formik.handleBlur('username')}
          error={formik.touched.username ? formik.errors.username : ''}
        />

        {/* ## Bio Field ## */}
        <GradientInput
          style={styles.textarea}
          placeholder="Write your bio"
          multiline
          numberOfLines={4}
          value={formik.values.bio}
          onChangeText={formik.handleChange('bio')}
          onBlur={formik.handleBlur('bio')}
          error={formik.touched.bio ? formik.errors.bio : ''}
        />

        <PrimaryButton title="Save Changes" onPress={formik.handleSubmit} />

      </ScrollView>
    </>
  );
};

export default UpdateProfileScreen;

const styles = StyleSheet.create({
  /* ## Form Container Styling ## */
  container: {
    flex: 1,
    padding: 10,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  error: {
    color: 'red',
    marginBottom: 8,
    fontSize: 12,
  },

  /* ## Avatar Preview Styling ## */
  avatarContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBox: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  avatarPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  uploadIcon: {
    position: 'absolute',
    bottom: 15,
    right: 10,
  },
});
