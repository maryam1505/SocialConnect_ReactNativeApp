import { deleteDoc, doc, getFirestore, increment, onSnapshot, runTransaction, setDoc, updateDoc } from '@react-native-firebase/firestore';
import { Image, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import PrimaryButton from '../components/PrimaryButton';
import AppText from '../components/AppText';
import SecondaryButton from '../components/SecondaryButton';
import FeedLoader from '../components/FeedLoader';
import TopNav from '../components/TopNav';
import FootNav from '../components/FootNav';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import MessageIcon from "../../assets/icons/msg.svg";

type UserProfileRouteProp = RouteProp<RootStackParamList, 'UserProfile'>;

type UserProfile = {
  name?: string;
  username?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  totalPosts?: number;
};

const UserProfileScreen: React.FC = () => {
  const route = useRoute<UserProfileRouteProp>();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const currentUserId = getAuth(getApp()).currentUser?.uid;
  const { userId } = route.params;

  const app = getApp();
  const db = getFirestore(app);

  /* ## Fetching User data from UserId ## */
  useEffect(() => {
    if(!userId) return;
    
    const userRef = doc(db, 'users', userId);
    const unsubscribe = onSnapshot(userRef, docSnap => {
      if(docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      }
      else {
        setProfile(null);
      }

      setLoading(false);
    });
    return () => unsubscribe();

  }, [userId]);

  /* -------------------------------- ## Handling Follow/Unfollow ## -------------------------------- */

  
  /* ## Follow user System ## */
  const followUser = async (currentUserId: string, targetUserId: string) => {
    /* ## Prevent Self Follow ## */
    if (currentUserId === targetUserId) return;

    const currentUserFollowingRef = doc(db, 'followers', currentUserId, 'userFollowing', targetUserId);
    const targetUserFollowersRef = doc(db, 'followers', targetUserId, 'userFollowers', currentUserId);

    await setDoc(currentUserFollowingRef, { createdAt: Date.now() });
    await setDoc(targetUserFollowersRef, { createdAt: Date.now() });

    // update counters
    await updateDoc(doc(db, 'users', currentUserId), { followingCount: increment(1) });
    await updateDoc(doc(db, 'users', targetUserId), { followersCount: increment(1) });
  };

  /* ## Unfollow user System ## */
  const unfollowUser = async (currentUserId: string, targetUserId: string) => {
    if (currentUserId === targetUserId) return;

    const currentUserFollowingRef = doc(db, 'followers', currentUserId, 'userFollowing', targetUserId);
    const targetUserFollowersRef = doc(db, 'followers', targetUserId, 'userFollowers', currentUserId);

    const currentUserRef = doc(db, 'users', currentUserId);
    const targetUserRef = doc(db, 'users', targetUserId);

    try{
      await Promise.all([
        deleteDoc(currentUserFollowingRef),
        deleteDoc(targetUserFollowersRef),
      ]);

      await runTransaction(db, async (transaction) => {
        const currentUserSnap = await transaction.get(currentUserRef);
        const targetUserSnap = await transaction.get(targetUserRef);

        if(currentUserSnap.exists()) {
          const currentUserData = currentUserSnap.data() as { followingCount?: number };
          const followingCount = currentUserData?.followingCount ?? 0;

          if(followingCount > 0) {
            transaction.update(currentUserRef, { followingCount: followingCount - 1 });
          }
        }

        if(targetUserSnap.exists()) {
          const targetUserData = targetUserSnap.data() as { followersCount?: number };
          const followersCount = targetUserData?.followersCount ?? 0;
          if (followersCount > 0) {
            transaction.update(targetUserRef, { followersCount: followersCount - 1 });
          }
        }
      });
    } catch (error) {
      console.error("Error unfollow user:", error);
    }

  };

  /* ## Checking if the currentUser already followed the user ## */
  useEffect(()=>{
    if(!currentUserId || !userId) return;

    const followingRef = doc(db, 'followers', currentUserId, 'userFollowing', userId);
    const unsubscribe = onSnapshot(followingRef, snap => {
      setIsFollowingUser(snap.exists());
    });

    return () => unsubscribe();
  }, [currentUserId, userId]);

  /* ## Handle Follow Toggle ## */
  const handleFollowToggle = async () => {
    if (!currentUserId) return;
    if(isFollowingUser) {
      await unfollowUser(currentUserId, userId);
    } else {
      await followUser(currentUserId, userId);
    }
  };


  /* -------------------------------- ## Handling Message ## -------------------------------- */
  const handleMessage = () => {

  }


  return (
    <View style={{flex:1}}>
      {loading ? (
        <FeedLoader visible={loading} />
      ) : (
        <>
          <TopNav/>
          <View style={styles.container}>
          {profile && (
            <View style={styles.profileBox}>
              {profile.avatar ? (
                <Image source={{ uri: profile.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: '#ccc' }]} />
              )}
              <AppText>{profile.name}</AppText>
              <AppText>{profile.username}</AppText>
              <AppText>{profile.bio}</AppText>
              {/* Posts */}
                <AppText variant="small" style={{ marginTop: 10 }}>
                  Posts: {profile.totalPosts || 0}
                </AppText>
            </View>
          )}
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <SecondaryButton onPress={handleMessage} title={
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <MessageIcon />
                <AppText variant="h4" style={{marginLeft: 6}}>Message</AppText>
              </View>}
            style={{width: '40%'}} />
            {isFollowingUser? (
              <SecondaryButton onPress={handleFollowToggle} title='Unfollow' style={{width: '40%'}} />
            ): (
              <PrimaryButton onPress={handleFollowToggle} title="Follow" style={{width: '40%'}}/>
            )}
          </View>
          </View>
          <FootNav/>
        </>
      )}
    </View>
  );
};


export default UserProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
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
});