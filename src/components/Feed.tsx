import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import PostCard, { Post } from './PostCard';
import { collection, doc, getDoc, getFirestore, onSnapshot, orderBy, query, where } from '@react-native-firebase/firestore';
import { useTheme } from '../context/ThemeContext';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { useRoute } from '@react-navigation/native';



const Feed: React.FC = () => {
  const { appTheme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [highlightPost, setHighlightPost] = useState<Post | null>(null);

  const app = getApp();
  const currentUserId = getAuth(app).currentUser?.uid;

  const db = getFirestore(app);

  const route = useRoute();
  const deepLinkPostId = (route.params as any)?.id;

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

      let highlight: Post | null = null;
      let rest: Post[] = fetchedPosts;

      if (deepLinkPostId) {
        highlight = fetchedPosts.find(p => p.id === deepLinkPostId) ?? null;
        rest = fetchedPosts.filter(p => p.id !== deepLinkPostId);
      }
      rest = rest.sort(() => Math.random() - 0.5);

      setHighlightPost(highlight);
      setPosts(rest);
      setLoading(false);
    });

    return () => unsubscribe();

  }, [currentUserId]);

   if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={appTheme.colors.primaryDark} />
      </View>
    );
  }

  return (
    <FlatList
      data={highlightPost ? [highlightPost, ...posts] : posts}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <PostCard post={item} />}
      ListEmptyComponent={<View style={styles.empty}>
        <Text>No posts yet. Be the first to post!</Text>
      </View>}
    />
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
