import { FlatList, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import PostCard, { Post } from './PostCard';
import { collection, doc, getDoc, getFirestore, onSnapshot, orderBy, query, where } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import FeedLoader from './FeedLoader';
import AppText from './AppText';



const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasShuffled, setHasShuffled] = useState(false);

  const app = getApp();
  const currentUserId = getAuth(app).currentUser?.uid;

  const db = getFirestore(app);

  function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

/* ## Fetching Posts Except the current User ## */
  useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    const postRef = collection(db, 'posts');
    const q = query(postRef, where("userId", "!=", currentUserId), orderBy('userId'));
    const unsubscribe = onSnapshot(q, async snap => {
      try {
        if (snap.empty) {
          setPosts([]);
        } else {
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
              userId: post.userId,
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
          if (!hasShuffled) {
            const shuffled = shuffleArray(fetchedPosts);
            setPosts(shuffled);
            setHasShuffled(true);
          } else {
            setPosts(fetchedPosts);
          }
        }
        
      } catch (error: any) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();

  }, [currentUserId]);

  /* ________________________________ ## Feed UI ## ________________________________ */
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
              <AppText secondary variant='small'>No posts yet. Be the first to post!</AppText>
            </View>
          }
        />
      )}
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
