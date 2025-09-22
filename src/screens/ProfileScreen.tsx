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
import AppText from "../components/AppText"; 
import SecondaryButton from '../components/SecondaryButton';

type UserProfile = {
  name?: string;
  username?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  totalPosts?: number;
  followersCount?: number;
  followingCount?: number;
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

  const handleUpdate = () => {
    navigation.navigate('UpdateProfile');
  }

  return (
    <>
      {loading ? (
        <FeedLoader visible={loading} />
        ) : (
          <>
          {/* Top navigation bar */}
            <TopNav />
      
            <View style={styles.container}>
              {profile ? (
                /* ## Displaying Profile Data  ## */
                <View style={styles.profileBox}>
                    {profile.avatar ? (
                      <Image source={{ uri: profile.avatar }} style={styles.avatar} />
                    ) : (
                      <View style={[styles.avatar, { backgroundColor: '#ccc' }]} />
                    )}
                    {/* Name */}
                    <AppText variant="h2">
                      {profile.name || "Unknown User"}
                    </AppText>

                    {/* Username */}
                    <AppText variant="small" secondary>
                      {profile.username ? `${profile.username}` : "@unknown_user"}
                    </AppText>

                    {/* Bio */}
                    <AppText variant="body" style={{ fontStyle: "italic", marginTop: 8 }}>
                      {profile.bio || "No bio available"}
                    </AppText>

                    {/* ## ___________ User Stats ___________ ##*/}
                    <View style={styles.statsRow}>

                      {/* Posts */}
                      <View style={styles.statCard}>
                        <AppText variant='h3'>{profile.totalPosts || 0}</AppText>
                        <AppText variant="caption">Posts</AppText>
                      </View>
    
                      {/* Followers */}
                      <View style={styles.statCard}>
                        <AppText variant='h3'>{profile.followersCount || 0}</AppText>
                        <AppText variant="caption">Followers</AppText>
                      </View>
    
                      {/* Following */}
                      <View style={styles.statCard}>
                        <AppText variant='h3'>{profile.followingCount || 0}</AppText>
                        <AppText variant="caption">Following</AppText>
                      </View>

                    </View>
                      {/* ## ___________ Update Profile Button ___________ ##*/}
                      <SecondaryButton title="Update Profile" onPress={handleUpdate} style={{marginTop: 20}}/>
                </View>
              ) : (

                /* Dummy Data if Profile is not available */
                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                  <View style={[styles.avatar, { backgroundColor: '#ccc' }]} />
                  <AppText variant="h2">Unknown User</AppText>
                  <AppText variant="small" secondary>
                    @unknown_user
                  </AppText>
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
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    width: "90%",
    alignSelf: "center",
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
});
