import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import PostCard, { Post } from './PostCard';
import { collection, doc, getDoc, getFirestore, onSnapshot, orderBy, query, where } from '@react-native-firebase/firestore';
import { useTheme } from '../context/ThemeContext';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import FeedLoader from './FeedLoader';



const Feed: React.FC = () => {
  const { appTheme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const app = getApp();
  const currentUserId = getAuth(app).currentUser?.uid;

  const db = getFirestore(app);

/* ## Fetching Posts Except the current User ## */
  useEffect(() => {

    const postRef = collection(db, 'posts');
    const q = query(postRef, where("userId", "!=", currentUserId), orderBy('userId'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, async snap => {

      if (snap.empty) {
        setPosts([]); 
        setLoading(false);
        return;
      }
      
      const rawPosts = snap.docs.map((docSnap : any) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Post, "id">),
      }));

      const userIds: string[] = Array.from(
        new Set(rawPosts.map((p: any) => p.userId as string))
      );

      const userDocs = await Promise.all(
        userIds.map((uid: string) => getDoc(doc(db, 'users', uid)))
      );

      const userCache: Record<string, any> = {};
      userDocs.forEach(userSnap =>{
        if (userSnap.exists()) userCache[userSnap.id] = userSnap.data(); 
      });

      const fetchedPosts: Post[] = rawPosts.map((post: any) => {
        const user = userCache[post.userId];
        return {
          id: post.id,
          text: post.text,
          imageUrl: post.imageUrl,
          likes: post.likes,
          comments: post.comments,
          shares: post.shares,
          createdAt: post.createdAt,
          name: user?.name ?? "Unknown",
          username: user?.username ?? "@unknown",
          avatar: user?.avatar ?? null,
        };
      });
      const randomPost = fetchedPosts.sort(() => Math.random() - 0.5);
      setPosts(randomPost);
      setLoading(false);
    });

    return () => unsubscribe();

  }, [currentUserId]);




  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <FeedLoader visible={loading} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <PostCard post={item} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text>No posts yet. Be the first to post!</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  loaderContainer: {
    backgroundColor: '#eee',
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
