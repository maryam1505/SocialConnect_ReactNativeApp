import { Alert, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import { formatDistanceToNow } from 'date-fns';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { collection, doc, getFirestore, increment, onSnapshot, orderBy, query, runTransaction, serverTimestamp, updateDoc } from '@react-native-firebase/firestore';
import SendIcon from '../../assets/icons/send.svg';
import CloseIcon from '../../assets/icons/close.svg';
import { Share } from 'react-native';

export interface Post {
  id: string;
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

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentCount, setCommentCount] = useState(0);
  const [sharesCount, setSharesCount] = useState(0);

  const app = getApp();
  const db = getFirestore(app);

  const userId = getAuth(app).currentUser?.uid;

  /* -------------------------------- ## Handling Likes ## -------------------------------- */

  /* ## Animation for like Button ## */
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  /* ## If the User already liked ## */
  useEffect(()=>{
    if(!userId) return;
    const likeRef = doc(db, 'posts', post.id, 'likes', userId);
    const unsubscribe = onSnapshot(likeRef, (docSnap) => {
      if (docSnap.exists()) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    });

    return unsubscribe;

  }, [post.id, userId]);

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
    const userId = getAuth(getApp()).currentUser?.uid;
    if (!userId) return;

    const likeRef = doc(db, 'posts', post.id, 'likes', userId);
    const postRef = doc(db, 'posts', postId);

    if(isLiked) {
      /* ## Unlike Post ## */
      await runTransaction(db, async transaction => {
        transaction.delete(likeRef);
        transaction.update(postRef, {likes: increment(-1)});
      });

    } else {
      /* ## Like Post ## */
      await runTransaction(db, async transaction => {
        transaction.set(likeRef, {isLiked: true});
        transaction.update(postRef, {likes: increment(1)});
      });
    }

    scale.value = withSpring(1.3, {}, () => {
      scale.value = withSpring(1);
    });
  };


  /* -------------------------------- ## Handling Comments ## -------------------------------- */

  /* ## Fetch Realtime Comments ## */
  useEffect(() => {
    const CommentRef = collection(db,'posts', post.id,'comments');
    const q = query(CommentRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const fetched = snapshot.docs.map((docSnap: any)  => ({id: docSnap.id, ...docSnap.data()}));
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
    if (!userId || !commentText.trim()) return;
    const user = getAuth(app).currentUser;

    const commentRef = doc(db, 'posts', post.id, 'comments');
    const postRef = doc(db, 'posts',post.id);

    await runTransaction(db, async transaction => {
      transaction.set(commentRef, {
        userId: user?.uid,
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
  const sharePost = async (postId: any) => {
    try {
      const postRef = doc(db, 'posts', postId);
      const url = `socialconnect://post/${postId}`;
      await updateDoc(postRef, {
        shares: increment(1),
      });
      await Share.share({
        message: `${post.text ?? 'Check out this post!'}\n\n${url}\n\nShared via MyApp--SocialConnect`,
        url: url,
      });
    } catch (error) {
      Alert.alert("Error", "Unable to share the post right now.");
      console.error("Share error:", error);
    }
  }

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


  return (
    <View style={styles.card}>
      {/* User Info */}
      <View style={styles.header}>
        <View style={styles.avatarHeader}>
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
            <Text style={styles.name}>{post.name}</Text>
            <Text style={styles.time}>{post.username}</Text>
          </View>
        </View>
        <Text style={styles.time}>
          {post?.createdAt
            ? formatDistanceToNow(post.createdAt.toDate(), {
              addSuffix: false,
            })
            : 'Just now'}
        </Text>
      </View>

      {/* Post Text */}
      {post.text ? <Text style={styles.text}>{post.text}</Text> : null}

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
            <Text style={styles.engageText}>{likes}</Text>
          </TouchableOpacity>

        {/* ## Comments ## */}
        <TouchableOpacity style={styles.engageItem} onPress={() => setShowComments(true)}>
          <Ionicons name="chatbubble-outline" size={20} color="#444" />
          <Text style={styles.engageText}>{commentCount}</Text>
        </TouchableOpacity>

        {/* ## Share ## */}
        <TouchableOpacity style={styles.engageItem} onPress={() => sharePost(post.id)}>
          <Ionicons name="share-social-outline" size={20} color="#444" />
          <Text style={styles.engageText}>{sharesCount}</Text>
        </TouchableOpacity>
        
      </View>

      {/* ## -------------------------- Comments Model -------------------------- ## */}
      <Modal visible={showComments} animationType='slide' transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            {/* ## Header ## */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comments</Text>
              <TouchableOpacity onPress={()=>setShowComments(false)}>
                <CloseIcon width={50} height={50} />
              </TouchableOpacity>
            </View>
          
            {/* ## Comments List ## */}
            <FlatList data={comments} keyExtractor={item => item.id}
            renderItem={({item}) => (
              <Text style={{ paddingVertical: 5 }}>
                <Text style={{ fontWeight: '600' }}>{item.username}:</Text> {item.text}
              </Text>
            )}
            ListEmptyComponent={
              <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <Text style={{ color: 'gray', fontSize: 14 }}>No comments yet</Text>
              </View>
            }
            />

            {/* ## Add new comment ## */}
          <View
            style={styles.commentInputRow}>
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
  name: { 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  time: { 
    color: 'gray', 
    fontSize: 12 
  },
  
  /* ## Post Image Style ## */
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
    fontSize: 14,
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
    fontSize: 13, 
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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
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
