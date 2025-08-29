import { ActivityIndicator, Alert, Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import FootNav from '../components/FootNav';
import TopNav from '../components/TopNav';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ProfileScreen = () => {
  const { appTheme } = useTheme();
  const currentUser = auth().currentUser;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      Alert.alert('Error', 'No user is logged in.');
      setLoading(false);
      return;
    }
    const unsubscribe = firestore()
      .collection('users')
      .doc(currentUser.uid)
      .onSnapshot(doc => {
        if (doc.exists()) {
          setProfile(doc.data());
        }
        setLoading(false);
      });
       return () => unsubscribe();
  }, [currentUser]);

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
        {profile && (
          <View style={styles.profileBox}>
            {profile.imageUrl ? (
              <Image source={{ uri: profile.imageUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: '#ccc' }]} />
            )}
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.email}>{profile.email}</Text>
            <Text style={styles.bio}>{profile.bio}</Text>
            <Text style={styles.posts}>Posts: {profile.totalPosts || 0}</Text>
          </View>
        )}
      </View>

      <FootNav />
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 500,
  },
  loaderContainer: {
    backgroundColor: '#eee',
    opacity: 0.05,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
   profileBox: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  bio: {
    fontSize: 14,
    fontStyle: 'italic',
    marginVertical: 10,
  },
  posts: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
  },
});
