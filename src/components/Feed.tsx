import { FlatList, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import PostCard, { Post } from './PostCard';
import { collection, doc, getDoc, getFirestore, onSnapshot, orderBy, query, where } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import FeedLoader from './FeedLoader';
import AppText from './AppText';

interface FeedProps {
  searchQuery?: string;
}

const Feed: React.FC<FeedProps> = ({ searchQuery = "" }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasShuffled, setHasShuffled] = useState(false);

  const app = getApp();
  const currentUserId = getAuth(app).currentUser?.uid;
  const db = getFirestore(app);

  /* ## Shuffling the Posts ## */
  function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* __________________________________ Fetching Posts Except the current User __________________________________ */
  useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const processSnapshot = async (snap: any) => {
      if(snap.empty()) return[];

      /* ## Fetching Raw Posts ## */
      const rawPosts = snap.docs.map((docSnap: any)=> ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Post, "id">),
      }));

      /* ## Fetching Ids of Users from the posts ## */
      const userIds: string[] = Array.from(new Set(rawPosts.map((p: any) => p.userId as string)));

      /* ## Fetching Users data from IDs ## */
      const userDocs = await Promise.all(
        userIds.map((uid: string) => getDoc(doc(db, 'users', uid)))
      );

      const userCache: Record<string, any> = {};
      userDocs.forEach(userSnap => {
        if (userSnap.exists()) userCache[userSnap.id] = userSnap.data();
      });

      /* ## Returning the fetched posts data including with the user data ## */
      return rawPosts.map((post: any) => {
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
        } as Post;
      });
    };

    /* ________________________________ Search Queries Strategy ________________________________ */
    if(searchQuery.trim().length > 0) {
      const lower = searchQuery.toLowerCase();

      const postRef = collection(db, 'posts');
      const usersRef = collection(db, 'users');

      /* ## Post Text Search ## */
      const textQuery = query(
        postRef,
        where('text', '>=', lower),
        where('text', '<=', lower + '\uf8ff')
      );

      /* ## User name Search ## */
      const nameQuery = query(
        usersRef,
        where('name', '>=', lower),
        where('name', '<=', lower + '\uf8ff')
      );

      /* ## User username Search ## */
      const usernameQuery = query(
        usersRef,
        where('username', '>=', lower),
        where('username', '<=', lower + '\uf8ff')
      );

      const unsubText = onSnapshot(textQuery, async (textSnap) => {
        const textPosts = await processSnapshot(textSnap);

        /* Fetch matching users (name + username) */
        const nameSnap = await new Promise<any>((resolve) => {
          onSnapshot(nameQuery, resolve);
        });
        const usernameSnap = await new Promise<any>((resolve) => {
          onSnapshot(usernameQuery, resolve);
        });

        /* Merge user IDs from name and username queries */
        const matchedUserIds = new Set<string>();
        nameSnap.forEach((doc: any) => matchedUserIds.add(doc.id));
        usernameSnap.forEach((doc: any) => matchedUserIds.add(doc.id));

        /* Fetch posts of matched users */
        let userPosts: Post[] = [];
        if (matchedUserIds.size > 0) {
          const usersPostQuery = query(
            postRef,
            where('userId', 'in', Array.from(matchedUserIds))
          );
          const userSnap = await new Promise<any>((resolve) => {
            onSnapshot(usersPostQuery, resolve);
          });
          userPosts = await processSnapshot(userSnap);
        }
        /* Merge all results without duplicates */
        const allPosts = [...textPosts, ...userPosts];
        const uniquePosts = Array.from(new Map(allPosts.map(p => [p.id, p])).values());

        setPosts(uniquePosts);
        setLoading(false);
      });

      return () => unsubText();
    }
    /* Default feed (no search) */
    const postRef = collection(db, 'posts');
    const q = query(postRef, where("userId", "!=", currentUserId), orderBy('userId'));

    const unsubscribe = onSnapshot(q, async snap => {
      try {
        const fetchedPosts = await processSnapshot(snap);

        if (!hasShuffled) {
          setPosts(shuffleArray(fetchedPosts));
          setHasShuffled(true);
          } else {
          setPosts(fetchedPosts);
        }

      } catch (error) {
        console.error("Feed fetch error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();

  }, [currentUserId, searchQuery]);

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
