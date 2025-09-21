import { Alert, FlatList, Image, Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import { formatDistanceToNow } from 'date-fns';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { collection, deleteDoc, doc, getDoc, getFirestore, increment, onSnapshot, orderBy, query, runTransaction, serverTimestamp, setDoc, updateDoc } from '@react-native-firebase/firestore';
import SendIcon from '../../assets/icons/send.svg';
import CloseIcon from '../../assets/icons/close.svg';
import { Share } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from './PrimaryButton';
import { useTheme } from '../context/ThemeContext';
import AppText from './AppText';
import SecondaryButton from './SecondaryButton';


export interface Post {
  id: string;
  userId: string;
  name: string;
  username: string;
  avatar: string | number;
  text?: string;
  imageUrl?: string | number;
  likes?: number;
  comments?: number;
  shares?: number;
  createdAt?: { toDate: () => Date };
}

interface PostCardProps {
  post: Post;
}

interface UserData {
  name: string;
  username: string;
  avatar?: string;
}
// type ScreenNavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<RootStackParamList, T>;

const PostCard: React.FC<PostCardProps> = ({ post }) => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { appTheme } = useTheme(); 
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentCount, setCommentCount] = useState(0);
  const [sharesCount, setSharesCount] = useState(0);
  const [isFollowingUser, setIsFollowingUser] = useState(false);

  const app = getApp();
  const db = getFirestore(app);
  const currentUserId = getAuth(app).currentUser?.uid;

  /* -------------------------------- ## Handling Likes ## -------------------------------- */

  /* ## Animation for like Button ## */
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  /* ## If the User already liked ## */
  useEffect(()=>{
    if(!currentUserId) return;
    const likeRef = doc(db, 'posts', post.id, 'likes', currentUserId);
    const unsubscribe = onSnapshot(likeRef, (docSnap) => {
      if (docSnap.exists()) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    });

    return unsubscribe;

  }, [post.id, currentUserId]);

  /* ## Fetch Realtime Like Counts ## */
  useEffect(() => {
    const postRef = doc(db,'posts',post.id);

    const unsubscribe = onSnapshot(postRef, doc => {
      if (doc.exists()) {
        const data = doc.data();
        setLikes(data?.likes ?? 0);
      }
    });

    return unsubscribe;
  }, [post.id]);

  /* ## Toggle like System ## */
  const toggleLike = async (postId: string, isLiked: boolean) => {

    const currentUserId = getAuth(getApp()).currentUser?.uid;
    if (!currentUserId) return;

    const likeRef = doc(db, 'posts', post.id, 'likes', currentUserId);
    const postRef = doc(db, 'posts', postId);

    await runTransaction(db, async transaction => {
      const postSnap = await transaction.get(postRef);

      const data = postSnap.data();
      if (!data) throw "Post does not exist";

      const currentLikes = data.likes ?? 0;

      if (isLiked) {
        // ✅ Unlike Post
        transaction.delete(likeRef);
        transaction.update(postRef, {
          likes: Math.max(0, currentLikes - 1), // prevent negatives
        });
      } else {
        // ✅ Like Post
        transaction.set(likeRef, { isLiked: true });
        transaction.update(postRef, {
          likes: currentLikes + 1,
        });
      }
    }); 

    if (!isLiked) {
      scale.value = withSpring(1.3, {}, () => {
        scale.value = withSpring(1);
      });
    }
  };


  /* -------------------------------- ## Handling Comments ## -------------------------------- */

  /* ## Fetch Realtime Comments ## */
  useEffect(() => {
    const CommentRef = collection(db,'posts', post.id,'comments');
    const q = query(CommentRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, async snapshot => {
      const fetched = await Promise.all(
        snapshot.docs.map(async (docSnap: any) => {
          const data = docSnap.data();
          let userData: UserData | undefined;

          if( data.currentUserId ) {
            const userDoc = await getDoc(doc(db, "users", data.currentUserId));
            if (userDoc.exists()) {
              userData = userDoc.data() as UserData;
            }
          }

          return {
          id: docSnap.id,
          ...data,
          ...userData, 
          };
        })
      );
      setComments(fetched);
    });
    return () => unsubscribe();
  }, [post.id]);

  /* ## Fetch Realtime Comment Counts ## */
  useEffect(() => {
    const postRef = doc(db, 'posts', post.id);
    

    const unsubscribe = onSnapshot(postRef, docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCommentCount(data?.comments ?? 0);
      }
    });

    return unsubscribe;
  }, [post.id]);

  /* ## Add Comment System ## */
  const addComment = async() => {
    if (!currentUserId || !commentText.trim()) return;
    const user = getAuth(app).currentUser;

    const commentRef = doc(collection(db, 'posts', post.id, 'comments'));
    const postRef = doc(db, 'posts',post.id);

    await runTransaction(db, async transaction => {
      transaction.set(commentRef, {
        currentUserId: user?.uid,
        username: user?.displayName ?? 'Anonymous',
        text: commentText,
        createdAt: serverTimestamp(),
      });
      transaction.update(postRef, {comments: increment(1)});
    });
    setCommentText('');
  }

  /* -------------------------------- ## Handling Shares ## -------------------------------- */

  /* ## Share Post System ## */
  const sharePost = async (post: Post) => {
    try {

      if (!post?.id) {
        console.error("Post is missing id:", post);
        Alert.alert("Error", "Post ID is missing.");
        return;
      }
      const postRef = firestore().collection('posts').doc(post.id);

      // const url = `https://yourdomain.com/post/${post.id} 1VAvqKa5iWOH19WtXCwX`;
      const url = `https://exampledomain.com/post/${post.id}`;

      // Open system share sheet
      const result = await Share.share({
        message: `${post.text ?? 'Check out this post!'}\n\n${url}\n\nShared via SocialConnect`,
      });

      // Increment ONLY if actually shared
      if (result.action === Share.sharedAction) {
        await postRef.update({
          shares: firestore.FieldValue.increment(1),
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to share the post right now.');
    }
  };

  /* ## Fetch Realtime Share Counts ## */
  useEffect(() => {
    const postRef = doc(db, 'posts', post.id);

    const unsubscribe = onSnapshot(postRef, docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSharesCount(data?.shares ?? 0);
      }
    });

    return unsubscribe;
  }, [post.id]);

  /* -------------------------------- ## Handling Follow/UnFollow ## -------------------------------- */
  useEffect(() => {
    if (!currentUserId || !post.userId) return;
    if (currentUserId === post.userId) return;

    const followRef = doc(db, "followers", currentUserId, "userFollowing", post.userId);

    const unsubscribe = onSnapshot(followRef, snap => {
      setIsFollowingUser(snap.exists());
    });

    return unsubscribe;
  }, [currentUserId, post.userId]);

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

  /* ## Handle Follow Toggle ## */
  const handleFollowToggle = async (userId: string) => {
    if (!currentUserId) return;

    if(isFollowingUser) {
      await unfollowUser(currentUserId, userId);
    } else {
      await followUser(currentUserId, userId);
    }
  };

  /* -------------------------------- ## Screen UI ## -------------------------------- */
  return (
    <View style={styles.card}>
      {/* User Info */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarHeader} onPress={() => navigation.navigate('UserProfile', { userId: post.userId })}>
          <View style={styles.avatarContainer}>
            <Image source={
                typeof post.avatar === 'string'
                  ? { uri: post.avatar }
                  : require('../../assets/images/profile-placeholder.jpg')
              }
              style={styles.avatar}
            />
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant='h4'>{post.name}</AppText>
            {/* <Text style={styles.time}>{post.username}</Text> */}
            <AppText variant='caption'>
              {post?.createdAt
                ? formatDistanceToNow(post.createdAt.toDate(), {
                  addSuffix: false,
                })
                : 'Just now'}
            </AppText>
          </View>
        </TouchableOpacity>
          {!isFollowingUser && (
            <PrimaryButton onPress={() => handleFollowToggle(post.userId)} title="Follow" style={{width: '35%'}}/>
          )}
      </View>

      {/* Post Text */}
      {post.text ? <AppText variant='small' style={styles.text}>{post.text}</AppText> : null}

      {/* Post Image */}
      {post.imageUrl ? (
        <View style={styles.imageCard}> 
          <Image
            source={
              typeof post.imageUrl === 'string'
                ? { uri: post.imageUrl }
                : post.imageUrl
            }
            style={styles.postImage}
          />

        </View>

      ) : null}

      {/* ## Engagement Row ## */}
      <View style={styles.engagement}>

        {/* ## Likes ## */}
          <TouchableOpacity style={styles.engageItem} onPress={() => toggleLike(post.id, isLiked)}>
            <Animated.View style={animatedStyle}>
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={22}
                color={isLiked ? 'red' : '#444'}
              />
            </Animated.View>
            <AppText style={styles.engageText}>{likes}</AppText>
          </TouchableOpacity>

        {/* ## Comments ## */}
        <TouchableOpacity style={styles.engageItem} onPress={() => setShowComments(true)}>
          <Ionicons name="chatbubble-outline" size={20} color="#444" />
          <AppText style={styles.engageText}>{commentCount}</AppText>
        </TouchableOpacity>

        {/* ## Share ## */}
        <TouchableOpacity style={styles.engageItem} onPress={() => sharePost(post)}>
          <Ionicons name="share-social-outline" size={20} color="#444" />
          <AppText style={styles.engageText}>{sharesCount}</AppText>
        </TouchableOpacity>
        
      </View>

      {/* ## -------------------------- Comments Model -------------------------- ## */}
      <Modal visible={showComments} animationType='slide' transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            {/* ## Header ## */}
            <View style={styles.modalHeader}>
              <AppText variant='h3'>Comments</AppText>
              <TouchableOpacity onPress={()=>setShowComments(false)}>
                <CloseIcon width={12} height={12} />
              </TouchableOpacity>
            </View>
          
            {/* ## Comments List ## */}
            <FlatList data={comments} keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View style={{ marginVertical: 8, paddingHorizontal: 7, paddingVertical: 12, borderBottomColor: '#eee', borderBottomWidth: 1}}>
                <View style={{ flexDirection: 'row', alignItems:"center", }}>
                  {/* Avatar */}
                    <View style={{ width: "17%", alignItems: "center" }}>
                      <Image
                        source={
                          typeof item.avatar === "string"
                            ? { uri: item.avatar }
                            : require("../../assets/images/profile-placeholder.jpg")
                        }
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                        }}
                      />
                    </View>

                  {/* Content Container */}
                  <View style={{flex: 1, width: "85%" }}>

                    {/* Header with name, username, and time */}
                    <View style={{  flexDirection: 'row', alignItems: 'center',}}>

                      <View>
                        <AppText> {item.name ?? 'Unknown'} </AppText>
                        <AppText variant='caption'> {item.username ?? '@anonymous'} </AppText>
                      </View>

                      <View style={{ flex: 1 }} />

                      {/* Time */}
                      <AppText variant='caption'>
                        {item.createdAt?.toDate
                          ? formatDistanceToNow(item.createdAt.toDate(), { addSuffix: false })
                          : 'Just now'}
                      </AppText>

                    </View>

                  </View>
                </View>

                {/* Comment text */}
                <View style={{ marginTop: 9, marginStart: 4,}}>
                  <AppText variant='small' secondary style={{ lineHeight: 20, marginRight: 7,}}>
                    {item.text}
                  </AppText>
                </View>

              </View>
            )}
            ListEmptyComponent={
              <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <AppText variant='caption'>No comments yet</AppText>
              </View>
            }
            />

          {/* ## Add new comment ## */}
          <View style={styles.commentInputRow}>
            <TextInput
              placeholder="Add a comment..."
              value={commentText}
              onChangeText={setCommentText}
              style={styles.commentInput}
            />
            <TouchableOpacity style={{ marginLeft: 10 }} onPress={addComment}>
              <SendIcon width={32} height={32} />
            </TouchableOpacity>
          </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({

  /* ## Post Card Style ## */
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 12,
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent:'space-between' , 
    marginBottom: 10 
  },

  /* ## Post Avatar Style ## */
  avatarHeader: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  avatarContainer: {
    width:50,
    height:50,
    marginRight: 10,
  },
  avatar: { 
    width: "100%", 
    height: "100%", 
    borderRadius: 25,
  },
  
  /* ## Post Image, text Style ## */
  imageCard: {
    width:"100%", 
    height: 400, 
    marginTop: 5, 
    marginBottom: 10, 
  },
  postImage: { 
    width: '100%', 
    height: "100%", 
    borderRadius: 10, 
  },
  text: { 
    color: '#333', 
    marginTop: 10, 
    marginBottom: 10, 
    textAlign: "justify", 
    paddingHorizontal: 10, 
  },

  /* ## Post Engagement Style ## */
  engagement: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  engageItem: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  engageText: { 
    marginLeft: 6, 
    color: '#444' 
  },

  /* ## Comment Modal Style ## */
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)', 
  },
  modalContent: {
    height: '70%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 17,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
  },
});
