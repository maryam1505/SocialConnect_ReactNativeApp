import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import PostCard, { Post } from './PostCard';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from '../context/ThemeContext';
import auth from '@react-native-firebase/auth';


const Feed: React.FC = () => {
  const { appTheme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = auth().currentUser?.uid;

  useEffect(() => {

    const unsubscribe = firestore()
    .collection('posts')
    .where("userId", "!=", currentUserId)
    .orderBy('userId')
    .orderBy('createdAt', 'desc')
    .onSnapshot(async snapshot => {

      if (snapshot.empty) {
        setPosts([]); 
        setLoading(false);
        return;
      }
      
      const rawPosts = snapshot.docs.map((doc)=> ({
        id: doc.id,
        ...doc.data(),
      }));

      const userIds = Array.from(new Set(rawPosts.map((p: any) => p.userId)));

      const userDocs = await Promise.all(
        userIds.map((uid)=> firestore().collection('users').doc(uid).get())
      );

      const userCache: Record<string, any> = {};
      userDocs.forEach((doc)=>{
        if (doc.exists()) userCache[doc.id] = doc.data(); 
      });

      const fetchedPosts: Post[] = rawPosts.map((post:any) => {
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
          userAvatar: user?.avatar ?? null,
        };
      });

      setPosts(fetchedPosts);
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


  if (posts.length === 0) {
    return (
      <View style={styles.empty}>
        <Text>No posts yet. Be the first to post!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <PostCard post={item} />}
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
