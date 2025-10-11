import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, increment, onSnapshot, query, runTransaction, serverTimestamp, setDoc, updateDoc, where } from '@react-native-firebase/firestore';
import { Image, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type UserProfileRouteProp = RouteProp<RootStackParamList, 'UserProfile'>;

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
  'UserProfile'
>;

const UserProfileScreen: React.FC = () => {
  const route = useRoute<UserProfileRouteProp>();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const currentUserId = getAuth(getApp()).currentUser?.uid;
  const { userId } = route.params;

  const navigation = useNavigation<ScreenNavigationProp>();

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
  const handleMessage = async () => {
    if (!currentUserId || !userId) return;
    
    try {
      const chatsRef = collection(db, "chats");
      const q = query(
        chatsRef,
        where("members", "in", [
          [currentUserId, userId],
          [userId, currentUserId]
        ])
      );
      const querySnapshot = await getDocs(q);
    
      let chatId: string;

      if (!querySnapshot.empty) {
        /* ## Chat already started ## */
        chatId = querySnapshot.docs[0].id;
      } else {
        //* ## Create a new chat room ## */
        const newChatRef = await addDoc(chatsRef, {
          members: [currentUserId, userId],
          lastMessage: "",
          updatedAt: serverTimestamp(),
        });
        chatId = newChatRef.id;
      }
      
      navigation.navigate("UserChat", { chatId, chatUserId: userId });
    } catch (error) {
      console.error("Error starting chat:", error);
    }
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
                <AppText variant='h2'>{profile.name}</AppText>
                <AppText variant='caption'>{profile.username}</AppText>
                <AppText style={{marginTop: 10}}>{profile.bio}</AppText>

                {/* ## ___________ Buttons ___________ ##*/}
                <View style={{flexDirection: 'row', marginTop: 10}}>

                  {/* Message Button with Icon */}
                  <SecondaryButton onPress={handleMessage} title={
                    <View style={{flexDirection: "row", alignItems: "center",}}>
                      <MessageIcon />
                      <AppText variant="h4" style={{marginLeft: 3}}>Message</AppText>
                    </View>}
                  style={{width: '45%'}} />

                  {/* Conditional Follow/Unfollow Button */}
                  {isFollowingUser? (
                    <SecondaryButton onPress={handleFollowToggle} title='Unfollow' style={{width: '45%'}} />
                  ): (
                    <PrimaryButton onPress={handleFollowToggle} title="Follow" style={{width: '45%'}}/>
                  )}
                </View>

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
                
              </View>
            )}

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