import { ActivityIndicator, Alert, Image, StyleSheet, Text, View, } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import FootNav from '../components/FootNav';
import TopNav from '../components/TopNav';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { collection, doc, getFirestore, onSnapshot, query, where } from '@react-native-firebase/firestore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';
import UserFeed from '../components/UserFeed';
import FeedLoader from '../components/FeedLoader';

type UserProfile = {
  name?: string;
  username?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  totalPosts?: number;
};

type ScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Profile'
>;

const ProfileScreen = () => {
  const { appTheme } = useTheme();
  const currentUser = getAuth(getApp()).currentUser;

  const navigation = useNavigation<ScreenNavigationProp>();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const app = getApp();
  const db = getFirestore(app);

  useEffect(() => {
    if (!currentUser) {
      Alert.alert('Error', 'No user is logged in.');
      setLoading(false);
      navigation.navigate('Login');
      return;
    }

    const userRef = doc(db, 'users' , currentUser.uid);
    const unsubscribe = onSnapshot(userRef, docSnap => {
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      });
    return () => unsubscribe();
  }, [currentUser]);

  /* ## Handle Profile Update ## */
  const handleUpdateProfile = useCallback(()=>{
    navigation.navigate('UpdateProfile');
  }, [navigation]);

  

  /* ## Manually Count the totalPosts of Current User ## */

  useEffect(() => {
    if (!currentUser) return;

    const postRef = collection(db, 'posts');
    const q = query(postRef, where('userId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, snapshot => {
        setProfile(prev => prev ? { ...prev, totalPosts: snapshot.size } : { totalPosts: snapshot.size });
      });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <>
      {loading ? (
            <FeedLoader visible={loading} />
        ): (
          <>
            <TopNav />
      
            <View style={styles.container}>
              {profile ? (
                <View style={styles.profileBox}>
                    {profile.avatar ? (
                      <Image source={{ uri: profile.avatar }} style={styles.avatar} />
                    ) : (
                      <View style={[styles.avatar, { backgroundColor: '#ccc' }]} />
                    )}
                    <Text style={styles.name}>{profile.name || 'Unknown User'}</Text>
                    <Text style={styles.email}>{profile.username || '@unknown_user'}</Text>
                    <Text style={styles.bio}>{profile.bio || 'No bio available'}</Text>
                    <Text style={styles.posts}>Posts: {profile.totalPosts || 0}</Text>
                </View>
              ) : (
                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                  <View style={[styles.avatar, { backgroundColor: '#ccc' }]} />
                  <Text style={styles.name}>Unknown User</Text>
                  <Text style={styles.name}>{currentUser?.uid}</Text>
                  <Text style={styles.email}>No email available</Text>
                </View>
              )}
                
                {/* <UserFeed/> */}
            </View>
      
            <FootNav />
          </>
        )
      }
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
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
  // profileBorder: {
  //   borderColor: "#000",
  //   backgroundColor: "#000",
  // },
});
